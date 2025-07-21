import { Component, inject, OnInit } from '@angular/core';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { CommonModule } from '@angular/common';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierCreateComponent } from '../admin/supplier-create/supplier-create.component';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierviewComponent } from '../admin/supplierview/supplierview/supplierview.component';


@Component({
  selector: 'app-supplier',
  standalone: true,
imports: [
  CommonModule,
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
  MatIconModule,
],

  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss',
})
export class SupplierComponent implements OnInit {
  supservice = inject(SupplierService);
supplierbank=inject(SupplierBankAccountsService);
supplierbankacc=inject(SupplierBankService);
  supplier: ISupplier[] = [];
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
searchByCode = false;
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
      sort:'id,desc'
    };

    if (this.filter.name.trim()) {
      params['name.contains'] = this.filter.name.trim();
    }

    if (this.filter.code.trim()) {
      params['code.contains'] = this.filter.code.trim();
    }

    this.supservice.query(params).subscribe({
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

  viewSupplier(supplier: ISupplier): void {
    // Navigate or show modal — customize as needed
    console.log('Viewing supplier:', supplier);
  }
}
