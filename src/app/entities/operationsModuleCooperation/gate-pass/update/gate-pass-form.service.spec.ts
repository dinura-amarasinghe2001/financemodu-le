import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../gate-pass.test-samples';

import { GatePassFormService } from './gate-pass-form.service';

describe('GatePass Form Service', () => {
  let service: GatePassFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GatePassFormService);
  });

  describe('Service methods', () => {
    describe('createGatePassFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGatePassFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            fuelLevel: expect.any(Object),
            meterReading: expect.any(Object),
            status: expect.any(Object),
            frontView1: expect.any(Object),
            sideRView1: expect.any(Object),
            sideLView1: expect.any(Object),
            rearView1: expect.any(Object),
            jobCardNumber: expect.any(Object),
            receiptValue: expect.any(Object),
            entryDateTime: expect.any(Object),
            opsUnitID: expect.any(Object),
            invoiceNumber: expect.any(Object),
            ownerBelongings: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobCard: expect.any(Object),
          }),
        );
      });

      it('passing IGatePass should create a new form with FormGroup', () => {
        const formGroup = service.createGatePassFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            fuelLevel: expect.any(Object),
            meterReading: expect.any(Object),
            status: expect.any(Object),
            frontView1: expect.any(Object),
            sideRView1: expect.any(Object),
            sideLView1: expect.any(Object),
            rearView1: expect.any(Object),
            jobCardNumber: expect.any(Object),
            receiptValue: expect.any(Object),
            entryDateTime: expect.any(Object),
            opsUnitID: expect.any(Object),
            invoiceNumber: expect.any(Object),
            ownerBelongings: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            jobCard: expect.any(Object),
          }),
        );
      });
    });

    describe('getGatePass', () => {
      it('should return NewGatePass for default GatePass initial value', () => {
        const formGroup = service.createGatePassFormGroup(sampleWithNewData);

        const gatePass = service.getGatePass(formGroup) as any;

        expect(gatePass).toMatchObject(sampleWithNewData);
      });

      it('should return NewGatePass for empty GatePass initial value', () => {
        const formGroup = service.createGatePassFormGroup();

        const gatePass = service.getGatePass(formGroup) as any;

        expect(gatePass).toMatchObject({});
      });

      it('should return IGatePass', () => {
        const formGroup = service.createGatePassFormGroup(sampleWithRequiredData);

        const gatePass = service.getGatePass(formGroup) as any;

        expect(gatePass).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGatePass should not enable id FormControl', () => {
        const formGroup = service.createGatePassFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGatePass should disable id FormControl', () => {
        const formGroup = service.createGatePassFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
