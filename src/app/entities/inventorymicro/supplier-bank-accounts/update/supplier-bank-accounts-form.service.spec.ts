import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../supplier-bank-accounts.test-samples';

import { SupplierBankAccountsFormService } from './supplier-bank-accounts-form.service';

describe('SupplierBankAccounts Form Service', () => {
  let service: SupplierBankAccountsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierBankAccountsFormService);
  });

  describe('Service methods', () => {
    describe('createSupplierBankAccountsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSupplierBankAccountsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bankId: expect.any(Object),
            bankName: expect.any(Object),
            bankAccountNumber: expect.any(Object),
            bankBranch: expect.any(Object),
            bankBranchCode: expect.any(Object),
            bankCode: expect.any(Object),
            bankAccountName: expect.any(Object),
          }),
        );
      });

      it('passing ISupplierBankAccounts should create a new form with FormGroup', () => {
        const formGroup = service.createSupplierBankAccountsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bankId: expect.any(Object),
            bankName: expect.any(Object),
            bankAccountNumber: expect.any(Object),
            bankBranch: expect.any(Object),
            bankBranchCode: expect.any(Object),
            bankCode: expect.any(Object),
            bankAccountName: expect.any(Object),
          }),
        );
      });
    });

    describe('getSupplierBankAccounts', () => {
      it('should return NewSupplierBankAccounts for default SupplierBankAccounts initial value', () => {
        const formGroup = service.createSupplierBankAccountsFormGroup(sampleWithNewData);

        const supplierBankAccounts = service.getSupplierBankAccounts(formGroup) as any;

        expect(supplierBankAccounts).toMatchObject(sampleWithNewData);
      });

      it('should return NewSupplierBankAccounts for empty SupplierBankAccounts initial value', () => {
        const formGroup = service.createSupplierBankAccountsFormGroup();

        const supplierBankAccounts = service.getSupplierBankAccounts(formGroup) as any;

        expect(supplierBankAccounts).toMatchObject({});
      });

      it('should return ISupplierBankAccounts', () => {
        const formGroup = service.createSupplierBankAccountsFormGroup(sampleWithRequiredData);

        const supplierBankAccounts = service.getSupplierBankAccounts(formGroup) as any;

        expect(supplierBankAccounts).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISupplierBankAccounts should not enable id FormControl', () => {
        const formGroup = service.createSupplierBankAccountsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSupplierBankAccounts should disable id FormControl', () => {
        const formGroup = service.createSupplierBankAccountsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
