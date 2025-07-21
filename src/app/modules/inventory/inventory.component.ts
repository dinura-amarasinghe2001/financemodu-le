import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { SupplierviewComponent } from '../admin/supplierview/supplierview/supplierview.component';
import { SupplierCreateComponent } from '../admin/supplier-create/supplier-create.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router, RouterModule } from '@angular/router';
import { InventoryService } from 'app/entities/inventorymicro/inventory/service/inventory.service';
import { IInventory } from 'app/entities/inventorymicro/inventory/inventory.model';
import { InventoryCreateComponent } from '../admin/inventory-create/inventory-create.component';
import { BinCardService } from 'app/entities/inventorymicro/bin-card/service/bin-card.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'app-inventory',
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
  MatIconModule,
  MatAutocompleteModule,
  MatIconModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent {
supservice = inject(SupplierService);
supplierbank=inject(SupplierBankAccountsService);
supplierbankacc=inject(SupplierBankService);
inventoryservice= inject(InventoryService);
bincardsave=inject(BinCardService);
  supplier: IInventory[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;

  // 👇 new filter model to bind to form
  filter = {
    name: '',
    code: ''
  };
// Example: define supplierId before using it, or move this code into a method and use a parameter
// let supplierId = 1; // Replace with actual supplier ID
// this._dialogService.open(SupplierviewComponent, {
//   data: { id: supplierId }  // pass just the ID
// });
 
@ViewChild(MatPaginator) paginator: MatPaginator;
// Or, move this logic into a method:
@ViewChild('reasonDialog') reasonDialog!: TemplateRef<any>;
reductionReason: string = '';
pendingSaveData: { id: number, code: string, name: string, newQty: number, newPrice: number } | null = null;

editRowId: number | null = null;
editInputCode: string = '';
editsell: string = '';

enableEdit(suppliers: any): void {
  this.editRowId = suppliers.id;
  this.editInputCode = suppliers.availableQuantity;  // Fix here
  this.editsell = suppliers.lastSellingPrice;        // Fix here
   this.originalQuantityMap[suppliers.id] = suppliers.availableQuantity;
}

originalQuantityMap: { [key: number]: number } = {};
predefinedReasons: string[] = [
  'Item damaged',
  'Expired product',
  'Incorrect delivery',
  'Customer complaint',
  'Stock correction'
];
saveEdit(id: number, code: string, name: string): void {
  const newQty = Number(this.editInputCode);
  const newPrice = Number(this.editsell);
  const originalQty = this.originalQuantityMap?.[id];

  if (originalQty !== undefined && newQty > originalQty) {
    alert('Increasing quantity is not allowed. Add from GRN');
    return;
  }

  if (originalQty !== undefined && newQty < originalQty) {
    this.pendingSaveData = { id, code, name, newQty, newPrice };
    console.log('codeeeeeeee',code)
    this.reductionReason = '';
    this.dialog.open(this.reasonDialog, {
  width: '500px',    // increase width as needed (e.g., 500px or 600px)
  maxWidth: '90vw',  // optional: max width relative to viewport
  height: '300px',   // optional: set height
  maxHeight: '80vh'  // optional: max height relative to viewport
});

    return;
  }

  this.performUpdate(id, code, name, newQty, newPrice, '');
}
 navigateToExport(): void {
    this.router.navigate(['/inventory-export']);
  }
 confirmReasonFromDialog(dialogRef: any): void {
  if (this.reductionReason.trim() && this.pendingSaveData) {
    const { id, code, name, newQty, newPrice } = this.pendingSaveData;
    console.log('cccccccccccc',code);
    this.performUpdate(id, code, name, newQty, newPrice, this.reductionReason.trim());
 
    dialogRef.close();

    this.reductionReason = '';
    this.pendingSaveData = null;
  } else {
    alert('Please enter a reason before confirming.');
  }
}
refreshFilters(): void {
  // Clear all filter inputs
  this.filter.code = '';
  this.filter.name = '';
 

  // Reset toggles if needed
  this.searchByCode = true;   // or false, depending on your default
   

  // Call your existing loadSuppliers() method to reload data
  this.loadSuppliers();
}

performUpdate(
  id: number,
  code: string,
  name: string,
  qty: number,
  price: number,
  reason: string
): void {
  const updatedData = {
    id,
    availableQuantity: qty,
    lastSellingPrice: price
  };

  this.inventoryservice.partialUpdate(updatedData).subscribe({
    next: (res) => {
      console.log('Updated successfully:', res);

      // Reset editing state
      this.editRowId = null;

      // Reset pagination UI
      if (this.paginator) {
        this.paginator.firstPage();
      }
      this.currentPage = 1;

      // Reload supplier data
      this.loadSuppliers();

      // If there's a reduction reason, create a BinCard entry
      if (reason && reason.trim() !== '') {
        const originalQty = this.originalQuantityMap?.[id] ?? qty; // fallback to qty if missing

        const qtyOut = originalQty - qty; // quantity reduced
        const item = {
          id: null,
          qtyOut: qtyOut,
          recordDate: dayjs() ,
          lmd: dayjs() ,
          itemCode: code,
          reference: name,
          opening: originalQty - qtyOut,
          description: reason.trim()
        };

        this.bincardsave.create(item).subscribe({
          next: (response) => {
            console.log('Bin Card created successfully:', response);
          },
          error: (err) => {
            console.error('Error creating Bin Card:', err);
          }
        });
      }
    },
    error: (err) => {
      console.error('Error while updating:', err);
    }
  });
}


onFilterChange(): void {
  this.currentPage = 1;  // Reset to first page
  this.loadSuppliers();
}
selectedSupplierId: number | null = 3;

 

onPaginateChange(event: PageEvent): void {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex + 1;
  this.loadSuppliers();
}
deleteSupplier(id: number): void {
  
          this.inventoryservice.delete(id).subscribe({
            next: () => {
              this._snackBarService.open("item deleted successfully!", "Close", {
                duration: 3000,
              });
              this.loadSuppliers();
            },
            error: err => {
              console.error('Supplier delete failed', err);
              this._snackBarService.open("item delete failed", "Close", {
                duration: 3000,
              });
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
 'sellprice',
 'cost',
 'reOrderQty',
  'action'
  ];

  if (this.showId) {
    cols.unshift('id');  // add 'id' column at the start if needed
  }

  return cols;
}

  constructor(
    
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar,private dialog: MatDialog,private router: Router
  ) {
    
  }
openVehicleCreateDialog(): void {
  const dialogRef = this._dialogService.open(InventoryCreateComponent, {
    width: "80vh",
    maxHeight: "90vh",
  });

  dialogRef.afterClosed().subscribe(response => {
    console.log('Dialog closed, response:', response);

    if (response) {
      this._snackBarService.open("Item created successfully!", "Close", { duration: 3000 });

      this.currentPage = 1;   // <-- reset page here
      this.loadSuppliers();
    }
  });
}

 searchByCode = false;

 


 loadSuppliers(): void {
  const params: any = {
    page: this.currentPage - 1,
    size: this.pageSize,
     sort: 'availableQuantity,asc' 
  };

  // Only apply the active search filter
  if (this.searchByCode && this.filter.code.trim()) {
    params['code.contains'] = this.filter.code.trim();
  } else if (!this.searchByCode && this.filter.name.trim()) {
    params['name.contains'] = this.filter.name.trim();
  }

  this.inventoryservice.query(params).subscribe({
    next: response => {
      this.supplier = response.body || [];
      const total = response.headers.get('X-Total-Count');
      this.totalItems = total ? +total : 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
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

 
}
