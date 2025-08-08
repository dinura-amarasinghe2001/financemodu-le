import { ChangeDetectorRef, Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountTypeService } from 'app/entities/financemicro/account-type/service/account-type.service';
import { AccountsService } from 'app/entities/financemicro/accounts/service/accounts.service';
import { BinCardService } from 'app/entities/inventorymicro/bin-card/service/bin-card.service';
import { GRNLinesService } from 'app/entities/inventorymicro/grn-lines/service/grn-lines.service';
import { GRNService } from 'app/entities/inventorymicro/grn/service/grn.service';
import { InventoryService } from 'app/entities/inventorymicro/inventory/service/inventory.service';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { TheGRNLineBatchesService } from 'app/entities/inventorymicro/the-grn-line-batches/service/the-grn-line-batches.service';
import { TheInventoryBatchesService } from 'app/entities/inventorymicro/the-inventory-batches/service/the-inventory-batches.service';
import dayjs from 'dayjs/esm';
import { debounceTime, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TransactionService } from 'app/entities/financemicro/transaction/service/transaction.service';

@Component({
  selector: 'app-accountstatement',
  standalone: true,
  imports: [MatIconModule,
            FormsModule,
            ReactiveFormsModule,
            MatStepperModule,
            MatFormFieldModule,
            MatInputModule,
            MatSelectModule,
            MatOptionModule,
            MatButtonModule,
            MatCheckboxModule,
            MatRadioModule, MatTableModule,MatAutocompleteModule,CommonModule,  MatExpansionModule,   MatCardModule,MatSidenavModule,    MatDatepickerModule,
      MatNativeDateModule,MatPaginatorModule,MatTooltipModule ],
  templateUrl: './accountstatement.component.html',
  styleUrl: './accountstatement.component.scss'
})
export class AccountstatementComponent {
grnForm: FormGroup;
  grnitemForm: FormGroup;
  grnservice=inject(GRNService);
  grnlinebatch=inject(TheGRNLineBatchesService );
  grnlineservice=inject(GRNLinesService);
  inventorybatchservice=inject(TheInventoryBatchesService);
  suplierprof=inject(AccountsService)
  supplierbank=inject(SupplierBankService)
  bincard=inject(BinCardService)
 inventory=inject(InventoryService);
  supplierbankdetails=inject(SupplierBankAccountsService)
  categoryService1 = inject(AccountTypeService);
    AccountsService = inject(AccountsService);
    transacation =inject(TransactionService);
activeTabIndex: number = 1;
  constructor(
    private fb: FormBuilder,
   private dialog: MatDialog
   ,private _snackBar: MatSnackBar,private router: Router,private route: ActivatedRoute,private cdr: ChangeDetectorRef
      
  ) {
   this.grnForm = this.fb.group({
  supplierName: [null, Validators.required],
  poNum: [null],
  grnStartDate: [null, Validators.required],
  grnEndDate: [null, Validators.required],
  supplierInvoiceCode: [null],
  supplierInvoiceDate: [null],
});


    this.grnitemForm = this.fb.group({
        searchBy: ['code'],  // default selected radio button
  searchitem: [''],
  itemId: [null],
  sellprice:[null],
  purcost:[null],
      itemCode: [null],
      itemName: [null],
     price: [null],
     cost: [null],
 expiredDate: [null],
 manufactureDate: [null],
      quantity: [null,Validators.required],
     lineTotal: [null],
     avaqty:[null]
    });
  } transactiondata: any[] = [];
  relatedDataMap = new Map<number, any[]>();
  groupedRelatedData: any[][] = [];
  flatRelatedData: any[] = [];
displayedColumns = ['groupIndex', 'itemName', 'lineTotal', 'manufactureDate', 'purcost', 'sellprice', 'quantity', 'source'];


 
openingBalance: any = 'N/A';
closingBalance: any = 'N/A';
  fetchData() {
    // Your form values here, replace with your form logic
    const startDate: Date = this.grnForm.value.grnStartDate;
    const endDate: Date = this.grnForm.value.grnEndDate;
    const supplierName = this.grnForm.value.supplierName;

    const params: any = { size: 10000000 };

    if (supplierName) params['accountCode.equals'] = supplierName;
    if (startDate) params['date.greaterThanOrEqual'] = this.formatToInstant(startDate);
    if (endDate) params['date.lessThanOrEqual'] = this.formatToInstant(endDate);

    this.transacation.query(params).subscribe({
      next: (response) => {
        this.transactiondata = response.body || [];

        const relidObservables = this.transactiondata
          .filter(txn => txn.relid)
          .map(txn => this.transacation.query({ 'relid.equals': txn.relid }));

        forkJoin(relidObservables).subscribe({
          next: (results) => {
            let groupIndex = 0;
            let tempGroup: any[] = [];

            results.forEach((res) => {
              const relatedItems = res.body || [];
              relatedItems.forEach(item => {
                tempGroup.push(item);
                if (tempGroup.length === 2) {
                  this.relatedDataMap.set(groupIndex, [...tempGroup]);
                  groupIndex++;
                  tempGroup = [];
                }
              });
            });

            if (tempGroup.length > 0) {
              this.relatedDataMap.set(groupIndex, [...tempGroup]);
            }

            this.groupedRelatedData = Array.from(this.relatedDataMap.values());
            this.flatRelatedData = [];

            this.groupedRelatedData.forEach((group, index) => {
              group.forEach(item => {
                this.flatRelatedData.push({
                  ...item,
                  groupIndex: index + 1,
                  itemName: item.itemName || item.name || 'N/A'
                });
              });
            });
const openingBalance = Number(this.groupedRelatedData[0][0]?.subId || 0);

let totalCredit = 0;
let totalDebit = 0;

this.groupedRelatedData.forEach(group => {
  group.forEach(item => {
    totalCredit += Number(item.credit || 0);
    totalDebit += Number(item.debit || 0);
  });
});

this.openingBalance = openingBalance;
this.closingBalance = openingBalance + totalDebit - totalCredit;

console.log('Opening Balance:', this.openingBalance);
console.log('Total Credit:', totalCredit);
console.log('Total Debit:', totalDebit);
console.log('Closing Balance:', this.closingBalance);

            this.cdr.detectChanges();
          },
          error: err => console.error('Error fetching related data:', err)
        });
      },
      error: err => console.error('Error fetching transactions:', err)
    });
   this. fetchaccdet() ;
     console.log( 'aaaaa',this.groupedRelatedData)
   this.paginatedRows = this.chunkArray(this.flatRelatedData, 6);
 console.log('Paginated Rows:', this.paginatedRows);
    setTimeout(() => {
      window.print();
    }, 3000); // 3000ms = 3 seconds
  
   
  
  }
formatToInstant(date: Date): string {
  return date.toISOString();
}

todayDate = new Date().toLocaleDateString();
currentTime = new Date().toLocaleTimeString();


res: any = {}; // Add this property to your component class
 paginatedRows: any[][] = [];
fetchaccdet() {
  const supplierCode = this.grnForm.value.supplierName;

  if (!supplierCode) return;

  this.AccountsService.query({ 'code.equals': supplierCode }).subscribe({
    next: (response) => {
      if (response.body?.length > 0) {
        this.res = response.body[0]; // Get first matching record
      } else {
        this.res = {}; // Reset if not found
      }
    },
    error: (err) => {
      console.error('Error fetching account details:', err);
      this.res = {}; // Reset on error
    }
  });
  
}

 



