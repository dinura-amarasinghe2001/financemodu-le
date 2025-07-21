import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-item-time-estimation.test-samples';

import { JobItemTimeEstimationFormService } from './job-item-time-estimation-form.service';

describe('JobItemTimeEstimation Form Service', () => {
  let service: JobItemTimeEstimationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobItemTimeEstimationFormService);
  });

  describe('Service methods', () => {
    describe('createJobItemTimeEstimationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobItemTimeEstimationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDateTime: expect.any(Object),
            endDateTime: expect.any(Object),
            remark: expect.any(Object),
            jobItemType: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobCard: expect.any(Object),
          }),
        );
      });

      it('passing IJobItemTimeEstimation should create a new form with FormGroup', () => {
        const formGroup = service.createJobItemTimeEstimationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDateTime: expect.any(Object),
            endDateTime: expect.any(Object),
            remark: expect.any(Object),
            jobItemType: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobCard: expect.any(Object),
          }),
        );
      });
    });

    describe('getJobItemTimeEstimation', () => {
      it('should return NewJobItemTimeEstimation for default JobItemTimeEstimation initial value', () => {
        const formGroup = service.createJobItemTimeEstimationFormGroup(sampleWithNewData);

        const jobItemTimeEstimation = service.getJobItemTimeEstimation(formGroup) as any;

        expect(jobItemTimeEstimation).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobItemTimeEstimation for empty JobItemTimeEstimation initial value', () => {
        const formGroup = service.createJobItemTimeEstimationFormGroup();

        const jobItemTimeEstimation = service.getJobItemTimeEstimation(formGroup) as any;

        expect(jobItemTimeEstimation).toMatchObject({});
      });

      it('should return IJobItemTimeEstimation', () => {
        const formGroup = service.createJobItemTimeEstimationFormGroup(sampleWithRequiredData);

        const jobItemTimeEstimation = service.getJobItemTimeEstimation(formGroup) as any;

        expect(jobItemTimeEstimation).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobItemTimeEstimation should not enable id FormControl', () => {
        const formGroup = service.createJobItemTimeEstimationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobItemTimeEstimation should disable id FormControl', () => {
        const formGroup = service.createJobItemTimeEstimationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
