import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../invoice-payments.test-samples';

import { InvoicePaymentsFormService } from './invoice-payments-form.service';

describe('InvoicePayments Form Service', () => {
  let service: InvoicePaymentsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoicePaymentsFormService);
  });

  describe('Service methods', () => {
    describe('createInvoicePaymentsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInvoicePaymentsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            paymentType: expect.any(Object),
            amount: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            invoice: expect.any(Object),
          }),
        );
      });

      it('passing IInvoicePayments should create a new form with FormGroup', () => {
        const formGroup = service.createInvoicePaymentsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            paymentType: expect.any(Object),
            amount: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            invoice: expect.any(Object),
          }),
        );
      });
    });

    describe('getInvoicePayments', () => {
      it('should return NewInvoicePayments for default InvoicePayments initial value', () => {
        const formGroup = service.createInvoicePaymentsFormGroup(sampleWithNewData);

        const invoicePayments = service.getInvoicePayments(formGroup) as any;

        expect(invoicePayments).toMatchObject(sampleWithNewData);
      });

      it('should return NewInvoicePayments for empty InvoicePayments initial value', () => {
        const formGroup = service.createInvoicePaymentsFormGroup();

        const invoicePayments = service.getInvoicePayments(formGroup) as any;

        expect(invoicePayments).toMatchObject({});
      });

      it('should return IInvoicePayments', () => {
        const formGroup = service.createInvoicePaymentsFormGroup(sampleWithRequiredData);

        const invoicePayments = service.getInvoicePayments(formGroup) as any;

        expect(invoicePayments).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInvoicePayments should not enable id FormControl', () => {
        const formGroup = service.createInvoicePaymentsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInvoicePayments should disable id FormControl', () => {
        const formGroup = service.createInvoicePaymentsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