  today: Date = new Date();
dialogRef!: MatDialogRef<any>;

  @ViewChild('drawer') drawer!: MatDrawer;
  ngAfterViewInit() {
    // Open the drawer automatically when the component loads
    
  }
  @ViewChild('confirmResetDialog') confirmResetDialog!: TemplateRef<any>;

resetFormAndOpenDrawer(): void {
  this.dialogRef = this.dialog.open(this.confirmResetDialog, {
    width: '480px',
    disableClose: true
  });
}
cancelReset(): void {
  this.dialogRef.close();
  this.updatePagedItems()
}

confirmReset(): void {
  this.grnForm.reset();

  // Count and remove items that have itemName filled
  const namedItems = this.items.filter(item => item.itemName?.trim());
  const deletedCount = namedItems.length;

  this.items = this.items.filter(item => !item.itemName?.trim());

  // Add the same number of default rows that were deleted
  for (let i = 0; i < deletedCount; i++) {
    this.items.push({
      itemName: '',
      // Add default values for other properties if needed
    });
  }

  // Ensure at least one row exists
  if (this.items.length === 0) {
    this.items.push({
      itemName: '',
      // Add default values here
    });
  }

  this.currentPage = 1;
  this.updatePagedItems();

  this.drawerOpened = true;
  setTimeout(() => {
    this.drawer.open();
  });

  this.dialog.closeAll();
}


check() {
  console.log('Checking items:', this.items);

  this.items.forEach(item => {
    this.AccountsService.query({ 'code.equals': item.itemCode }).subscribe({
      next: (response) => {
        const res = response.body?.[0]; // assuming response is an array

        if (res && res.id != null) {
          const updatedAmount = (res.amount || 0) + (item.purcost || 0);

          const updatePayload = {
            id: res.id,
            debitAmount: item.purcost+res.debitAmount,
            amount: updatedAmount
          };

          this.AccountsService.partialUpdate(updatePayload).subscribe({
            next: () => {
              console.log(`Updated account ${res.id} with amount ${updatedAmount}`);
            },
            error: (err) => {
              console.error(`Failed to update account ${res.id}`, err);
            }
          });
        } else {
          console.warn(`No account found for code: ${item.itemCode}`);
        }
      },
      error: (err) => {
        console.error(`Failed to fetch account for code: ${item.itemCode}`, err);
      }
    });
  });
}




openDialog(templateRef: TemplateRef<any>): void {
  this.dialog.open(templateRef, {
    width: '700px',
    disableClose: true,
  });
}
closeDialog(): void {
  this.dialog.closeAll();
}
  suid: string | null = null;

