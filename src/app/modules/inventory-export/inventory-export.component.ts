import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { InventoryService } from "app/entities/inventorymicro/inventory/service/inventory.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";


@Component({
  selector: 'app-inventory-export',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './inventory-export.component.html',
  styleUrls: ['./inventory-export.component.scss']
})
export class InventoryExportComponent implements OnInit {
  selectedFile: File | null = null;
  inventoryservice = inject(InventoryService);
snackBar = inject(MatSnackBar);

  items: any[] = [
 
  ];
  pagedItems = this.items.slice(0, 5);
  currentPage = 1;
  pageSize = 5;

  // Store the last code number for incrementing
  lastCodePrefix = 'ITEM';
  lastCodeNumber = 1;

  ngOnInit(): void {
    this.fetchInventoryCode();
  }

  fetchInventoryCode(): void {
    const queryParams = {
      sort: ['id,desc'],
      size: 1
    };

    this.inventoryservice.query(queryParams).subscribe({
      next: (data) => {
        const items = data.body || [];
        const lastItem = items.length > 0 ? items[0] : null;
        const lastCode = lastItem?.code || 'ITEM000';

        this.lastCodePrefix = lastCode.match(/[A-Za-z]+/)?.[0] || 'ITEM';
        const numberPart = parseInt(lastCode.replace(/\D/g, ''), 10);
        this.lastCodeNumber = isNaN(numberPart) ? 1 : numberPart + 1;
      },
      error: (error) => {
        console.error('Error fetching inventory code:', error);
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile.name);
    }
  }

  processFile() {
    if (!this.selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      this.parseCSV(text);
    };
    reader.readAsText(this.selectedFile);
  }

  parseCSV(csvText: string) {
    const lines = csvText.split(/\r\n|\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) {
      alert('CSV file is empty or invalid');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());

    const data = lines.slice(1).map(line => {
      const cols = line.split(',');
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header] = cols[i] ? cols[i].trim() : '';
      });
      return obj;
    });

    // Generate new items with incremental code
    const newItems = data.map(row => {
      const newCode = `${this.lastCodePrefix}${this.lastCodeNumber.toString().padStart(3, '0')}`;
      this.lastCodeNumber++; // increment for next item

      return {
        name: row['name'] || '',
        code: newCode,
        availableQuantity: Number(row['availableQuantity']) || 0,
        lastSellingPrice: Number(row['lastSellingPrice']) || 0,
        lastCost: Number(row['lastCost']) || 0,
        reOrderQty: Number(row['reOrderQty']) || 0,
        checkType: row['checkType'] || '',
      };
    });

    // Merge or replace existing items
    this.items = [...this.items, ...newItems];

    // Refresh pagination
    this.currentPage = 1;
    this.pageSize = 5;
    this.onPaginateChange({ pageIndex: 0, pageSize: this.pageSize, length: this.items.length });
  }

saveItems() {
  console.log('Saving items:', this.items);

  let successCount = 0;
  const totalItems = this.items.length;

  this.items.forEach(item => {
    const namePart = item.name.replace(/^"(.*)"$/, '$1');
    const codePart = item.code.replace(/^"(.*)"$/, '$1');
    const checkType = item.checkType.replace(/^"(.*)"$/, '$1');
    const keyword = `${codePart}${namePart}`;

    const sanitizedItem = {
      ...item,
      name: namePart,
      code: codePart,
      checkType: checkType,
      keyword: keyword
    };

    this.inventoryservice.create(sanitizedItem).subscribe({
      next: (response) => {
        successCount++;
        if (successCount === totalItems) {
          this.snackBar.open('All items created successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
            setTimeout(() => {
    window.location.reload();
  }, 3000);
        }
      },
      error: (error) => {
        console.error('Error saving item:', error, 'Item:', sanitizedItem);
      }
    });
  });
}





  get displayedColumns(): string[] {
    return [
      'itemName',
      'manufactureDate',
      'purcost',
      'sellprice',
      'sellingPrice',
      'lineTotal',
      'reorderQty',
      'actions'
    ];
  }

  onPaginateChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.pagedItems = this.items.slice(startIndex, endIndex);
  }

  deleteItem(item: any) {
    this.items = this.items.filter(i => i !== item);
    this.onPaginateChange({
      pageIndex: this.currentPage - 1,
      pageSize: this.pageSize,
      length: this.items.length
    });
  }
}
