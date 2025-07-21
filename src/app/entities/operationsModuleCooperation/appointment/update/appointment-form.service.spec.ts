import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../appointment.test-samples';

import { AppointmentFormService } from './appointment-form.service';

describe('Appointment Form Service', () => {
  let service: AppointmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentFormService);
  });

  describe('Service methods', () => {
    describe('createAppointmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAppointmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            appointmentDateTime: expect.any(Object),
            licenseNo: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            clientID: expect.any(Object),
            clientName: expect.any(Object),
            clientContactNumber1: expect.any(Object),
            clientContactNumber2: expect.any(Object),
            clientAddress: expect.any(Object),
            clientCity: expect.any(Object),
            remarks: expect.any(Object),
            appointmentType: expect.any(Object),
            opsUnitID: expect.any(Object),
            isPaint: expect.any(Object),
            isTinker: expect.any(Object),
            isSpare: expect.any(Object),
            isService: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            vehicleRegistry: expect.any(Object),
            clientRegistry: expect.any(Object),
          }),
        );
      });

      it('passing IAppointment should create a new form with FormGroup', () => {
        const formGroup = service.createAppointmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            appointmentDateTime: expect.any(Object),
            licenseNo: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            clientID: expect.any(Object),
            clientName: expect.any(Object),
            clientContactNumber1: expect.any(Object),
            clientContactNumber2: expect.any(Object),
            clientAddress: expect.any(Object),
            clientCity: expect.any(Object),
            remarks: expect.any(Object),
            appointmentType: expect.any(Object),
            opsUnitID: expect.any(Object),
            isPaint: expect.any(Object),
            isTinker: expect.any(Object),
            isSpare: expect.any(Object),
            isService: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
            vehicleRegistry: expect.any(Object),
            clientRegistry: expect.any(Object),
          }),
        );
      });
    });

    describe('getAppointment', () => {
      it('should return NewAppointment for default Appointment initial value', () => {
        const formGroup = service.createAppointmentFormGroup(sampleWithNewData);

        const appointment = service.getAppointment(formGroup) as any;

        expect(appointment).toMatchObject(sampleWithNewData);
      });

      it('should return NewAppointment for empty Appointment initial value', () => {
        const formGroup = service.createAppointmentFormGroup();

        const appointment = service.getAppointment(formGroup) as any;

        expect(appointment).toMatchObject({});
      });

      it('should return IAppointment', () => {
        const formGroup = service.createAppointmentFormGroup(sampleWithRequiredData);

        const appointment = service.getAppointment(formGroup) as any;

        expect(appointment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAppointment should not enable id FormControl', () => {
        const formGroup = service.createAppointmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAppointment should disable id FormControl', () => {
        const formGroup = service.createAppointmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
