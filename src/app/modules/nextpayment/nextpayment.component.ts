import { Component, inject, ViewChild } from '@angular/core';
import { GRNService } from 'app/entities/inventorymicro/grn/service/grn.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import dayjs from 'dayjs/esm';
import { switchMap, of, map, forkJoin } from 'rxjs';
import { SupplierviewComponent } from '../admin/supplierview/supplierview/supplierview.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { SupplierCreateComponent } from '../admin/supplier-create/supplier-create.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { GrnViewsComponent } from '../admin/grn-views/grn-views.component';

@Component({
  selector: 'app-nextpayment',
  standalone: true,
  imports: [  CommonModule,
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
  templateUrl: './nextpayment.component.html',
  styleUrl: './nextpayment.component.scss'
})
export class NextpaymentComponent {

nextpaymentdata = [

];

@ViewChild(MatPaginator) paginator: MatPaginator;

grnservice = inject(GRNService);
supplierbanks = inject(SupplierBankService);
supplier = inject(SupplierService);
  supservice: any;

 

fetchpaymentdata(): void {
  this.grnservice.query('amountOwing.notEquals=0&page=0&size=20').subscribe({
    next: (res) => {
      const grns = res.body ?? [];
const total = res.headers.get('X-Total-Count');
        this.totalItems = total ? +total : 0;
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      const dataRequests = grns.map((grn: any) =>
        this.supplier.query(`name.equals=${grn.supplierName}`).pipe(
          switchMap((supplierRes: any) => {
            const supplier = supplierRes.body?.[0];
            if (!supplier) return of(null);

            return this.supplierbanks.find(supplier.id).pipe(
             map((bankRes: any) => {
 const grnDate = dayjs(grn.grnDate); // GRN date
const today = dayjs();
const creditPeriod = bankRes.creditPeriod || 0;
const dueDate = grnDate.add(creditPeriod, 'day');

// daysdue = number of days **until** due date (positive means due in future, negative means overdue)
const daysdue = dueDate.diff(today, 'day');

// daysdiff could be absolute difference or something else, let's assume absolute days between GRN date and today:
const daysdiff = today.diff(grnDate, 'day');

return {
  id:grn.id,
  grncode: grn.grnCode || '',
  grnDate,               // keep as Dayjs object (or grnDate.toISOString() if preferred)
  amountowing: grn.amountOwing || 0,
  suppliername: grn.supplierName || '',
  invoicecode: grn.invoiceCode || '',
  creditlimit: bankRes.maximumCreditLimit || 0,
  creditperiod: creditPeriod,
  daysdue,               // number of days until due
  daysdiff,              // number of days since grnDate
  bankInfo: bankRes
};

})

            );
          })
        )
      );

      forkJoin(dataRequests).subscribe((results) => {
        this.nextpaymentdata = results.filter(Boolean);
        console.log('Fetched payment data:', this.nextpaymentdata);
      });
    },
    error: (err) => {
      console.error('Error fetching GRNs:', err);
    }
  });
}

upservice = inject(SupplierService);
supplierbank=inject(SupplierBankAccountsService);
supplierbankacc=inject(SupplierBankService);
  
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
totalOwing: number = 0;

totalAmountOwing(): void {
  const params = {
    'amountOwing.greaterThan': 0,
    page: 0,
    size: 1000 // 👈 set to a large enough number to fetch all relevant records
  };

  this.grnservice.query({  'amountOwing.greaterThan': 0, 'inspected.equals': false,size: 1000000000 }).subscribe({
    next: (response: any) => {
      const data = response.body?.content || response.body || response;
      console.log('Fetched data:', data);

      const total = data.reduce((sum: number, item: any) => {
        return sum + (item.amountOwing || 0); // use correct field name
      }, 0);

      this.totalOwing = total;
      console.log('Total Amount Owing:', this.totalOwing);
    },
    error: (error) => {
      console.error('Failed to fetch data:', error);
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

updateAmountOwing(id: number, amount: number): void {
  const updatePayload = {
    inspected: true,
    total: amount
  };

  this.grnservice.partialUpdate({ id, ...updatePayload }).subscribe({
    next: (response) => {
      console.log('Update successful:', response);

      // Reset paginator UI (optional)
      if (this.paginator) {
        this.paginator.firstPage(); // Resets UI and emits change
      }

      // You may still reset manually if needed
      this.currentPage = 1;

      this.loadSuppliers(); // Refetch data
    },
    error: (error) => {
      console.error('Update failed:', error);
    }
  });
}




itemsPerPage: number = 10;
  ngOnInit(): void {
   this.loadSuppliers();
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


  showId = false;  // or true, depending on when you want to show the id column

get displayedColumns(): string[] {
  const cols = [
    // columns that always show
    'code',
  
  'vehicleOwnerName',
  'vehicleBrand',
  'vehicleModel',
 'creditperiod',
 'invoicecode',
 'daysdue',
 'creditlimit',
 'daysdiff',
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
        this._snackBarService.open("Vehicle Created Successfully!", "Close", {
          duration: 3000,
        });
        
      }
    });
  }
 


viewopenSupplierViewDialog(grnId: number, name: string ,code:string): void {
  this._dialogService.open(GrnViewsComponent, {
    width: '900px',     // or any desired size like '400px', '30vw', etc.
    height: 'auto',     // optional, can be set to a fixed value or left to auto
    data: { id: grnId, name: name ,code : code } // Pass the necessary data
  });
}


loadSuppliers(): void {
  const params: any = {
    page: this.currentPage - 1,
    size: this.pageSize,
    'inspected.in': false,

  };
  console.log(this.filter.code.trim())
this.totalAmountOwing();
  if (this.filter.name.trim()) {
    params['supplierName.contains'] = this.filter.name.trim();
  }

  if (this.filter.code.trim()) {
    params['grnCode.contains'] = this.filter.code.trim();
  }

    this.grnservice.query(params).subscribe({
    next: async (res) => {
      const grns = res.body ?? [];
      const total = res.headers.get('X-Total-Count');
      this.totalItems = total ? +total : 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
 
console.log(grns)
     this.nextpaymentdata = []; // Reset before adding fresh items

for (const grn of grns) {
  try {
    const supplierRes = await this.supplier.query({ 'name.equals': grn.supplierName }).toPromise();
    const supplier = supplierRes.body?.[0];

    let bank = null;
    let creditLimit = 0;
    let creditPeriod = 0;

    if (supplier?.id) {
      const bankRes = await this.supplierbanks.query({ 'id.equals': supplier.id }).toPromise();
      bank = bankRes.body[0];
      creditLimit = bank?.maximumCreditLimit || 0;
      creditPeriod = bank?.creditPeriod || 0;
    }

    const grnDate = dayjs(grn.grnDate);
    const today = dayjs();
    const daysdiff = today.diff(grnDate, 'day');
    const daysdue = creditPeriod - daysdiff;

    // ✅ Add new entry using new array spread
    this.nextpaymentdata = [
      ...this.nextpaymentdata,
      {
        id: grn.id,
        grncode: grn.grnCode || '',
        grnDate: grn.grnDate, // use raw string or format if needed
        amountowing: grn.amountOwing || 0,
        suppliername: grn.supplierName || '',
        invoicecode: grn.supplierInvoiceCode|| '',
        creditlimit: creditLimit,
        creditperiod: creditPeriod,
        daysdue,
        daysdiff,
        bankInfo: bank
      }
    ];

  } catch (err) {
    console.error('Error loading supplier or bank info:', err);
  }
}

    },
    error: (err) => {
      console.error('Error fetching GRNs:', err);
    }
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
 

      // Optional: use res.headers.get('x-total-count') if you want pagination info
    } 
