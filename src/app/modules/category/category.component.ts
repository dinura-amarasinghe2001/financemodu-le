import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { CategoryService } from 'app/entities/inventorymicro/category/service/category.service';
import { CategoryCreateComponent } from '../admin/category-create/category-create.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ CommonModule,
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
  MatIconModule,],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
  category= inject(CategoryService);
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
  @ViewChild(MatPaginator) paginator: MatPaginator;
editRowId: number | null = null;
editInputname: string = '';
editfullPath : string = '';

enableEdit(suppliers: any): void {
  this.editRowId = suppliers.id;
  this.editInputname = suppliers.name;  // Fix here
  this.editfullPath = suppliers.fullPath ;        // Fix here
}

getParentName(fullPath: string): string {
  if (!fullPath) return '';

  const parts = fullPath.split('/').filter(part => part.trim() !== '');

  if (parts.length >= 2) {
    // Return second last segment as parent
    return parts[parts.length - 2];
  } else if (parts.length === 1) {
    // If only one segment, parent is same as that segment
    return parts[0];
  }

  return '';
}


saveEdit(id: number): void {
  const updatedData = {
    id,
    name: this.editInputname,
    fullPath:  this.editfullPath 
  };

  this.category.partialUpdate(updatedData).subscribe({
    next: (res) => {
      console.log('Updated successfully:', res);
      this.editRowId = null;
       if (this.paginator) {
        this.paginator.firstPage(); // Resets UI and emits change
      }

      // You may still reset manually if needed
      this.currentPage = 1;

      this.loadSuppliers();
      // Reload or update local table row if needed
    },
    error: (err) => {
      console.error('Error while updating:', err);
    }
  });
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
  this.category.delete(id).subscribe({
    next: () => {
      this._snackBarService.open("  deleted successfully!", "Close", {
        duration: 3000,
      });
      this.loadSuppliers();
    },
    error: (err) => {
      console.error('Supplier delete failed', err);
      this._snackBarService.open("Supplier delete failed", "Close", {
        duration: 3000,
      });
    }
  });
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
 'parentName',
 
 
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
    const dialogRef = this._dialogService.open(CategoryCreateComponent , {
      width: "80vh",
      maxHeight: "95vh",
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this._snackBarService.open("Supplier Created Successfully!", "Close", {
          duration: 3000,
        });
        
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

  loadSuppliers(): void {
    const params: any = {
      page: this.currentPage - 1,
      size: this.pageSize,
    };

    if (this.filter.name.trim()) {
      params['name.contains'] = this.filter.name.trim();
    }

    if (this.filter.code.trim()) {
      params['fullPath.contains'] = this.filter.code.trim();
    }

    this.category.query(params).subscribe({
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
