import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../grn.test-samples';

import { GRNFormService } from './grn-form.service';

describe('GRN Form Service', () => {
  let service: GRNFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GRNFormService);
  });

  describe('Service methods', () => {
    describe('createGRNFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGRNFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grnCode: expect.any(Object),
            grnDate: expect.any(Object),
            poNum: expect.any(Object),
            supplierId: expect.any(Object),
            supplierName: expect.any(Object),
            supplierAddress: expect.any(Object),
            invoiceId: expect.any(Object),
            invoiceCode: expect.any(Object),
            subTotal: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            amountOwing: expect.any(Object),
            isActive: expect.any(Object),
            inspected: expect.any(Object),
            orderId: expect.any(Object),
            supplierInvoiceCode: expect.any(Object),
            isAccountSectionChecked: expect.any(Object),
            total: expect.any(Object),
            isInventoryUpdated: expect.any(Object),
            comments: expect.any(Object),
            supplierInvoiceDate: expect.any(Object),
            supplierDiscount: expect.any(Object),
          }),
        );
      });

      it('passing IGRN should create a new form with FormGroup', () => {
        const formGroup = service.createGRNFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grnCode: expect.any(Object),
            grnDate: expect.any(Object),
            poNum: expect.any(Object),
            supplierId: expect.any(Object),
            supplierName: expect.any(Object),
            supplierAddress: expect.any(Object),
            invoiceId: expect.any(Object),
            invoiceCode: expect.any(Object),
            subTotal: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            amountOwing: expect.any(Object),
            isActive: expect.any(Object),
            inspected: expect.any(Object),
            orderId: expect.any(Object),
            supplierInvoiceCode: expect.any(Object),
            isAccountSectionChecked: expect.any(Object),
            total: expect.any(Object),
            isInventoryUpdated: expect.any(Object),
            comments: expect.any(Object),
            supplierInvoiceDate: expect.any(Object),
            supplierDiscount: expect.any(Object),
          }),
        );
      });
    });

    describe('getGRN', () => {
      it('should return NewGRN for default GRN initial value', () => {
        const formGroup = service.createGRNFormGroup(sampleWithNewData);

        const gRN = service.getGRN(formGroup) as any;

        expect(gRN).toMatchObject(sampleWithNewData);
      });

      it('should return NewGRN for empty GRN initial value', () => {
        const formGroup = service.createGRNFormGroup();

        const gRN = service.getGRN(formGroup) as any;

        expect(gRN).toMatchObject({});
      });

      it('should return IGRN', () => {
        const formGroup = service.createGRNFormGroup(sampleWithRequiredData);

        const gRN = service.getGRN(formGroup) as any;

        expect(gRN).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGRN should not enable id FormControl', () => {
        const formGroup = service.createGRNFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGRN should disable id FormControl', () => {
        const formGroup = service.createGRNFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
