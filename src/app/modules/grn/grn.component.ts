import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router'; 
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { SupplierCreateComponent } from '../admin/supplier-create/supplier-create.component';
import { SupplierviewComponent } from '../admin/supplierview/supplierview/supplierview.component';
import { GRNService } from 'app/entities/inventorymicro/grn/service/grn.service';
import { GrnCreateComponent } from '../admin/grn-create/grn-create.component';
import dayjs from 'dayjs/esm';
import { GRNLinesService } from 'app/entities/inventorymicro/grn-lines/service/grn-lines.service';
import { GrnViewsComponent } from '../admin/grn-views/grn-views.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-grn',
  standalone: true,
  imports: [CommonModule,
  FormsModule,
  NgFor,
  NgIf,
  RouterModule,
  // Material modules
MatPaginatorModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule,
  MatIconModule,MatDatepickerModule,
      MatInputModule,
      MatNativeDateModule],
  templateUrl: './grn.component.html',
  styleUrl: './grn.component.scss'
})
export class GrnComponent {
supservice = inject(SupplierService);
 grnservice=inject(GRNService );
 grnlines=inject(GRNLinesService);
supplierbank=inject(SupplierBankAccountsService);
supplierbankacc=inject(SupplierBankService);
  supplier: ISupplier[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // 👇 new filter model to bind to form
  filter = {
    name: '',
    code: '',
    dateRange: {
      start: null as Date | null,
      end: null as Date | null
    }
  };
  showDateRange: boolean = false;

// Example: define supplierId before using it, or move this code into a method and use a parameter
// let supplierId = 1; // Replace with actual supplier ID
// this._dialogService.open(SupplierviewComponent, {
//   data: { id: supplierId }  // pass just the ID
// });
refreshFilters(): void {
  // Clear all filter inputs
  this.filter.code = '';
  this.filter.name = '';
  this.filter.dateRange = { start: null, end: null };

  // Reset toggles if needed
  this.searchByCode = true;   // or false, depending on your default
  this.showDateRange = false;

  // Call your existing loadSuppliers() method to reload data
  this.loadSuppliers();
}

onRowClick(row: any): void {
  // Prevent opening dialog for editable rows
  console.log('Row clicked:', row);
  if (this.editRowId !== row.id) {
    this.viewopenSupplierViewDialog(row.id, row.supplierName,row.grnCode);
  }
}
// Or, move this logic into a method:
viewopenSupplierViewDialog(grnId: number, name: string ,code:string): void {
  this._dialogService.open(GrnViewsComponent, {
    width: '900px',     // or any desired size like '400px', '30vw', etc.
    height: 'auto',     // optional, can be set to a fixed value or left to auto
    data: { id: grnId, name: name ,code : code } // Pass the necessary data
  });
}

// Add these properties to your component
expandedRow: number | null = null;  // Tracks which row is expanded
grnLinesData: any[] = [];          // Stores the GRN lines data

// Your existing function modified
expandAccording(id: number): void {
  if (this.expandedRow === id) {
    // Collapse if clicking the same row
    this.expandedRow = null;
    this.grnLinesData = [];
    return;
  }

  this.expandedRow = id;
  this.grnlines.query({ 'grnId.equals': id }).subscribe({
    next: (data) => {
      this.grnLinesData = data.body || [];
      console.log('GRN Lines:', this.grnLinesData);
    },
    error: (err) => {
      console.error('GRN Lines error:', err);
      // Handle error (show notification, etc.)
    }
  });
}
selectedSupplierId: number | null = 3;

toggleDetails(id: number): void {
  this.supplierbankacc.find(id).subscribe({
    next: data => {
      console.log('Bank Account:', data);
      // handle/display data
    },
    error: err => console.error('Bank Account error:', err)
  });

  this.supplierbank.find(id).subscribe({
    next: data => {
      console.log('Bank:', data);
    },
    error: err => console.error('Bank error:', err)
  });

  this.supservice.find(id).subscribe({
    next: data => {
      console.log('Supplier:', data);
    },
    error: err => console.error('Supplier error:', err)
  });
}

onPaginateChange(event: PageEvent): void {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex + 1;
  this.loadSuppliers();
}

onFilterChange(): void {
  this.currentPage = 1;  // Reset to first page
  this.loadSuppliers();
}
editRowId: number | null = null;
editInputCode: string = '';
editInputDateStr: string = '';

enableEdit(suppliers: any): void {
  this.editRowId = suppliers.id;
  this.editInputCode = suppliers.supplierInvoiceCode;
  this.editInputDateStr = dayjs(suppliers.supplierInvoiceDate).format('YYYY-MM-DD');
}

saveEdit(id: number): void {
  const updatedData = {
    id,
    supplierInvoiceCode: this.editInputCode,
    supplierInvoiceDate: dayjs(this.editInputDateStr)
  };

  this.grnservice.partialUpdate(updatedData).subscribe({
    next: (res) => {
      console.log('Updated successfully:', res);
      // Optionally reload or update the table data
      this.editRowId = null;
    },
    error: (err) => {
      console.error('Error while updating:', err);
    }
  });
}



itemsPerPage: number = 10;
  ngOnInit(): void {
   this.loadSuppliers();
  }


  showId = false;  // or true, depending on when you want to show the id column

get displayedColumns(): string[] {
  const cols = [
    // columns that always show
    'code',
    'vehicleOwnerName',
    'vehicleBrand',
    'vehicleModel',
     'amountowing',
 'subtotal',
    'action'
  ];

  if (this.showId) {
    cols.unshift('id');  // add 'id' column at the start if needed
  }

  return cols;
}
  constructor(
    
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar
  ) {
    
  }
  openVehicleCreateDialog(): void {
  // this.router.navigate(['/admin/grn-create']);
  }
onDateChange() {
  console.log(this.filter. dateRange.start)
   console.log(this.filter. dateRange.end)
  if (this.filter. dateRange.start && this.filter.dateRange.end) {
    this.loadSuppliers();
  }
}

 searchByCode = false;
loadSuppliers(): void {
  const params: any = {
    page: this.currentPage - 1,
    size: this.pageSize,
    sort: 'id,desc'
  };

  if (this.filter.name.trim()) {
    params['supplierName.contains'] = this.filter.name.trim();
  }

  if (this.filter.code.trim()) {
    params['grnCode.contains'] = this.filter.code.trim();
  }

  if (this.filter.dateRange?.start) {
    params['supplierInvoiceDate.greaterThanOrEqual'] = this.formatDate(this.filter.dateRange.start, 'start');
  }

  if (this.filter.dateRange?.end) {
    params['supplierInvoiceDate.lessThanOrEqual'] = this.formatDate(this.filter.dateRange.end, 'end');
  }

  this.grnservice.query(params).subscribe({
    next: response => {
      this.supplier = response.body || [];
      const total = response.headers.get('X-Total-Count');
      this.totalItems = total ? +total : 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      console.log(this.supplier);
    },
    error: err => {
      console.error('Error fetching supplier data:', err);
    },
  });
}


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadSuppliers();
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  // Called by "Load Suppliers" button
  onSearch(): void {
    this.currentPage = 1;
    this.loadSuppliers();
  }

  // Optional if you want to act on dropdown change immediately
  onRowCountChange(): void {
    this.currentPage = 1;
    this.loadSuppliers();
  }

  // Utility method to format date as 'YYYY-MM-DD'
 formatDate(date: Date, type: 'start' | 'end'): string {
  const newDate = new Date(date); // Clone the date to avoid modifying original
  if (type === 'start') {
    newDate.setHours(0, 0, 0, 0); // Start of day
  } else {
    newDate.setHours(23, 59, 59, 999); // End of day
  }
  return newDate.toISOString(); // Return as ISO-8601 string
}

}
