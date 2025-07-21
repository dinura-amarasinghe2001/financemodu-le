import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAppointment, NewAppointment } from '../appointment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAppointment for edit and NewAppointmentFormGroupInput for create.
 */
type AppointmentFormGroupInput = IAppointment | PartialWithRequiredKeyOf<NewAppointment>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAppointment | NewAppointment> = Omit<T, 'appointmentDateTime' | 'createdDate' | 'lastModifiedDate'> & {
  appointmentDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

type AppointmentFormRawValue = FormValueOf<IAppointment>;

type NewAppointmentFormRawValue = FormValueOf<NewAppointment>;

type AppointmentFormDefaults = Pick<
  NewAppointment,
  'id' | 'appointmentDateTime' | 'isPaint' | 'isTinker' | 'isSpare' | 'isService' | 'createdDate' | 'lastModifiedDate'
>;

type AppointmentFormGroupContent = {
  id: FormControl<AppointmentFormRawValue['id'] | NewAppointment['id']>;
  appointmentDateTime: FormControl<AppointmentFormRawValue['appointmentDateTime']>;
  licenseNo: FormControl<AppointmentFormRawValue['licenseNo']>;
  vehicleID: FormControl<AppointmentFormRawValue['vehicleID']>;
  vehicleBrand: FormControl<AppointmentFormRawValue['vehicleBrand']>;
  vehicleModel: FormControl<AppointmentFormRawValue['vehicleModel']>;
  clientID: FormControl<AppointmentFormRawValue['clientID']>;
  clientName: FormControl<AppointmentFormRawValue['clientName']>;
  clientContactNumber1: FormControl<AppointmentFormRawValue['clientContactNumber1']>;
  clientContactNumber2: FormControl<AppointmentFormRawValue['clientContactNumber2']>;
  clientAddress: FormControl<AppointmentFormRawValue['clientAddress']>;
  clientCity: FormControl<AppointmentFormRawValue['clientCity']>;
  remarks: FormControl<AppointmentFormRawValue['remarks']>;
  appointmentType: FormControl<AppointmentFormRawValue['appointmentType']>;
  opsUnitID: FormControl<AppointmentFormRawValue['opsUnitID']>;
  isPaint: FormControl<AppointmentFormRawValue['isPaint']>;
  isTinker: FormControl<AppointmentFormRawValue['isTinker']>;
  isSpare: FormControl<AppointmentFormRawValue['isSpare']>;
  isService: FormControl<AppointmentFormRawValue['isService']>;
  createdBy: FormControl<AppointmentFormRawValue['createdBy']>;
  createdDate: FormControl<AppointmentFormRawValue['createdDate']>;
  lastModifiedBy: FormControl<AppointmentFormRawValue['lastModifiedBy']>;
  lastModifiedDate: FormControl<AppointmentFormRawValue['lastModifiedDate']>;
  vehicleRegistry: FormControl<AppointmentFormRawValue['vehicleRegistry']>;
  clientRegistry: FormControl<AppointmentFormRawValue['clientRegistry']>;
};

export type AppointmentFormGroup = FormGroup<AppointmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AppointmentFormService {
  createAppointmentFormGroup(appointment: AppointmentFormGroupInput = { id: null }): AppointmentFormGroup {
    const appointmentRawValue = this.convertAppointmentToAppointmentRawValue({
      ...this.getFormDefaults(),
      ...appointment,
    });
    return new FormGroup<AppointmentFormGroupContent>({
      id: new FormControl(
        { value: appointmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      appointmentDateTime: new FormControl(appointmentRawValue.appointmentDateTime),
      licenseNo: new FormControl(appointmentRawValue.licenseNo),
      vehicleID: new FormControl(appointmentRawValue.vehicleID),
      vehicleBrand: new FormControl(appointmentRawValue.vehicleBrand),
      vehicleModel: new FormControl(appointmentRawValue.vehicleModel),
      clientID: new FormControl(appointmentRawValue.clientID),
      clientName: new FormControl(appointmentRawValue.clientName),
      clientContactNumber1: new FormControl(appointmentRawValue.clientContactNumber1),
      clientContactNumber2: new FormControl(appointmentRawValue.clientContactNumber2),
      clientAddress: new FormControl(appointmentRawValue.clientAddress),
      clientCity: new FormControl(appointmentRawValue.clientCity),
      remarks: new FormControl(appointmentRawValue.remarks),
      appointmentType: new FormControl(appointmentRawValue.appointmentType),
      opsUnitID: new FormControl(appointmentRawValue.opsUnitID),
      isPaint: new FormControl(appointmentRawValue.isPaint),
      isTinker: new FormControl(appointmentRawValue.isTinker),
      isSpare: new FormControl(appointmentRawValue.isSpare),
      isService: new FormControl(appointmentRawValue.isService),
      createdBy: new FormControl(appointmentRawValue.createdBy),
      createdDate: new FormControl(appointmentRawValue.createdDate),
      lastModifiedBy: new FormControl(appointmentRawValue.lastModifiedBy),
      lastModifiedDate: new FormControl(appointmentRawValue.lastModifiedDate),
      vehicleRegistry: new FormControl(appointmentRawValue.vehicleRegistry),
      clientRegistry: new FormControl(appointmentRawValue.clientRegistry),
    });
  }

  getAppointment(form: AppointmentFormGroup): IAppointment | NewAppointment {
    return this.convertAppointmentRawValueToAppointment(form.getRawValue() as AppointmentFormRawValue | NewAppointmentFormRawValue);
  }

  resetForm(form: AppointmentFormGroup, appointment: AppointmentFormGroupInput): void {
    const appointmentRawValue = this.convertAppointmentToAppointmentRawValue({ ...this.getFormDefaults(), ...appointment });
    form.reset(
      {
        ...appointmentRawValue,
        id: { value: appointmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AppointmentFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      appointmentDateTime: currentTime,
      isPaint: false,
      isTinker: false,
      isSpare: false,
      isService: false,
      createdDate: currentTime,
      lastModifiedDate: currentTime,
    };
  }

  private convertAppointmentRawValueToAppointment(
    rawAppointment: AppointmentFormRawValue | NewAppointmentFormRawValue,
  ): IAppointment | NewAppointment {
    return {
      ...rawAppointment,
      appointmentDateTime: dayjs(rawAppointment.appointmentDateTime, DATE_TIME_FORMAT),
      createdDate: dayjs(rawAppointment.createdDate, DATE_TIME_FORMAT),
      lastModifiedDate: dayjs(rawAppointment.lastModifiedDate, DATE_TIME_FORMAT),
    };
  }

  private convertAppointmentToAppointmentRawValue(
    appointment: IAppointment | (Partial<NewAppointment> & AppointmentFormDefaults),
  ): AppointmentFormRawValue | PartialWithRequiredKeyOf<NewAppointmentFormRawValue> {
    return {
      ...appointment,
      appointmentDateTime: appointment.appointmentDateTime ? appointment.appointmentDateTime.format(DATE_TIME_FORMAT) : undefined,
      createdDate: appointment.createdDate ? appointment.createdDate.format(DATE_TIME_FORMAT) : undefined,
      lastModifiedDate: appointment.lastModifiedDate ? appointment.lastModifiedDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