  drawerOpened: boolean = false;


  onContinue() {
    if (this.grnForm.valid) {
      // Do whatever processing you want here
      
      // Then close the drawer
      this.drawer.close();
    }
  }
  @ViewChild('grnPanel') grnPanel!: MatExpansionPanel;
  @ViewChild('grnItemPanel') grnItemPanel!: MatExpansionPanel;

  expandBothPanels() {
    this.grnPanel.open();
    this.grnItemPanel.open();
  }
  displayFn(item: any): string {
  return item ? `${item.name} (${item.code})` : '';
}

 items: any[] = []; // Store multiple GRN items

addItem(): void {
  if (this.grnitemForm.valid) {
    if (!this.grnitemForm.value.itemName || this.grnitemForm.value.itemName.trim() === '') {
      alert('Item Name cannot be empty.');
      return;
    }
    if (!this.grnitemForm.value.quantity || this.grnitemForm.value.quantity.toString().trim() === '') {
      alert('Item Qty cannot be empty.');
      return;
    }

    const quantity = Number(this.grnitemForm.value.quantity);
    const sellprice = Number(this.grnitemForm.value.sellprice) || 0;
    const purcost = Number(this.grnitemForm.value.purcost) || 0;

    const newItem = {
      ...this.grnitemForm.value,
      lineTotal: (quantity * sellprice).toFixed(2),  // string with 2 decimals
      cost: purcost.toFixed(2),                      // string with 2 decimals
      price: sellprice.toFixed(2)   ,
      availableQuantity  :   Number(this.grnitemForm.value.avaqty) || 0              // string with 2 decimals
    };

    // Find first empty slot (all properties undefined or empty)
    const emptyIndex = this.items.findIndex(item => Object.keys(item).length === 0);

    if (emptyIndex !== -1) {
      this.items[emptyIndex] = newItem;
      this.items = [...this.items]; // trigger table update
    } else {
      this.items = [...this.items, newItem];
    }
    this.updatePagedItems();
    this.grnitemForm.reset({ searchBy: 'code' });
    console.log('Item added:', newItem);

    this.dialog.closeAll();
  } else {
    console.warn('Item form is invalid');
  }
}



inventoryquanity() {
  console.log('Updating inventory for all items...', this.items);

  for (let i = 0; i < this.items.length; i++) {
    const itemCode = this.items[i].itemCode;
    const quantity = this.items[i].quantity;

    console.log('Updating inventory for item code:', itemCode, 'with quantity:', quantity);

   this.inventory.query({ 'code.equals': itemCode }).subscribe({
      next: (response) => {
        console.log('Inventory query response:', response.body);

        if (response.body && response.body.length > 0) {
          const itemId = response.body[0].id;
          const existingQuantity = response.body[0].availableQuantity || 0;
          console.log(`Existing quantity for item ID ${itemId}:`, existingQuantity);
            const newQuantity = parseInt(quantity) || 0;
          const updatedQuantity = existingQuantity +  newQuantity;

          console.log(`Updating item ID ${itemId}: existing = ${existingQuantity}, added = ${quantity}, new = ${updatedQuantity}`);

          this.inventory.partialUpdate({
            id: itemId,
            availableQuantity: updatedQuantity,
          }).subscribe({
            next: () => {
              console.log(`Inventory updated successfully for item code: ${response.body}`);
            },
            error: (err) => {
              console.error(`Error updating inventory for item code: ${itemCode}`, err);
            }
          });

        } else {
          console.warn('Item not found with code:', itemCode);
        }
      },
      error: (err) => {
        console.error('Error fetching inventory for item code:', itemCode, err);
      }
    });
  }
}


searchResultsvendor: any[] = [];

searchvendor(): void {
 
  const searchValue = this.grnForm.value.supplierName;

 

  let queryParam = '';

 console.log(searchValue)
    queryParam = `name.contains=${searchValue}`;


  this.suplierprof.query( { 'name.contains': searchValue }).subscribe({
    next: (response) => {
      this.searchResultsvendor= response.body || []; // assuming response is an array
      console.log(this.searchResultsvendor)
    },
    error: (error) => {
      console.error('Error fetching items:', error);
    }
  });
}

onItemSelectedvendor(selectedItem: any): void {
  this.grnForm.patchValue({
 
 supplierName: selectedItem.code,
 
    // sellprice: selectedItem.sellPrice,
    // purcost: selectedItem.purchaseCost
  });
}
deleteItem(item: any): void {
  this.items = this.items.filter(i => i !== item);

  // Refresh pagedItems based on current pagination logic
  this.updatePagedItems(); // <-- Make sure this function updates pagedItems

  console.log('Updated items:', this.items);
}

pageSize = 10;
currentPage = 1;
pagedItems: any[] = [];


onPaginateChange(event: PageEvent): void {
  this.pageSize = event.pageSize;
  this.currentPage = event.pageIndex + 1;
  this.updatePagedItems();
}
updatePagedItems(): void {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.pagedItems = this.items.slice(startIndex, endIndex);
}

searchResults: any[] = [];

searchitems(): void {
  const searchBy = this.grnitemForm.value.searchBy;
  const searchValue = this.grnitemForm.value.searchitem;

  if (!searchValue || !searchBy) return;

  let queryParam: any = {}; // ✅ FIXED: initialize as object

  if (searchBy === 'code') {
    queryParam['code.contains'] = searchValue;
  } else if (searchBy === 'name') {
    queryParam['name.contains'] = searchValue;
  }

  this.inventory.query(queryParam).subscribe({
    next: (response) => {
      this.searchResults = response.body || [];
      console.log(this.searchResults);
    },
    error: (error) => {
      console.error('Error fetching items:', error);
    }
  });
}


// When user selects from autocomplete list
onItemSelected(selectedItem: any): void {
  this.grnitemForm.patchValue({
    itemCode: selectedItem.code,
    itemName: selectedItem.name,
    itemId: selectedItem.id,
    avaqty:selectedItem.availableQuantity
    // sellprice: selectedItem.sellPrice,
    // purcost: selectedItem.purchaseCost
  });
}


