import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../invoice.test-samples';

import { InvoiceFormService } from './invoice-form.service';

describe('Invoice Form Service', () => {
  let service: InvoiceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceFormService);
  });

  describe('Service methods', () => {
    describe('createInvoiceFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInvoiceFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            jobID: expect.any(Object),
            totalNetAmount: expect.any(Object),
            discountRate: expect.any(Object),
            discountAmount: expect.any(Object),
            totalAmount: expect.any(Object),
            netTotalAmount: expect.any(Object),
            vatAmount: expect.any(Object),
            customerVATNumber: expect.any(Object),
            invoiceDate: expect.any(Object),
            invoiceStatus: expect.any(Object),
          }),
        );
      });

      it('passing IInvoice should create a new form with FormGroup', () => {
        const formGroup = service.createInvoiceFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            jobID: expect.any(Object),
            totalNetAmount: expect.any(Object),
            discountRate: expect.any(Object),
            discountAmount: expect.any(Object),
            totalAmount: expect.any(Object),
            netTotalAmount: expect.any(Object),
            vatAmount: expect.any(Object),
            customerVATNumber: expect.any(Object),
            invoiceDate: expect.any(Object),
            invoiceStatus: expect.any(Object),
          }),
        );
      });
    });

    describe('getInvoice', () => {
      it('should return NewInvoice for default Invoice initial value', () => {
        const formGroup = service.createInvoiceFormGroup(sampleWithNewData);

        const invoice = service.getInvoice(formGroup) as any;

        expect(invoice).toMatchObject(sampleWithNewData);
      });

      it('should return NewInvoice for empty Invoice initial value', () => {
        const formGroup = service.createInvoiceFormGroup();

        const invoice = service.getInvoice(formGroup) as any;

        expect(invoice).toMatchObject({});
      });

      it('should return IInvoice', () => {
        const formGroup = service.createInvoiceFormGroup(sampleWithRequiredData);

        const invoice = service.getInvoice(formGroup) as any;

        expect(invoice).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInvoice should not enable id FormControl', () => {
        const formGroup = service.createInvoiceFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInvoice should disable id FormControl', () => {
        const formGroup = service.createInvoiceFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
