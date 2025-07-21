import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../estimate.test-samples';

import { EstimateFormService } from './estimate-form.service';

describe('Estimate Form Service', () => {
  let service: EstimateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimateFormService);
  });

  describe('Service methods', () => {
    describe('createEstimateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstimateFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            licenseNo: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            isInsurance: expect.any(Object),
            insuranceName: expect.any(Object),
            insuranceID: expect.any(Object),
            opsUnitID: expect.any(Object),
            totalPrice: expect.any(Object),
            estimateID: expect.any(Object),
            preEstimateNumber: expect.any(Object),
            estimateNumber: expect.any(Object),
            numberOfPanels: expect.any(Object),
            serviceAdvisor: expect.any(Object),
            serviceAdvisorID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IEstimate should create a new form with FormGroup', () => {
        const formGroup = service.createEstimateFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            licenseNo: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            isInsurance: expect.any(Object),
            insuranceName: expect.any(Object),
            insuranceID: expect.any(Object),
            opsUnitID: expect.any(Object),
            totalPrice: expect.any(Object),
            estimateID: expect.any(Object),
            preEstimateNumber: expect.any(Object),
            estimateNumber: expect.any(Object),
            numberOfPanels: expect.any(Object),
            serviceAdvisor: expect.any(Object),
            serviceAdvisorID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getEstimate', () => {
      it('should return NewEstimate for default Estimate initial value', () => {
        const formGroup = service.createEstimateFormGroup(sampleWithNewData);

        const estimate = service.getEstimate(formGroup) as any;

        expect(estimate).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstimate for empty Estimate initial value', () => {
        const formGroup = service.createEstimateFormGroup();

        const estimate = service.getEstimate(formGroup) as any;

        expect(estimate).toMatchObject({});
      });

      it('should return IEstimate', () => {
        const formGroup = service.createEstimateFormGroup(sampleWithRequiredData);

        const estimate = service.getEstimate(formGroup) as any;

        expect(estimate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstimate should not enable id FormControl', () => {
        const formGroup = service.createEstimateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstimate should disable id FormControl', () => {
        const formGroup = service.createEstimateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
