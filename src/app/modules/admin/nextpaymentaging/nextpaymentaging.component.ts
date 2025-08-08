 
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BinCardService } from 'app/entities/inventorymicro/bin-card/service/bin-card.service';
import { GrnViewsComponent } from '../grn-views/grn-views.component';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountTypeService } from 'app/entities/financemicro/account-type/service/account-type.service';
import { AccountsService } from 'app/entities/financemicro/accounts/service/accounts.service';
import { CategoryService } from 'app/entities/inventorymicro/category/service/category.service';
import { InventoryService } from 'app/entities/inventorymicro/inventory/service/inventory.service';
import { startWith, map, debounceTime } from 'rxjs';
import { InventoryCreateComponent } from '../inventory-create/inventory-create.component';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';

@Component({
  selector: 'app-nextpaymentaging',
  imports: [CommonModule,
  FormsModule,
  NgFor,
  NgIf,
  RouterModule,
   ReactiveFormsModule ,
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
    MatNativeDateModule, MatAutocompleteModule],
  templateUrl: './nextpaymentaging.component.html',
  styleUrl: './nextpaymentaging.component.scss'
})
export class NextpaymentagingComponent {
  suplierprof= inject(SupplierService)
    inventoryservice=inject(InventoryService);
    categoryService=inject(CategoryService);
   
   inventoryForm : FormGroup;
  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<InventoryCreateComponent>,public _snackBarService: MatSnackBar, private router: Router,
      @Inject(MAT_DIALOG_DATA) public data: { supplier: any }
    ) {
      this.inventoryForm = this.fb.group({
        name: ['', Validators.required],
        code: [null, Validators.required],
        reOrderQty: [null],
        checkType:[null],
        lastCost: [null],
        lastSellingPrice: [null],
          dateRange: this.fb.group({
    start: [null, Validators.required],
    end: [null, Validators.required],
  })
      });}
    searchResultsvendor: any[] = [];

showComponent = true;

navgate() {
  const name = this.inventoryForm.get('name')?.value;
  const startRaw = this.inventoryForm.get('dateRange.start')?.value;
  const endRaw = this.inventoryForm.get('dateRange.end')?.value;

  if (!name || !startRaw || !endRaw) {
    this._snackBarService.open('Please fill in vendor and date range', 'Close', { duration: 3000 });
    return;
  }

  const start = new Date(startRaw);
  const end = new Date(endRaw);

  this.router.navigate(['/agingreport-print'], {
    queryParams: {
      name: name.name ?? name,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    }
  });

  this.dialogRef.close(true);// hide component
}




