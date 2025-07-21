import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../enabled-erp-module.test-samples';

import { EnabledERPModuleFormService } from './enabled-erp-module-form.service';

describe('EnabledERPModule Form Service', () => {
  let service: EnabledERPModuleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnabledERPModuleFormService);
  });

  describe('Service methods', () => {
    describe('createEnabledERPModuleFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEnabledERPModuleFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            moduleName: expect.any(Object),
            moduleCode: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            operationalUnit: expect.any(Object),
          }),
        );
      });

      it('passing IEnabledERPModule should create a new form with FormGroup', () => {
        const formGroup = service.createEnabledERPModuleFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            moduleName: expect.any(Object),
            moduleCode: expect.any(Object),
            description: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            operationalUnit: expect.any(Object),
          }),
        );
      });
    });

    describe('getEnabledERPModule', () => {
      it('should return NewEnabledERPModule for default EnabledERPModule initial value', () => {
        const formGroup = service.createEnabledERPModuleFormGroup(sampleWithNewData);

        const enabledERPModule = service.getEnabledERPModule(formGroup) as any;

        expect(enabledERPModule).toMatchObject(sampleWithNewData);
      });

      it('should return NewEnabledERPModule for empty EnabledERPModule initial value', () => {
        const formGroup = service.createEnabledERPModuleFormGroup();

        const enabledERPModule = service.getEnabledERPModule(formGroup) as any;

        expect(enabledERPModule).toMatchObject({});
      });

      it('should return IEnabledERPModule', () => {
        const formGroup = service.createEnabledERPModuleFormGroup(sampleWithRequiredData);

        const enabledERPModule = service.getEnabledERPModule(formGroup) as any;

        expect(enabledERPModule).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEnabledERPModule should not enable id FormControl', () => {
        const formGroup = service.createEnabledERPModuleFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEnabledERPModule should disable id FormControl', () => {
        const formGroup = service.createEnabledERPModuleFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