  ngOnInit(): void {
    
  this.route.queryParamMap.subscribe(params => {
  this.suid = params.get('suid');
  console.log('Supplier UID:', this.suid);

  if (this.suid) {
    // If suid exists, fetch GRN data by ID
    this.grnservice.query({ 'id.equals': this.suid }).subscribe({
      next: (response) => {
        console.log('GRN data:', response.body);
        // You can prefill form here if needed
        if (response.body && response.body.length > 0) {
          const grnData = response.body[0];
          this.grnForm.patchValue({
            supplierName: grnData.supplierName,
            poNum: grnData.poNum,
            supplierInvoiceCode: grnData.supplierInvoiceCode,
            grnDate: grnData.grnDate,
            supplierInvoiceDate: grnData.supplierInvoiceDate,
            // ... other fields as needed
          });
        }
      },
      error: (err) => {
        console.error('Error fetching GRN data:', err);
      }
    });

    this.drawerOpened = false; // close drawer if suid exists (editing existing GRN)
  } else {
    this.drawerOpened = true; // open drawer if no suid (creating new GRN)
  }
});



 


 // this.items = Array.from({ length: 10}, () => ({}));
   this.updatePagedItems();
  this.grnForm.get('supplierName')?.valueChanges
    .pipe(debounceTime(300)).subscribe(() => this.searchvendor());
this.grnitemForm.get('searchitem')?.valueChanges
    .pipe(debounceTime(300))
    .subscribe(() => this.searchitems());

  this.grnitemForm.get('searchBy')?.valueChanges.subscribe(() => this.searchitems());
  this.updategrn();
  

 
  
}
chunkArray(arr: any[], size: number): any[][] {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
preventClose(): void {
  // This prevents the drawer from closing on backdrop click
}

grncode: string  ; // Default GRN code, can be changed as needed
updategrn() {
  // Example: fetch all GRNs (or add your intended logic here)
  this.grnservice.query({ sort: ['id,desc'] }).subscribe({
    next: (res) => {
      console.log('GRN query response:', res);
      this.grncode = res.body && res.body.length > 0 ? res.body[0].grnCode : 'GRN001'; // Set default GRN code
      console.log('Updated GRN code:', this.grncode);
    },
    error: (err) => {
      console.error('Error querying GRN:', err);
    }
  });


// Initialize grncode with a default value if it's undefined

console.log('Generated GRN code:', this.grncode);
}


supplierbanksave(id: Number){
  const supplierDatabank = this.grnitemForm.value;

  const updatedSupplierDataBank = { id, ...supplierDatabank };
  // You can now use updatedSupplierDataBank as needed
  this.supplierbank.create(updatedSupplierDataBank).subscribe({
    next: (response) =>{
      console.log(response.body);
    }
  })
}

supplierbankaccount(id: Number){
  const supplierDatabank = this.grnitemForm.value;
  const updatedSupplierDataBank = { id, ...supplierDatabank };
  // You can now use updatedSupplierDataBank as needed
  this.supplierbankdetails.create(updatedSupplierDataBank).subscribe({
    next: (response) =>{
      console.log(response.body);
    }
  })

} 
grnlineservices(id: number): void {
  if (this.items.length === 0) {
    console.warn('No GRN line items to submit.');
    return;
  }
console.log('Creating GRN lines  :', this.items);
  this.items = this.items.map((item) => ({
    ...item,
    id: null,             // Resetting ID if needed for creation
    grnId: id    ,
              // Associating each item with the given GRN ID
  }));

  // Create each GRN line individually, as create expects a single NewGRNLines object
  this.items.forEach((item) => {
    this.grnlineservice.create(item).subscribe({
      next: (response) => {
        console.log('GRN line created successfully:', response);
        // Optional: show success message or redirect
      },
      error: (error) => {
        console.error('Error creating GRN line:', error);
      }
    });
  });
}
 

grnlinebatchsave(id: number): void {
  if (this.items.length === 0) {
    console.warn('No GRN line items to submit.');
    return;
  }   

  // Assign lineId incrementally starting from 1
  this.items = this.items.map((item, index) => ({
    ...item,
   grnId: id,
    lineId: index + 1,
    batchLineId:index+2
  }));
const duplicates = this.items.filter((item, index, arr) =>
  arr.findIndex(i => i.id === item.id && i.lineId === item.lineId) !== index
);
console.log('Duplicates in batch:', this.items);

  const createObservables = this.items.map(item =>
    this.grnlinebatch.create(item)
  );

  console.log('📦 Sending GRN batch line items:', this.items);

  forkJoin(createObservables).subscribe({
    next: (responses) => {
      console.log('✅ All GRN batch lines created successfully:', responses);
    },
    error: (error) => {
      console.error('❌ Error occurred while creating GRN batch lines:');

      console.error('Status Code:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('Error Message:', error.message);

      if (error.error) {
        console.error('Error Body:', error.error);

        const backendMessage = error.error.detail || error.error.message || '';

        if (backendMessage.includes('Duplicate row was found')) {
          console.error('🚫 Duplicate row error detected!');
        } else {
          console.warn('⚠️ Unhandled backend error:', backendMessage);
        }
      } else {
        console.warn('⚠️ No detailed error information from backend.');
      }
    }
  });
}

inventorybatchsave(id: number): void {
  if (this.items.length === 0) {
    console.warn('No GRN line items to submit.');
    return;
  }

this.items = this.items.map((item, index) => ({
  ...item,
 grnId: id,                    // All items get the same 'id'
  lineId: index + 1,         // lineId is set based on index (starts at 1)
 lmu: index + 2     // batchLineId is index + 2 (starts at 2)
}));

console.log('batch lines',this.items)
  const createObservables = this.items.map(item =>
    this.inventorybatchservice.create(item)
  );

  forkJoin(createObservables).subscribe({
    next: (responses) => {
      console.log('All inventory items created:', responses);
       console.log('everything finisheddddddd');
        this.check();
        this._snackBar.open('GRN created successfully!', 'Close', {
    duration: 3000,
    verticalPosition: 'top',
    panelClass: ['bg-green-600', 'text-white'] // optional styling
  });
 
      setTimeout(() => {
        this.router.navigate(['/grn']);
     }, 500);
      // Optional: navigate or reload after delay
    },
    error: (error) => {
      console.error('Error creating one or more inventory items:', error);
    }
  });
}
get searchByCode(): boolean {
  return this.grnitemForm.get('searchBy')?.value === 'code';
}

setSearchBy(value: 'code' | 'name'): void {
  this.grnitemForm.get('searchBy')?.setValue(value);
}

grnsave(): void {
  const formValue = this.grnForm.value;
  const totalPurcost = this.items.reduce((sum, item) => sum + item.purcost, 0);
const grnPayload = {
  ...formValue,
  grnDate: formValue.grnDate ? dayjs(formValue.grnDate) : undefined,
  supplierInvoiceDate: formValue.supplierInvoiceDate ? dayjs(formValue.supplierInvoiceDate) : undefined,
  grnCode: this.grncode, // Use the generated GRN code
  amountOwing:totalPurcost,
  inspected:false,
  lmd:dayjs()
};

this.grnservice.create(grnPayload).subscribe({
  next: (response) => {
    console.log('GRN batches  created successfully:', response.body.id);
    this.grnlineservices(response.body.id); // Pass the GRN ID to create lines
    this.grnlinebatchsave(response.body.id); // Pass the GRN ID to create line batches
    this.inventorybatchsave(response.body.id); // Pass the GRN ID to create inventory batches
    // Show success message or redirect
  },
  error: (err) => {
    console.error('Error creating GRN:', err);
  }
});
}
bincardsave(): void {
  if (this.items.length === 0) {
    console.warn('No GRN line items to submit.');
    return;
  }

  this.items = this.items.map((item) => ({
    ...item,
    id: null,
              // Resetting ID if needed for creation
        recordDate:dayjs() ,    // Associating each item with the given GRN ID
        lmd: dayjs(), // Last Modified Date
        description:'item added',
        opening:item.avaqty+item.qtyIn 
  }));

  // Create each GRN line individually, as create expects a single NewGRNLines object
  this.items.forEach((item) => {
    this.bincard.create(item).subscribe({
      next: (response) => {
        console.log('Bin Card created successfully:', response);
        // Optional: show success message or redirect
      },
      error: (error) => {
        console.error('Error creating Bin Card:', error);
      }
    });
  });

  
}


newupdategrn(id: number ) {
    const totalPurcost = this.items.reduce((sum, item) => sum + item.purcost, 0);
  this.grnservice.query({ 'id.equals': id }).subscribe({
    next: (res) => {
      if (res.body && res.body.length > 0) {
        const grn = res.body[0];
        const currentAmountOwing = grn.amountOwing ?? 0; // fallback to 0 if undefined
        const newAmountOwing = currentAmountOwing + totalPurcost;

        // Prepare partial update object
        const partialUpdate = {
          id: id,
          amountOwing: newAmountOwing,
        };

        // Call partial update API (assuming grnservice.partialUpdate exists)
        this.grnservice.partialUpdate(partialUpdate).subscribe({
          next: (updateRes) => {
            console.log('GRN amountOwing updated:', updateRes);
            // Optional: do something on success
          },
          error: (err) => {
            console.error('Error updating GRN:', err);
          },
        });
      } else {
        console.error('No GRN found with id:', id);
      }
    },
    error: (err) => {
      console.error('Error fetching GRN:', err);
    },
  });
}



 save(): void {
  this.items = this.items.filter(
  item => item && typeof item === 'object' && Object.keys(item).length > 0 && item.itemName
);

 if (!this.items || this.items.length === 0) {
    alert('No valid items to save!');
    return;
  }

this.grncode = this.grncode || 'GRN0'; // Replace 'GRN0' with your default prefix
console.log('array namess',this.items)
// Increment the numeric part of the GRN code
const match = this.grncode.match(/^([a-zA-Z]+)(\d+)$/);
if (match) {
  const prefix = match[1];
  const number = parseInt(match[2], 10) + 1;
  console.log('Current GRN code nn:', number+1);
  const num=number 
  this.grncode = `${prefix}${num}`;
  console.log('Generated new GRN code:', this.grncode);
} else {
  // Handle case where the format doesn't match (fallback)
  this.grncode = 'GRN1'; // Or whatever default you want
}

console.log('Generated GRN coderrrrrrrr:', this.grncode);

console.log('Saving GRN with items:', this.items);

// Add `code`, `lineId`, and parse `quantity` to integer
this.items = this.items.map((item, index) => ({
  ...item,
  code: uuidv4(),
  lineId: index + 1,
  quantity: parseInt(item.quantity, 10) || 0, // Parse quantity to int, fallback to 0 if invalid
  qtyIn: parseInt(item.quantity, 10) || 0 // Assuming qtyIn is the same as quantity
  ,qty: parseInt(item.quantity, 10) || 0 ,// Assuming qty is the same as quantity,
  batchLineTotal:parseInt(item.lineTotal, 10) || 0 // Parse line total to int, fallback to 0 if invalid
  ,cost: parseInt(item.cost, 10) || 0 ,// Parse cost to int, fallback to 0 if invalid
  price: parseInt(item.sellprice, 10) || 0 ,// Parse price to int, fallback to 0 if invalid
  purcost: parseInt(item.purcost, 10) || 0 ,// Parse purchase cost to int, fallback to 0 if invalid
sellprice
: parseInt(item.sellprice, 10) || 0, // Parse sell price to int, fallback to 0 if invalid
costTotal: parseInt(item.lineTotal, 10) || 0 ,// Parse line total to int, fallback to 0 if invalid
 reference:item.itemName,
  expiredDate: item.expiredDate ?  dayjs(item.expiredDate) : null, // Convert to Date object if valid
  manufactureDate: item.manufactureDate ? dayjs(item.manufactureDate) : null, // Convert to Date object if valid
  
// Add the generated GRN code
expireDate: item.expiredDate ? dayjs(item.expiredDate) : null, // Convert to Date object if valid
}));

console.log('Updated GRN items with code, lineId, and parsed quantity:', this.items);
console.log('GRN Form Data:', {
  ...this.grnForm.value,
  grnDate: this.grnForm.value.grnDate ? dayjs(this.grnForm.value.grnDate) : null,
  supplierInvoiceDate: this.grnForm.value.supplierInvoiceDate
    ? dayjs(this.grnForm.value.supplierInvoiceDate)
    : null,
    grnCode:'GRN001',
});

console.log('GRN Form Data:', this.grnForm.value);
 this.inventoryquanity()
 this.bincardsave();
if (!this.suid) {
  // If suid does NOT exist
  this.grnsave();
} else {
  // If suid exists
  this.grnlineservices(Number(this.suid)); // Pass the GRN ID to create lines
  this.grnlinebatchsave(Number(this.suid)); // Pass the GRN ID to create line batches
  this.inventorybatchsave(Number(this.suid));
  this.newupdategrn(Number(this.suid) ) ;
}
  //if (this.grnForm.valid) {
   // const supplierData = this.grnForm.value;

   // console.log('Saving supplier:', supplierData);

   // this.suplierprof.create(supplierData).subscribe({
    //  next: (response) => {
       // console.log('Supplier created successfully:', response);
       // this.supplierbanksave(response.body.id);
 //this.supplierbankaccount(response.body.id);

       // this.dialogRef.close(supplierData);
     // },
     // error: (error) => {
       // console.error('Error creating supplier:', error);
     // }
    //});

  //} else {
  //  console.warn('General form is invalid');
 // }
 }
}
