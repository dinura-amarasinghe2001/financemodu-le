import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../operational-unit.test-samples';

import { OperationalUnitFormService } from './operational-unit-form.service';

describe('OperationalUnit Form Service', () => {
  let service: OperationalUnitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationalUnitFormService);
  });

  describe('Service methods', () => {
    describe('createOperationalUnitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOperationalUnitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            displayName: expect.any(Object),
            levelBusinessType: expect.any(Object),
            remark: expect.any(Object),
            description: expect.any(Object),
            contactEmail: expect.any(Object),
            contactPhone: expect.any(Object),
            immediateParentCode: expect.any(Object),
            levelType: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            tenant: expect.any(Object),
          }),
        );
      });

      it('passing IOperationalUnit should create a new form with FormGroup', () => {
        const formGroup = service.createOperationalUnitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            name: expect.any(Object),
            displayName: expect.any(Object),
            levelBusinessType: expect.any(Object),
            remark: expect.any(Object),
            description: expect.any(Object),
            contactEmail: expect.any(Object),
            contactPhone: expect.any(Object),
            immediateParentCode: expect.any(Object),
            levelType: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            tenant: expect.any(Object),
          }),
        );
      });
    });

    describe('getOperationalUnit', () => {
      it('should return NewOperationalUnit for default OperationalUnit initial value', () => {
        const formGroup = service.createOperationalUnitFormGroup(sampleWithNewData);

        const operationalUnit = service.getOperationalUnit(formGroup) as any;

        expect(operationalUnit).toMatchObject(sampleWithNewData);
      });

      it('should return NewOperationalUnit for empty OperationalUnit initial value', () => {
        const formGroup = service.createOperationalUnitFormGroup();

        const operationalUnit = service.getOperationalUnit(formGroup) as any;

        expect(operationalUnit).toMatchObject({});
      });

      it('should return IOperationalUnit', () => {
        const formGroup = service.createOperationalUnitFormGroup(sampleWithRequiredData);

        const operationalUnit = service.getOperationalUnit(formGroup) as any;

        expect(operationalUnit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOperationalUnit should not enable id FormControl', () => {
        const formGroup = service.createOperationalUnitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOperationalUnit should disable id FormControl', () => {
        const formGroup = service.createOperationalUnitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
