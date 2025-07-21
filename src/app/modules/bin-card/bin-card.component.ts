import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { SupplierCreateComponent } from '../admin/supplier-create/supplier-create.component';
import { SupplierviewComponent } from '../admin/supplierview/supplierview/supplierview.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterModule } from '@angular/router';
import { BinCardService } from 'app/entities/inventorymicro/bin-card/service/bin-card.service';
import { IBinCard } from 'app/entities/inventorymicro/bin-card/bin-card.model';

@Component({
  selector: 'app-bin-card',
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
  templateUrl: './bin-card.component.html',
  styleUrl: './bin-card.component.scss'
})
export class BinCardComponent {
supservice = inject(SupplierService);
bincardservice=inject(BinCardService)
supplierbank=inject(SupplierBankAccountsService);
supplierbankacc=inject(SupplierBankService);
  supplier: IBinCard[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
searchByCode = false;
  // 👇 new filter model to bind to form
 filter = {
  name: '',
  code: '',
  dateRange: {
    start: null,
    end: null
  }
};
 

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

onDateChange() {
  console.log(this.filter. dateRange.start)
   console.log(this.filter. dateRange.end)
  if (this.filter. dateRange.start && this.filter.dateRange.end) {
    this.loadSuppliers();
  }
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
 
onFilterChange() {
  // Clear irrelevant filters
  if (this.showDateRange) {
    this.filter.name = '';
    this.filter.code = '';
  } else {
    if (this.searchByCode) {
      this.filter.name = '';
    } else {
      this.filter.code = '';
    }
    // Also clear date range if not searching by date
    this.filter.dateRange.start = null;
    this.filter.dateRange.end = null;
  }

  this.loadSuppliers();
}

showDateRange: boolean = false;
  showId = false;  // or true, depending on when you want to show the id column

get displayedColumns(): string[] {
  const cols = [
    // columns that always show
   'code',
  
  'vehicleOwnerName',
  'vehicleBrand',
  'description',
  'qtyOut',
  'vehicleModel',
   'referenceDoc',
 'recdate',
 
 
  'action'
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
  onAddMore() {
  const queryParams: any = {};

  // Include relevant query param based on selected filter type
  if (this.showDateRange && this.filter.dateRange.start && this.filter.dateRange.end) {
    queryParams.grndaterange = `${this.filter.dateRange.start}|${this.filter.dateRange.end}`;
  } else if (this.searchByCode && this.filter.code) {
    queryParams.grncode = this.filter.code;
  } else if (!this.searchByCode && this.filter.name) {
    queryParams.grnname = this.filter.name;
  }

  // Navigate to target route with dynamic queryParams
  this.router.navigate(['/bin-card-print'], { queryParams });
}

  openVehicleCreateDialog(): void {
    const dialogRef = this._dialogService.open(SupplierCreateComponent , {
      width: "80vh",
      maxHeight: "95vh",
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this._snackBarService.open("Vehicle Created Successfully!", "Close", {
          duration: 3000,
        });
        
      }
    });
  }
viewopenSupplierViewDialog(supplierId: number): void {
  this._dialogService.open(SupplierviewComponent, {
  data: { id: supplierId }  // pass just the ID
});}

  loadSuppliers(): void {
  const params: any = {
    page: this.currentPage - 1,
    size: this.pageSize,
    sort: ['id,desc'] // Default sorting by ID ascending
  };

  if (this.filter.name?.trim()) {
    params['reference.contains'] = this.filter.name.trim();
  }

  if (this.filter.code?.trim()) {
    params['itemCode.contains'] = this.filter.code.trim();
  }

  // Add date filters
  if (this.filter.dateRange.start) {
    params['recordDate.greaterThanOrEqual'] = this.formatDate(this.filter.dateRange.start, 'start');
  }

  if (this.filter.dateRange.end) {
    params['recordDate.lessThanOrEqual'] = this.formatDate(this.filter.dateRange.end, 'end');
  }

  this.bincardservice.query(params).subscribe({
    next: response => {
      this.supplier = response.body || [];
      const total = response.headers.get('X-Total-Count');
      this.totalItems = total ? +total : 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    },
    error: err => {
      console.error('Error fetching supplier data:', err);
    }
  });
}

formatDate(date: Date, bound: 'start' | 'end'): string {
  const d = new Date(date);
  if (bound === 'start') {
    d.setHours(0, 0, 0, 0);
  } else {
    d.setHours(23, 59, 59, 999);
  }
  return d.toISOString(); // Converts to 'YYYY-MM-DDTHH:mm:ssZ'
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
