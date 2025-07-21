import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../insurance-registry.test-samples';

import { InsuranceRegistryFormService } from './insurance-registry-form.service';

describe('InsuranceRegistry Form Service', () => {
  let service: InsuranceRegistryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuranceRegistryFormService);
  });

  describe('Service methods', () => {
    describe('createInsuranceRegistryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInsuranceRegistryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            insuranceName: expect.any(Object),
            remark: expect.any(Object),
            hotline: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IInsuranceRegistry should create a new form with FormGroup', () => {
        const formGroup = service.createInsuranceRegistryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            insuranceName: expect.any(Object),
            remark: expect.any(Object),
            hotline: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getInsuranceRegistry', () => {
      it('should return NewInsuranceRegistry for default InsuranceRegistry initial value', () => {
        const formGroup = service.createInsuranceRegistryFormGroup(sampleWithNewData);

        const insuranceRegistry = service.getInsuranceRegistry(formGroup) as any;

        expect(insuranceRegistry).toMatchObject(sampleWithNewData);
      });

      it('should return NewInsuranceRegistry for empty InsuranceRegistry initial value', () => {
        const formGroup = service.createInsuranceRegistryFormGroup();

        const insuranceRegistry = service.getInsuranceRegistry(formGroup) as any;

        expect(insuranceRegistry).toMatchObject({});
      });

      it('should return IInsuranceRegistry', () => {
        const formGroup = service.createInsuranceRegistryFormGroup(sampleWithRequiredData);

        const insuranceRegistry = service.getInsuranceRegistry(formGroup) as any;

        expect(insuranceRegistry).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInsuranceRegistry should not enable id FormControl', () => {
        const formGroup = service.createInsuranceRegistryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInsuranceRegistry should disable id FormControl', () => {
        const formGroup = service.createInsuranceRegistryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
