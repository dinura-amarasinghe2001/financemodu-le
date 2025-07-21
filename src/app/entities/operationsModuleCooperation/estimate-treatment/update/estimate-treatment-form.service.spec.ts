import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../estimate-treatment.test-samples';

import { EstimateTreatmentFormService } from './estimate-treatment-form.service';

describe('EstimateTreatment Form Service', () => {
  let service: EstimateTreatmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimateTreatmentFormService);
  });

  describe('Service methods', () => {
    describe('createEstimateTreatmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstimateTreatmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleTreatmentID: expect.any(Object),
            fittingChargeName: expect.any(Object),
            paintName: expect.any(Object),
            partName: expect.any(Object),
            repairName: expect.any(Object),
            other: expect.any(Object),
            priceType: expect.any(Object),
            customPrice: expect.any(Object),
            sh: expect.any(Object),
            marketPrice: expect.any(Object),
            type: expect.any(Object),
            partNumber: expect.any(Object),
            availableQuantity: expect.any(Object),
            unitPrice: expect.any(Object),
            treatmentType: expect.any(Object),
            quantity: expect.any(Object),
            isSystemPrice: expect.any(Object),
            isPriceConfirmed: expect.any(Object),
            approvedDate: expect.any(Object),
            price: expect.any(Object),
            approvedPrice: expect.any(Object),
            approvedPriceState: expect.any(Object),
            estimateTreatmentReason: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            estimate: expect.any(Object),
          }),
        );
      });

      it('passing IEstimateTreatment should create a new form with FormGroup', () => {
        const formGroup = service.createEstimateTreatmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleTreatmentID: expect.any(Object),
            fittingChargeName: expect.any(Object),
            paintName: expect.any(Object),
            partName: expect.any(Object),
            repairName: expect.any(Object),
            other: expect.any(Object),
            priceType: expect.any(Object),
            customPrice: expect.any(Object),
            sh: expect.any(Object),
            marketPrice: expect.any(Object),
            type: expect.any(Object),
            partNumber: expect.any(Object),
            availableQuantity: expect.any(Object),
            unitPrice: expect.any(Object),
            treatmentType: expect.any(Object),
            quantity: expect.any(Object),
            isSystemPrice: expect.any(Object),
            isPriceConfirmed: expect.any(Object),
            approvedDate: expect.any(Object),
            price: expect.any(Object),
            approvedPrice: expect.any(Object),
            approvedPriceState: expect.any(Object),
            estimateTreatmentReason: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            estimate: expect.any(Object),
          }),
        );
      });
    });

    describe('getEstimateTreatment', () => {
      it('should return NewEstimateTreatment for default EstimateTreatment initial value', () => {
        const formGroup = service.createEstimateTreatmentFormGroup(sampleWithNewData);

        const estimateTreatment = service.getEstimateTreatment(formGroup) as any;

        expect(estimateTreatment).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstimateTreatment for empty EstimateTreatment initial value', () => {
        const formGroup = service.createEstimateTreatmentFormGroup();

        const estimateTreatment = service.getEstimateTreatment(formGroup) as any;

        expect(estimateTreatment).toMatchObject({});
      });

      it('should return IEstimateTreatment', () => {
        const formGroup = service.createEstimateTreatmentFormGroup(sampleWithRequiredData);

        const estimateTreatment = service.getEstimateTreatment(formGroup) as any;

        expect(estimateTreatment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstimateTreatment should not enable id FormControl', () => {
        const formGroup = service.createEstimateTreatmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstimateTreatment should disable id FormControl', () => {
        const formGroup = service.createEstimateTreatmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
