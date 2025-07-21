import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../vehicle-treatment-registry.test-samples';

import { VehicleTreatmentRegistryFormService } from './vehicle-treatment-registry-form.service';

describe('VehicleTreatmentRegistry Form Service', () => {
  let service: VehicleTreatmentRegistryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleTreatmentRegistryFormService);
  });

  describe('Service methods', () => {
    describe('createVehicleTreatmentRegistryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVehicleTreatmentRegistryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fittingChargeName: expect.any(Object),
            paintName: expect.any(Object),
            partName: expect.any(Object),
            repairName: expect.any(Object),
            otherName: expect.any(Object),
            description: expect.any(Object),
            partNumber: expect.any(Object),
            availableQuantity: expect.any(Object),
            price: expect.any(Object),
            treatmentType: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            vehicleModel: expect.any(Object),
          }),
        );
      });

      it('passing IVehicleTreatmentRegistry should create a new form with FormGroup', () => {
        const formGroup = service.createVehicleTreatmentRegistryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            fittingChargeName: expect.any(Object),
            paintName: expect.any(Object),
            partName: expect.any(Object),
            repairName: expect.any(Object),
            otherName: expect.any(Object),
            description: expect.any(Object),
            partNumber: expect.any(Object),
            availableQuantity: expect.any(Object),
            price: expect.any(Object),
            treatmentType: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            vehicleModel: expect.any(Object),
          }),
        );
      });
    });

    describe('getVehicleTreatmentRegistry', () => {
      it('should return NewVehicleTreatmentRegistry for default VehicleTreatmentRegistry initial value', () => {
        const formGroup = service.createVehicleTreatmentRegistryFormGroup(sampleWithNewData);

        const vehicleTreatmentRegistry = service.getVehicleTreatmentRegistry(formGroup) as any;

        expect(vehicleTreatmentRegistry).toMatchObject(sampleWithNewData);
      });

      it('should return NewVehicleTreatmentRegistry for empty VehicleTreatmentRegistry initial value', () => {
        const formGroup = service.createVehicleTreatmentRegistryFormGroup();

        const vehicleTreatmentRegistry = service.getVehicleTreatmentRegistry(formGroup) as any;

        expect(vehicleTreatmentRegistry).toMatchObject({});
      });

      it('should return IVehicleTreatmentRegistry', () => {
        const formGroup = service.createVehicleTreatmentRegistryFormGroup(sampleWithRequiredData);

        const vehicleTreatmentRegistry = service.getVehicleTreatmentRegistry(formGroup) as any;

        expect(vehicleTreatmentRegistry).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVehicleTreatmentRegistry should not enable id FormControl', () => {
        const formGroup = service.createVehicleTreatmentRegistryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVehicleTreatmentRegistry should disable id FormControl', () => {
        const formGroup = service.createVehicleTreatmentRegistryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
