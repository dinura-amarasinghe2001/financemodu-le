import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vehicle-model.test-samples';

import { VehicleModelFormService } from './vehicle-model-form.service';

describe('VehicleModel Form Service', () => {
  let service: VehicleModelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleModelFormService);
  });

  describe('Service methods', () => {
    describe('createVehicleModelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVehicleModelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            modelName: expect.any(Object),
            description: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            brand: expect.any(Object),
          }),
        );
      });

      it('passing IVehicleModel should create a new form with FormGroup', () => {
        const formGroup = service.createVehicleModelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            modelName: expect.any(Object),
            description: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            brand: expect.any(Object),
          }),
        );
      });
    });

    describe('getVehicleModel', () => {
      it('should return NewVehicleModel for default VehicleModel initial value', () => {
        const formGroup = service.createVehicleModelFormGroup(sampleWithNewData);

        const vehicleModel = service.getVehicleModel(formGroup) as any;

        expect(vehicleModel).toMatchObject(sampleWithNewData);
      });

      it('should return NewVehicleModel for empty VehicleModel initial value', () => {
        const formGroup = service.createVehicleModelFormGroup();

        const vehicleModel = service.getVehicleModel(formGroup) as any;

        expect(vehicleModel).toMatchObject({});
      });

      it('should return IVehicleModel', () => {
        const formGroup = service.createVehicleModelFormGroup(sampleWithRequiredData);

        const vehicleModel = service.getVehicleModel(formGroup) as any;

        expect(vehicleModel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVehicleModel should not enable id FormControl', () => {
        const formGroup = service.createVehicleModelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVehicleModel should disable id FormControl', () => {
        const formGroup = service.createVehicleModelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
