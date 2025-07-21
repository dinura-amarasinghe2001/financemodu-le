import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';

import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { BankService } from 'app/entities/inventorymicro/bank/service/bank.service';
import { IBank } from 'app/entities/inventorymicro/bank/bank.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, switchMap, Observable, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-create',
  standalone: true,
  imports: [   CommonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,   MatAutocompleteModule
    ],
  templateUrl: './supplier-create.component.html',
  styleUrl: './supplier-create.component.scss',
})
export class SupplierCreateComponent {
  generalForm: FormGroup;
  bankForm: FormGroup;
  suplierprof=inject(SupplierService)
  supplierbank=inject(SupplierBankService)
  supplierbankdetails=inject(SupplierBankAccountsService)
  bank=inject(BankService);
activeTabIndex: number = 0;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupplierCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: any }
  ) {
    this.generalForm = this.fb.group({
      name: ['', Validators.required],
      code: [null, Validators.required],
      addressOffice: [null],
      cityOffice: [null],
      addressFactory: [null],
      cityFactory: [null],
       phone1: [
    null,
    [
      Validators.required,
      Validators.pattern(/^\d{10}$/) // Must be exactly 10 digits
    ]
  ],
      fax: [null],
      email: [null,  Validators.email ],
      website: [null],
      contactPersonName: [null],
      contactPersonMobile: [null,
    Validators.pattern(/^\d{10}$/)],
      brNumber: [null],
      vatRegNumber: [null],
      tinNumber: [null],
      isVATEnable: [false],
      isNBTEnable: [false]
    });

    this.bankForm = this.fb.group({
      creditPeriod: [null,Validators.required],
      bankAccountName: [null,Validators.required],
     bankAccountNumber: [null,Validators.required],
      bankName: [null,Validators.required],
      bankBranch: [null],
      maximumCreditLimit: [null],
      chequeDrawn: [null]
    });
  }
 
  ngOnInit(): void {
       this.filteredBanks = this.bankForm.get('bankName')!.valueChanges.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(value => this.fetchBanksFromApi(value || ''))
  );
  if (this.data?.supplier) {
    this.generalForm.patchValue(this.data.supplier);
    this.bankForm.patchValue(this.data.supplier); // assuming flat structure
  }
  this.fetchSupCode()
}
filteredBanks!: Observable<IBank[]>;

fetchBanksFromApi(name: string): Observable<IBank[]> {
  return this.bank.query({ 'name.contains': name }).pipe(
    map(res => res.body || [])
  );
}
displayBankName(name: string): string {
  return name;
}

fetchSupCode(): void {
  const queryParams = {
    sort: ['id,desc'],
    size: 1
  };

  this.suplierprof.query(queryParams).subscribe({
    next: (data) => {
      const items = data.body || [];
      if (items.length === 0) {
        // No previous supplier codes, start with sup001
        this.generalForm.patchValue({ code: 'sup001' });
        return;
      }

      const lastCode = items[0].code || 'sup001'; // Should not hit this fallback now
      const prefix = lastCode.match(/[A-Za-z]+/)?.[0] || 'sup';
      const numberPart = parseInt(lastCode.replace(/\D/g, ''), 10) || 0;
      const newNumber = (numberPart + 1).toString().padStart(3, '0');
      const newCode = `${prefix}${newNumber}`;

      this.generalForm.patchValue({ code: newCode });
    },
    error: (error) => {
      console.error('Error fetching supplier code:', error);
      this.generalForm.patchValue({ code: 'sup001' }); // Fallback on error
    }
  });
}

supplierbanksave(id: Number){
  const supplierDatabank = this.bankForm.value;

  const updatedSupplierDataBank = { maximumDiscount: id, ...supplierDatabank };
  // You can now use updatedSupplierDataBank as needed
  this.supplierbank.create(updatedSupplierDataBank).subscribe({
    next: (response) =>{
      console.log(response.body);
    }
  })
}

supplierbankaccount(id: Number){
  console.log('im workinggggggggggggggggggggg')
  const supplierDatabank = this.bankForm.value;
  console.log(supplierDatabank);
  const updatedSupplierDataBank = {bankId: id, ...supplierDatabank };
  // You can now use updatedSupplierDataBank as needed
  this.supplierbankdetails.create(updatedSupplierDataBank).subscribe({
    next: (response) =>{
      console.log(response.body);
    }
  })

} 



onStepChange(event: StepperSelectionEvent): void {
  if (event.selectedIndex === 1) {
    // When user goes to "Bank Information" step
    this.dialogRef.updateSize('80vh', '69vh');
    
  } else {
    // Default height for "General Information" or others
    this.dialogRef.updateSize('80vh', '95vh');
  }
}

 save(): void {
  if (this.generalForm.valid) {
    const supplierData = this.generalForm.value;

    console.log('Saving supplier:', supplierData);

    this.suplierprof.create(supplierData).subscribe({
      next: (response) => {
        console.log('Supplier created successfully:', response);
        this.supplierbanksave(response.body.id);
 this.supplierbankaccount(response.body.id);

        this.dialogRef.close(supplierData);
      },
      error: (error) => {
        console.error('Error creating supplier:', error);
      }
    });

  } else {
    console.warn('General form is invalid');
  }
}


}
