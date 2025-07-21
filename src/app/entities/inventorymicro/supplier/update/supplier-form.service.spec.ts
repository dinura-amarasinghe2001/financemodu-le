import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../supplier.test-samples';

import { SupplierFormService } from './supplier-form.service';

describe('Supplier Form Service', () => {
  let service: SupplierFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupplierFormService);
  });

  describe('Service methods', () => {
    describe('createSupplierFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSupplierFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            shortCode: expect.any(Object),
            name: expect.any(Object),
            addressOffice: expect.any(Object),
            streetOffice: expect.any(Object),
            cityOffice: expect.any(Object),
            provinceOffice: expect.any(Object),
            addressFactory: expect.any(Object),
            streetFactory: expect.any(Object),
            cityFactory: expect.any(Object),
            provinceFactory: expect.any(Object),
            phone1: expect.any(Object),
            phone2: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            website: expect.any(Object),
            contactPersonName: expect.any(Object),
            contactPersonPhone: expect.any(Object),
            contactPersonMobile: expect.any(Object),
            contactPersonEmail: expect.any(Object),
            registeredDate: expect.any(Object),
            description: expect.any(Object),
            brNumber: expect.any(Object),
            vatRegNumber: expect.any(Object),
            tinNumber: expect.any(Object),
            brNumberFilePath: expect.any(Object),
            vatRegNumberFilePath: expect.any(Object),
            tinNumberFilePath: expect.any(Object),
            agreementFilePath: expect.any(Object),
            roadMapFilePath: expect.any(Object),
            isActive: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            accountId: expect.any(Object),
            accountCode: expect.any(Object),
            isVATEnable: expect.any(Object),
            isNBTEnable: expect.any(Object),
            leadTime: expect.any(Object),
            isRegistered: expect.any(Object),
            creditPeriod: expect.any(Object),
            creditLimit: expect.any(Object),
          }),
        );
      });

      it('passing ISupplier should create a new form with FormGroup', () => {
        const formGroup = service.createSupplierFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            shortCode: expect.any(Object),
            name: expect.any(Object),
            addressOffice: expect.any(Object),
            streetOffice: expect.any(Object),
            cityOffice: expect.any(Object),
            provinceOffice: expect.any(Object),
            addressFactory: expect.any(Object),
            streetFactory: expect.any(Object),
            cityFactory: expect.any(Object),
            provinceFactory: expect.any(Object),
            phone1: expect.any(Object),
            phone2: expect.any(Object),
            fax: expect.any(Object),
            email: expect.any(Object),
            website: expect.any(Object),
            contactPersonName: expect.any(Object),
            contactPersonPhone: expect.any(Object),
            contactPersonMobile: expect.any(Object),
            contactPersonEmail: expect.any(Object),
            registeredDate: expect.any(Object),
            description: expect.any(Object),
            brNumber: expect.any(Object),
            vatRegNumber: expect.any(Object),
            tinNumber: expect.any(Object),
            brNumberFilePath: expect.any(Object),
            vatRegNumberFilePath: expect.any(Object),
            tinNumberFilePath: expect.any(Object),
            agreementFilePath: expect.any(Object),
            roadMapFilePath: expect.any(Object),
            isActive: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            accountId: expect.any(Object),
            accountCode: expect.any(Object),
            isVATEnable: expect.any(Object),
            isNBTEnable: expect.any(Object),
            leadTime: expect.any(Object),
            isRegistered: expect.any(Object),
            creditPeriod: expect.any(Object),
            creditLimit: expect.any(Object),
          }),
        );
      });
    });

    describe('getSupplier', () => {
      it('should return NewSupplier for default Supplier initial value', () => {
        const formGroup = service.createSupplierFormGroup(sampleWithNewData);

        const supplier = service.getSupplier(formGroup) as any;

        expect(supplier).toMatchObject(sampleWithNewData);
      });

      it('should return NewSupplier for empty Supplier initial value', () => {
        const formGroup = service.createSupplierFormGroup();

        const supplier = service.getSupplier(formGroup) as any;

        expect(supplier).toMatchObject({});
      });

      it('should return ISupplier', () => {
        const formGroup = service.createSupplierFormGroup(sampleWithRequiredData);

        const supplier = service.getSupplier(formGroup) as any;

        expect(supplier).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISupplier should not enable id FormControl', () => {
        const formGroup = service.createSupplierFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSupplier should disable id FormControl', () => {
        const formGroup = service.createSupplierFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
