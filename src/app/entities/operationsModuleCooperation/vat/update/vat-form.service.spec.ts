import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vat.test-samples';

import { VatFormService } from './vat-form.service';

describe('Vat Form Service', () => {
  let service: VatFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VatFormService);
  });

  describe('Service methods', () => {
    describe('createVatFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVatFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vatRate: expect.any(Object),
            vatAmount: expect.any(Object),
            vatName: expect.any(Object),
          }),
        );
      });

      it('passing IVat should create a new form with FormGroup', () => {
        const formGroup = service.createVatFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vatRate: expect.any(Object),
            vatAmount: expect.any(Object),
            vatName: expect.any(Object),
          }),
        );
      });
    });

    describe('getVat', () => {
      it('should return NewVat for default Vat initial value', () => {
        const formGroup = service.createVatFormGroup(sampleWithNewData);

        const vat = service.getVat(formGroup) as any;

        expect(vat).toMatchObject(sampleWithNewData);
      });

      it('should return NewVat for empty Vat initial value', () => {
        const formGroup = service.createVatFormGroup();

        const vat = service.getVat(formGroup) as any;

        expect(vat).toMatchObject({});
      });

      it('should return IVat', () => {
        const formGroup = service.createVatFormGroup(sampleWithRequiredData);

        const vat = service.getVat(formGroup) as any;

        expect(vat).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVat should not enable id FormControl', () => {
        const formGroup = service.createVatFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVat should disable id FormControl', () => {
        const formGroup = service.createVatFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
