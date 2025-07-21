import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../pre-estimate.test-samples';

import { PreEstimateFormService } from './pre-estimate-form.service';

describe('PreEstimate Form Service', () => {
  let service: PreEstimateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreEstimateFormService);
  });

  describe('Service methods', () => {
    describe('createPreEstimateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPreEstimateFormGroup();

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
            preEstimateNumber: expect.any(Object),
            numberOfPanels: expect.any(Object),
            jobType: expect.any(Object),
            isInsurance: expect.any(Object),
            insuranceName: expect.any(Object),
            insuranceID: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IPreEstimate should create a new form with FormGroup', () => {
        const formGroup = service.createPreEstimateFormGroup(sampleWithRequiredData);

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
            preEstimateNumber: expect.any(Object),
            numberOfPanels: expect.any(Object),
            jobType: expect.any(Object),
            isInsurance: expect.any(Object),
            insuranceName: expect.any(Object),
            insuranceID: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getPreEstimate', () => {
      it('should return NewPreEstimate for default PreEstimate initial value', () => {
        const formGroup = service.createPreEstimateFormGroup(sampleWithNewData);

        const preEstimate = service.getPreEstimate(formGroup) as any;

        expect(preEstimate).toMatchObject(sampleWithNewData);
      });

      it('should return NewPreEstimate for empty PreEstimate initial value', () => {
        const formGroup = service.createPreEstimateFormGroup();

        const preEstimate = service.getPreEstimate(formGroup) as any;

        expect(preEstimate).toMatchObject({});
      });

      it('should return IPreEstimate', () => {
        const formGroup = service.createPreEstimateFormGroup(sampleWithRequiredData);

        const preEstimate = service.getPreEstimate(formGroup) as any;

        expect(preEstimate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPreEstimate should not enable id FormControl', () => {
        const formGroup = service.createPreEstimateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPreEstimate should disable id FormControl', () => {
        const formGroup = service.createPreEstimateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