searchvendor(): void {
 
  const searchValue = this.inventoryForm.value.name;

 

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
   categoryService1 = inject(AccountTypeService);
    AccountsService = inject(AccountsService);
  lmuControl = new FormControl('');
  filteredLmuOptions: string[] = [];
  
   categories1: any[] = [];
  
  catfetch() {
    this.categoryService1.query({ size: 10000 }).subscribe({
      next: (data) => {
        this.categories1 = data.body || [];
        this.updateLmuOptions(); // prepare autocomplete list
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  }
   
  
  updateLmuOptions() {
    const allCategories = this.categories1.filter(
      (cat, index, self) => cat.lmu && self.findIndex(c => c.lmu === cat.lmu) === index
    ); // remove duplicates by lmu
  
    this.lmuControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLmu(value, allCategories))
    ).subscribe(filtered => {
      this.filteredLmuOptions = filtered;
    });
  }
  
  filterLmu(value: string, options: any[]): any[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.lmu.toLowerCase().includes(filterValue));
  }
  
   
  
  displayFn(option: any): string {
    return option && option.lmu ? option.lmu : '';
  }
    selected: any = null; // store selected category
  
  onSelectLmu(selected: any) {
    this.selected = selected;
  
    console.log('Selected Category - lmu:', selected.lmu);
    console.log('Selected Category - code:', selected.code);
    console.log('Selected Category - type:', selected.type);
  }
  
  createacc() {
    if (!this.selected || !this.inventoryForm.valid) {
      console.warn('Form is invalid or no category selected.');
      return;
    }
  
    const payload = {
      id: null,
      parent: this.selected.type,
      path: this.selected.lmu,
      code: this.inventoryForm.value.code,      // assume you're manually entering or auto-generating this
      child: this.selected.code || '',
      name: this.inventoryForm.value.name || '',
    };
  
    console.log('Payload to send:', payload);
     this.AccountsService.create(payload).subscribe({
      next: (response) => {
        console.log('Account created successfully:', response);
     },
       error: (error) => {
       console.error('Error creating account:', error);
       }
     });
  
    
  }
  
        ngOnInit(): void {
  this.catfetch()
  
    if (this.data?.supplier) {
      this.inventoryForm.patchValue(this.data.supplier);
      //this.bankForm.patchValue(this.data.supplier); // assuming flat structure
    }
    this.fetchInventoryCode(); 
    this.fetchCategories(); // Fetch categories on initialization
      this.inventoryForm.get('name')?.valueChanges
    .pipe(debounceTime(300)).subscribe(() => this.searchvendor());
  }
  
  
  categories: any[] = [];
  fetchCategories() {
    this.categoryService.query().subscribe({
      next: (res) => {
        this.categories = res.body || [];
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      }
    });
  }
  onItemSelectedvendor(selectedItem: any): void {
  this.inventoryForm.patchValue({
 
name: selectedItem.name,
 
    // sellprice: selectedItem.sellPrice,
    // purcost: selectedItem.purchaseCost
  });
}
  fetchInventoryCode(): void {
    const queryParams = {
      sort: ['id,desc'], // <-- Sort by id in descending order
      size: 1            // <-- Fetch only the last item (optional for efficiency)
    };
  
    this.inventoryservice.query(queryParams).subscribe({
      next: (data) => {
        const items = data.body || [];
        const lastItem = items.length > 0 ? items[0] : null; // [0] because we sorted DESC
        const lastCode = lastItem?.code || 'ITEM000';
        const prefix = lastCode.match(/[A-Za-z]+/)?.[0] || 'ITEM';
        const numberPart = parseInt(lastCode.replace(/\D/g, ''), 10);
        const newNumber = (numberPart + 1).toString().padStart(3, '0');
        const newCode = `${prefix}${newNumber}`;
  
        this.inventoryForm.patchValue({ code: newCode });
      },
      error: (error) => {
        console.error('Error fetching inventory code:', error);
      }
    });
  }
  
  itemsave(): void {
    const value = this.inventoryForm.value;
  
    // Create keyword by concatenating code and name without spaces
    const codePart = (value.code || '').toString().replace(/\s+/g, '');
    const namePart = (value.name || '').toString().replace(/\s+/g, '');
    const keyword = codePart + namePart;
  
    // Spread existing values and override/add keyword
    const payload = {
      ...value,
      keyword,
    };
  
    this.inventoryservice.create(payload).subscribe({
      next: (response) => {
        console.log('Inventory item created successfully:', response);
  
        this._snackBarService.open("Navigated", "Close", {
          duration: 3000,
        });
  
        this.dialogRef.close(true);  // Closing dialog and passing true
        window.location.reload();
      },
      error: (err) => {
        console.error('Error creating inventory item:', err);
      }
    });
  }
  
  
  
  
  
  onSave(): void {
    if (this.inventoryForm.valid) {
      const formData = { ...this.inventoryForm.value };
  
      // Convert string inputs to numbers
      formData.reOrderQty = parseInt(formData.reOrderQty, 10) || 0;
      formData.lastCost = parseFloat(formData.lastCost) || 0;
      formData.lastSellingPrice = parseFloat(formData.lastSellingPrice) || 0;
   this.itemsave();
  this.createacc()
      console.log('Parsed Inventory Form Data:', formData);
      this.dialogRef.close(formData); // optionally pass data to parent
    } else {
      console.warn('Form is invalid');
    }
  }
}
