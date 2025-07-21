import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../flag.test-samples';

import { FlagFormService } from './flag-form.service';

describe('Flag Form Service', () => {
  let service: FlagFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlagFormService);
  });

  describe('Service methods', () => {
    describe('createFlagFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createFlagFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            flagId: expect.any(Object),
            flagName: expect.any(Object),
            flagValue: expect.any(Object),
            description: expect.any(Object),
            isDeleted: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            tenant: expect.any(Object),
          }),
        );
      });

      it('passing IFlag should create a new form with FormGroup', () => {
        const formGroup = service.createFlagFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            flagId: expect.any(Object),
            flagName: expect.any(Object),
            flagValue: expect.any(Object),
            description: expect.any(Object),
            isDeleted: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            tenant: expect.any(Object),
          }),
        );
      });
    });

    describe('getFlag', () => {
      it('should return NewFlag for default Flag initial value', () => {
        const formGroup = service.createFlagFormGroup(sampleWithNewData);

        const flag = service.getFlag(formGroup) as any;

        expect(flag).toMatchObject(sampleWithNewData);
      });

      it('should return NewFlag for empty Flag initial value', () => {
        const formGroup = service.createFlagFormGroup();

        const flag = service.getFlag(formGroup) as any;

        expect(flag).toMatchObject({});
      });

      it('should return IFlag', () => {
        const formGroup = service.createFlagFormGroup(sampleWithRequiredData);

        const flag = service.getFlag(formGroup) as any;

        expect(flag).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IFlag should not enable id FormControl', () => {
        const formGroup = service.createFlagFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewFlag should disable id FormControl', () => {
        const formGroup = service.createFlagFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
