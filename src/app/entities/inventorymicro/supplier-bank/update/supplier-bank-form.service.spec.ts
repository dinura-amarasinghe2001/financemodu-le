import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../supplier-bank.test-samples';

import { SupplierBankFormService } from './supplier-bank-form.service';

describe('SupplierBank Form Service', () => {
  let service: SupplierBankFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierBankFormService);
  });

  describe('Service methods', () => {
    describe('createSupplierBankFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSupplierBankFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            creditPeriod: expect.any(Object),
            maximumDiscount: expect.any(Object),
            maximumCreditLimit: expect.any(Object),
            chequeDrawn: expect.any(Object),
            cash: expect.any(Object),
            lmd: expect.any(Object),
            lmu: expect.any(Object),
          }),
        );
      });

      it('passing ISupplierBank should create a new form with FormGroup', () => {
        const formGroup = service.createSupplierBankFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            creditPeriod: expect.any(Object),
            maximumDiscount: expect.any(Object),
            maximumCreditLimit: expect.any(Object),
            chequeDrawn: expect.any(Object),
            cash: expect.any(Object),
            lmd: expect.any(Object),
            lmu: expect.any(Object),
          }),
        );
      });
    });

    describe('getSupplierBank', () => {
      it('should return NewSupplierBank for default SupplierBank initial value', () => {
        const formGroup = service.createSupplierBankFormGroup(sampleWithNewData);

        const supplierBank = service.getSupplierBank(formGroup) as any;

        expect(supplierBank).toMatchObject(sampleWithNewData);
      });

      it('should return NewSupplierBank for empty SupplierBank initial value', () => {
        const formGroup = service.createSupplierBankFormGroup();

        const supplierBank = service.getSupplierBank(formGroup) as any;

        expect(supplierBank).toMatchObject({});
      });

      it('should return ISupplierBank', () => {
        const formGroup = service.createSupplierBankFormGroup(sampleWithRequiredData);

        const supplierBank = service.getSupplierBank(formGroup) as any;

        expect(supplierBank).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISupplierBank should not enable id FormControl', () => {
        const formGroup = service.createSupplierBankFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSupplierBank should disable id FormControl', () => {
        const formGroup = service.createSupplierBankFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
