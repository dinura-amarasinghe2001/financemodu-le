import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-estimate-work-products.test-samples';

import { JobEstimateWorkProductsFormService } from './job-estimate-work-products-form.service';

describe('JobEstimateWorkProducts Form Service', () => {
  let service: JobEstimateWorkProductsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobEstimateWorkProductsFormService);
  });

  describe('Service methods', () => {
    describe('createJobEstimateWorkProductsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobEstimateWorkProductsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            workProductName: expect.any(Object),
            quantity: expect.any(Object),
            unit: expect.any(Object),
            notes: expect.any(Object),
            jobEstimateWorkLog: expect.any(Object),
          }),
        );
      });

      it('passing IJobEstimateWorkProducts should create a new form with FormGroup', () => {
        const formGroup = service.createJobEstimateWorkProductsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            workProductName: expect.any(Object),
            quantity: expect.any(Object),
            unit: expect.any(Object),
            notes: expect.any(Object),
            jobEstimateWorkLog: expect.any(Object),
          }),
        );
      });
    });

    describe('getJobEstimateWorkProducts', () => {
      it('should return NewJobEstimateWorkProducts for default JobEstimateWorkProducts initial value', () => {
        const formGroup = service.createJobEstimateWorkProductsFormGroup(sampleWithNewData);

        const jobEstimateWorkProducts = service.getJobEstimateWorkProducts(formGroup) as any;

        expect(jobEstimateWorkProducts).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobEstimateWorkProducts for empty JobEstimateWorkProducts initial value', () => {
        const formGroup = service.createJobEstimateWorkProductsFormGroup();

        const jobEstimateWorkProducts = service.getJobEstimateWorkProducts(formGroup) as any;

        expect(jobEstimateWorkProducts).toMatchObject({});
      });

      it('should return IJobEstimateWorkProducts', () => {
        const formGroup = service.createJobEstimateWorkProductsFormGroup(sampleWithRequiredData);

        const jobEstimateWorkProducts = service.getJobEstimateWorkProducts(formGroup) as any;

        expect(jobEstimateWorkProducts).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobEstimateWorkProducts should not enable id FormControl', () => {
        const formGroup = service.createJobEstimateWorkProductsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobEstimateWorkProducts should disable id FormControl', () => {
        const formGroup = service.createJobEstimateWorkProductsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
