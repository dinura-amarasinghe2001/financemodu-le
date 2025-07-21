import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vehicle-registry.test-samples';

import { VehicleRegistryFormService } from './vehicle-registry-form.service';

describe('VehicleRegistry Form Service', () => {
  let service: VehicleRegistryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleRegistryFormService);
  });

  describe('Service methods', () => {
    describe('createVehicleRegistryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVehicleRegistryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            licenseNo: expect.any(Object),
            yom: expect.any(Object),
            brand: expect.any(Object),
            model: expect.any(Object),
            brandID: expect.any(Object),
            modelID: expect.any(Object),
            modelNumber: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IVehicleRegistry should create a new form with FormGroup', () => {
        const formGroup = service.createVehicleRegistryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            licenseNo: expect.any(Object),
            yom: expect.any(Object),
            brand: expect.any(Object),
            model: expect.any(Object),
            brandID: expect.any(Object),
            modelID: expect.any(Object),
            modelNumber: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getVehicleRegistry', () => {
      it('should return NewVehicleRegistry for default VehicleRegistry initial value', () => {
        const formGroup = service.createVehicleRegistryFormGroup(sampleWithNewData);

        const vehicleRegistry = service.getVehicleRegistry(formGroup) as any;

        expect(vehicleRegistry).toMatchObject(sampleWithNewData);
      });

      it('should return NewVehicleRegistry for empty VehicleRegistry initial value', () => {
        const formGroup = service.createVehicleRegistryFormGroup();

        const vehicleRegistry = service.getVehicleRegistry(formGroup) as any;

        expect(vehicleRegistry).toMatchObject({});
      });

      it('should return IVehicleRegistry', () => {
        const formGroup = service.createVehicleRegistryFormGroup(sampleWithRequiredData);

        const vehicleRegistry = service.getVehicleRegistry(formGroup) as any;

        expect(vehicleRegistry).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVehicleRegistry should not enable id FormControl', () => {
        const formGroup = service.createVehicleRegistryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVehicleRegistry should disable id FormControl', () => {
        const formGroup = service.createVehicleRegistryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
