import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { SupplierService } from 'app/entities/inventorymicro/supplier/service/supplier.service';
import { SupplierBankAccountsService } from 'app/entities/inventorymicro/supplier-bank-accounts/service/supplier-bank-accounts.service';
import { SupplierBankService } from 'app/entities/inventorymicro/supplier-bank/service/supplier-bank.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { async } from 'rxjs';

@Component({
  selector: 'app-supplierview',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    ReactiveFormsModule,FormsModule
  ],
  templateUrl: './supplierview.component.html',
  styleUrls: ['./supplierview.component.scss'],
})
export class SupplierviewComponent implements OnInit {
  supplierDetails: any = null;
 bankAccount: any = {};
  bank: any = null;

  // FormGroups for stepper (even if no forms, needed to control steps)
  supplierFormGroup!: FormGroup;
  bankAccountFormGroup!: FormGroup;
  bankFormGroup!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SupplierviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private supservice: SupplierService,
    private supplierbankacc: SupplierBankAccountsService,
    private supplierbank: SupplierBankService
  ) {}
isEditing: boolean = false;


bankAccountName: string = '';
bankBranch: string = '';
bankAccountNumber: string = '';
bankName: string = '';

// Load from backend
 
enableEdit(): void {
  this.isEditing = true;

  // Pre-fill form fields
  this.bankAccountName = this.bankAccount.bankAccountName ?? '';
  this.bankBranch = this.bankAccount.bankBranch ?? '';
  this.bankAccountNumber = this.bankAccount.bankAccountNumber ?? '';
  this.bankName = this.bankAccount.bankName ?? '';
}

cancelEdit(): void {
  this.isEditing = false;
}

saveEdit(): void {
  const updatedData = {
    id: this.bankAccount.id,
    bankAccountName: this.bankAccountName,
    bankBranch: this.bankBranch,
    bankAccountNumber: this.bankAccountNumber,
    bankName: this.bankName,
  };

  this.supplierbankacc.partialUpdate(updatedData).subscribe({
    next: (res) => {
      console.log('Updated successfully:', res);

      // Update view model with latest values
      this.bankAccount = { ...this.bankAccount, ...updatedData };

      this.isEditing = false;
    },
    error: (err) => {
      console.error('Error while updating:', err);
    }
  });
}

  async ngOnInit():  Promise<void> {
  const id = this.data.id;
 
 
  const idbank = await this.fetchSupplierBankAcc(id);
  console.log('Fetched ID:', idbank);
 
const idbank2= await this.fetchSupplierBank(id);

  // Initialize supplier form group - add some controls to avoid blocking linear stepper
  this.supplierFormGroup = this.fb.group({
    // example controls, adjust as needed:
    isVATEnable: [false],
    vatRegNumber: [''],
    isNBTEnable: [false],
    tinNumber: [''],
    contactPersonName: [''],
    contactPersonMobile: [''],
    addressOffice: [''],
    website: ['']
  });

  this.bankAccountFormGroup = this.fb.group({
    bankAccountName: ['', Validators.required],
    bankBranch: [''],
    bankAccountNumber: ['', Validators.required],
    bankName: [''],
  });

  // Bank form group - add controls or keep empty if no validation required
  this.bankFormGroup = this.fb.group({
    maximumCreditLimit: [''],
    creditPeriod: [''],
    chequeDrawn: ['']
  });

  // Fetch supplier details and patch values
  this.supservice.find(id).subscribe({
    next: (response) => {
      this.supplierDetails = response.body ?? response;
      this.supplierFormGroup.patchValue(this.supplierDetails);
    },
    error: (err) => console.error('Supplier error:', err),
  });

  // Fetch bank account and patch values into form group
  this.supplierbankacc.find(idbank).subscribe({
    next: (response) => {
      this.bankAccount = response.body ?? response;
      this.bankAccountFormGroup.patchValue({
        bankAccountName: this.bankAccount.bankAccountName || '',
        bankBranch: this.bankAccount.bankBranch || '',
        bankAccountNumber: this.bankAccount.bankAccountNumber || '',
        bankName: this.bankAccount.bankName || '',
      });
    },
    error: (err) => console.error('Bank Account error:', err),
  });

  // Fetch bank and patch values
  this.supplierbank.find(idbank2).subscribe({
    next: (response) => {
      this.bank = response.body ?? response;
      this.bankFormGroup.patchValue({
        maximumCreditLimit: this.bank.maximumCreditLimit || '',
        creditPeriod: this.bank.creditPeriod || '',
        chequeDrawn: this.bank.chequeDrawn || '',
      });
    },
    error: (err) => console.error('Bank error:', err),
  });
}


async fetchSupplierBankAcc(id: number): Promise<number | null> {
  try {
    const response = await firstValueFrom(
      this.supplierbankacc.query({ 'bankId.equals': id })
    );
    const accounts = response.body || [];
    return accounts.length > 0 ? accounts[0].id : null;
  } catch (error) {
    console.error('Error fetching supplier bank accounts:', error);
    return null;
  }
}
async fetchSupplierBank(id: number): Promise<number | null> {
  try {
    const response = await firstValueFrom(
      this.supplierbank.query({ 'maximumDiscount.equals': id })
    );
    const accounts = response.body || [];
    return accounts.length > 0 ? accounts[0].id : null;
  } catch (error) {
    console.error('Error fetching supplier bank accounts:', error);
    return null;
  }
}

}
