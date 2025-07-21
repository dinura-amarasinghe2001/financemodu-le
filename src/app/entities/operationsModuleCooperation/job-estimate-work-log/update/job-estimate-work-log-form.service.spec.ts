import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-estimate-work-log.test-samples';

import { JobEstimateWorkLogFormService } from './job-estimate-work-log-form.service';

describe('JobEstimateWorkLog Form Service', () => {
  let service: JobEstimateWorkLogFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobEstimateWorkLogFormService);
  });

  describe('Service methods', () => {
    describe('createJobEstimateWorkLogFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobEstimateWorkLogFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            workedEmployeeName: expect.any(Object),
            workedHours: expect.any(Object),
            workDate: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobEstimate: expect.any(Object),
          }),
        );
      });

      it('passing IJobEstimateWorkLog should create a new form with FormGroup', () => {
        const formGroup = service.createJobEstimateWorkLogFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            workedEmployeeName: expect.any(Object),
            workedHours: expect.any(Object),
            workDate: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobEstimate: expect.any(Object),
          }),
        );
      });
    });

    describe('getJobEstimateWorkLog', () => {
      it('should return NewJobEstimateWorkLog for default JobEstimateWorkLog initial value', () => {
        const formGroup = service.createJobEstimateWorkLogFormGroup(sampleWithNewData);

        const jobEstimateWorkLog = service.getJobEstimateWorkLog(formGroup) as any;

        expect(jobEstimateWorkLog).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobEstimateWorkLog for empty JobEstimateWorkLog initial value', () => {
        const formGroup = service.createJobEstimateWorkLogFormGroup();

        const jobEstimateWorkLog = service.getJobEstimateWorkLog(formGroup) as any;

        expect(jobEstimateWorkLog).toMatchObject({});
      });

      it('should return IJobEstimateWorkLog', () => {
        const formGroup = service.createJobEstimateWorkLogFormGroup(sampleWithRequiredData);

        const jobEstimateWorkLog = service.getJobEstimateWorkLog(formGroup) as any;

        expect(jobEstimateWorkLog).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobEstimateWorkLog should not enable id FormControl', () => {
        const formGroup = service.createJobEstimateWorkLogFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobEstimateWorkLog should disable id FormControl', () => {
        const formGroup = service.createJobEstimateWorkLogFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
