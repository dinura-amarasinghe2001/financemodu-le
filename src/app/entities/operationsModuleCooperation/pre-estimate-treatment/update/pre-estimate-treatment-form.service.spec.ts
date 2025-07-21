import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../pre-estimate-treatment.test-samples';

import { PreEstimateTreatmentFormService } from './pre-estimate-treatment-form.service';

describe('PreEstimateTreatment Form Service', () => {
  let service: PreEstimateTreatmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreEstimateTreatmentFormService);
  });

  describe('Service methods', () => {
    describe('createPreEstimateTreatmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPreEstimateTreatmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleTreatmentID: expect.any(Object),
            fittingChargeName: expect.any(Object),
            paintName: expect.any(Object),
            partName: expect.any(Object),
            partNumber: expect.any(Object),
            repairName: expect.any(Object),
            other: expect.any(Object),
            sh: expect.any(Object),
            marketPrice: expect.any(Object),
            priceType: expect.any(Object),
            type: expect.any(Object),
            customPrice: expect.any(Object),
            unitPrice: expect.any(Object),
            price: expect.any(Object),
            totalPrice: expect.any(Object),
            isSystemPrice: expect.any(Object),
            availableQuantity: expect.any(Object),
            treatmentType: expect.any(Object),
            quantity: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            preEstimate: expect.any(Object),
          }),
        );
      });

      it('passing IPreEstimateTreatment should create a new form with FormGroup', () => {
        const formGroup = service.createPreEstimateTreatmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleTreatmentID: expect.any(Object),
            fittingChargeName: expect.any(Object),
            paintName: expect.any(Object),
            partName: expect.any(Object),
            partNumber: expect.any(Object),
            repairName: expect.any(Object),
            other: expect.any(Object),
            sh: expect.any(Object),
            marketPrice: expect.any(Object),
            priceType: expect.any(Object),
            type: expect.any(Object),
            customPrice: expect.any(Object),
            unitPrice: expect.any(Object),
            price: expect.any(Object),
            totalPrice: expect.any(Object),
            isSystemPrice: expect.any(Object),
            availableQuantity: expect.any(Object),
            treatmentType: expect.any(Object),
            quantity: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            preEstimate: expect.any(Object),
          }),
        );
      });
    });

    describe('getPreEstimateTreatment', () => {
      it('should return NewPreEstimateTreatment for default PreEstimateTreatment initial value', () => {
        const formGroup = service.createPreEstimateTreatmentFormGroup(sampleWithNewData);

        const preEstimateTreatment = service.getPreEstimateTreatment(formGroup) as any;

        expect(preEstimateTreatment).toMatchObject(sampleWithNewData);
      });

      it('should return NewPreEstimateTreatment for empty PreEstimateTreatment initial value', () => {
        const formGroup = service.createPreEstimateTreatmentFormGroup();

        const preEstimateTreatment = service.getPreEstimateTreatment(formGroup) as any;

        expect(preEstimateTreatment).toMatchObject({});
      });

      it('should return IPreEstimateTreatment', () => {
        const formGroup = service.createPreEstimateTreatmentFormGroup(sampleWithRequiredData);

        const preEstimateTreatment = service.getPreEstimateTreatment(formGroup) as any;

        expect(preEstimateTreatment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPreEstimateTreatment should not enable id FormControl', () => {
        const formGroup = service.createPreEstimateTreatmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPreEstimateTreatment should disable id FormControl', () => {
        const formGroup = service.createPreEstimateTreatmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
