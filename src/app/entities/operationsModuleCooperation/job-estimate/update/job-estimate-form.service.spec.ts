import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-estimate.test-samples';

import { JobEstimateFormService } from './job-estimate-form.service';

describe('JobEstimate Form Service', () => {
  let service: JobEstimateFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobEstimateFormService);
  });

  describe('Service methods', () => {
    describe('createJobEstimateFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobEstimateFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            jobID: expect.any(Object),
            departmentID: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            currentState: expect.any(Object),
            remarks: expect.any(Object),
            estStartDate: expect.any(Object),
            estEndDate: expect.any(Object),
            opsUnitID: expect.any(Object),
            estimateID: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobCard: expect.any(Object),
          }),
        );
      });

      it('passing IJobEstimate should create a new form with FormGroup', () => {
        const formGroup = service.createJobEstimateFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            jobID: expect.any(Object),
            departmentID: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
            currentState: expect.any(Object),
            remarks: expect.any(Object),
            estStartDate: expect.any(Object),
            estEndDate: expect.any(Object),
            opsUnitID: expect.any(Object),
            estimateID: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobCard: expect.any(Object),
          }),
        );
      });
    });

    describe('getJobEstimate', () => {
      it('should return NewJobEstimate for default JobEstimate initial value', () => {
        const formGroup = service.createJobEstimateFormGroup(sampleWithNewData);

        const jobEstimate = service.getJobEstimate(formGroup) as any;

        expect(jobEstimate).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobEstimate for empty JobEstimate initial value', () => {
        const formGroup = service.createJobEstimateFormGroup();

        const jobEstimate = service.getJobEstimate(formGroup) as any;

        expect(jobEstimate).toMatchObject({});
      });

      it('should return IJobEstimate', () => {
        const formGroup = service.createJobEstimateFormGroup(sampleWithRequiredData);

        const jobEstimate = service.getJobEstimate(formGroup) as any;

        expect(jobEstimate).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobEstimate should not enable id FormControl', () => {
        const formGroup = service.createJobEstimateFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobEstimate should disable id FormControl', () => {
        const formGroup = service.createJobEstimateFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
