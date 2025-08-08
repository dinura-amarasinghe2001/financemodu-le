import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { SupplierCreateComponent } from '../admin/supplier-create/supplier-create.component';
import { SupplierviewComponent } from '../admin/supplierview/supplierview/supplierview.component';
import { TransactionService } from 'app/entities/financemicro/transaction/service/transaction.service';
import { ITransaction } from 'app/entities/financemicro/transaction/transaction.model';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-transaction',
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
    MatIconModule,MatDatepickerModule, MatNativeDateModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss'
})
export class TransactionComponent implements OnInit {
  supservice = inject(TransactionService);
  supplierbank=inject(SupplierBankAccountsService);
  supplierbankacc=inject(SupplierBankService);
    supplier: ITransaction[] = [];
    currentPage = 1;
    pageSize = 10;
    totalItems = 0;
    totalPages = 0;
  searchByCode = false;
    // 👇 new filter model to bind to form
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
onAddMore() {
  const queryParams: any = {};

  // Use ISO 8601 format with time (UTC)
  const today = new Date();
  const startISO = today.toISOString().split('T')[0] + 'T00:00:00Z';
  const endISO = new Date(today.getTime() + 86400000).toISOString().split('T')[0] + 'T00:00:00Z';

  // If date range is selected
  if (this.showDateRange && this.filter.dateRange.start && this.filter.dateRange.end) {
    const start = new Date(this.filter.dateRange.start).toISOString().split('T')[0] + 'T00:00:00Z';
    const end = new Date(this.filter.dateRange.end).toISOString().split('T')[0] + 'T00:00:00Z';
    queryParams.grndaterange = `${start}|${end}`;
  } else {
    // Default: today and tomorrow
    queryParams.grndaterange = `${startISO}|${endISO}`;
  }

  this.router.navigate(['/dayendtransaction'], { queryParams });
}


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
   
  
  // Or, move this logic into a method:
  openSupplierViewDialog(supplierId: number): void {
    this._dialogService.open(SupplierviewComponent, {
      data: { id: supplierId }  // pass just the ID
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
  deleteSupplier(id: number): void {
    this.supplierbankacc.delete(id).subscribe({
      next: () => {
        this.supplierbank.delete(id).subscribe({
          next: () => {
            this.supservice.delete(id).subscribe({
              next: () => {
                this._snackBarService.open("Supplier deleted successfully!", "Close", {
                  duration: 3000,
                });
                this.loadSuppliers();
              },
              error: err => {
                console.error('Supplier delete failed', err);
                this._snackBarService.open("Supplier delete failed", "Close", {
                  duration: 3000,
                });
              }
            });
          },
          error: err => {
            console.error('Supplier bank delete failed', err);
            this._snackBarService.open("Supplier bank delete failed", "Close", {
              duration: 3000,
            });
          }
        });
      },
      error: err => {
        console.error('Supplier bank account delete failed', err);
        this._snackBarService.open("Supplier bank account delete failed", "Close", {
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
      'subid',
      'source'
    ];
  
    if (this.showId) {
      cols.unshift('id');  // add 'id' column at the start if needed
    }
  
    return cols;
  }
  
    constructor(
      private _dialogService: MatDialog,
      private _snackBarService: MatSnackBar,
      private router: Router
    ) {
      
    }
   
    openVehicleCreateDialog(): void {
      const dialogRef = this._dialogService.open(SupplierCreateComponent , {
        width: "80vh",
        maxHeight: "95vh",
      });
  
      dialogRef.afterClosed().subscribe((response) => {
        if (response) {
          this._snackBarService.open("Supplier Created Successfully!", "Close", {
            duration: 3000,
          });
          this.loadSuppliers();
        }
      });
    }
    
  viewopenSupplierViewDialog(supplierId: number): void {
    this._dialogService.open(SupplierviewComponent, {
    data: { id: supplierId }  // pass just the ID
  });}
  onFilterChange(): void {
    this.currentPage = 1;  // Reset to first page
    this.loadSuppliers();
  }
  clearSearchAndReload() {
    if (this.searchByCode) {
      this.filter.code = '';
    } else {
      this.filter.name = '';
    }
    this.loadSuppliers();
  }
  
   loadSuppliers(): void {
  const params: any = {
    page: this.currentPage - 1,
    size: this.pageSize,
    sort: 'id,desc'
  };

  

  if (this.filter.code.trim()) {
    params['accountCode.contains'] = this.filter.code.trim();
  }

  if (this.filter.dateRange?.start) {
    params['date.greaterThanOrEqual'] = this.formatDate(this.filter.dateRange.start, 'start');
  }

  if (this.filter.dateRange?.end) {
    params['date.lessThanOrEqual'] = this.formatDate(this.filter.dateRange.end, 'end');
  }

  this.supservice.query(params).subscribe({
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
   formatDate(date: Date, type: 'start' | 'end'): string {
  const newDate = new Date(date); // Clone the date to avoid modifying original
  if (type === 'start') {
    newDate.setHours(0, 0, 0, 0); // Start of day
  } else {
    newDate.setHours(23, 59, 59, 999); // End of day
  }
  return newDate.toISOString(); // Return as ISO-8601 string
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
  
    viewSupplier(supplier: ISupplier): void {
      // Navigate or show modal — customize as needed
      console.log('Viewing supplier:', supplier);
    }

}
