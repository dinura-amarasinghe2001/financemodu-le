import { AppointmentType } from "app/entities/enumerations/appointment-type.model";
import dayjs from "dayjs/esm";
import { IVehicleRegistry } from "../vehicle-registry/vehicle-registry.model";
import { IClientRegistry } from "../client-registry/client-registry.model";

export interface IAppointment {
  id: number;
  appointmentDateTime?: dayjs.Dayjs | null;
  licenseNo?: string | null;
  vehicleID?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  clientID?: string | null;
  clientName?: string | null;
  clientContactNumber1?: string | null;
  clientContactNumber2?: string | null;
  clientAddress?: string | null;
  clientCity?: string | null;
  remarks?: string | null;
  appointmentType?: keyof typeof AppointmentType | null;
  opsUnitID?: string | null;
  isPaint?: boolean | null;
  isTinker?: boolean | null;
  isSpare?: boolean | null;
  isService?: boolean | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  vehicleRegistry?: IVehicleRegistry | null;
  clientRegistry?: IClientRegistry | null;
}

export type NewAppointment = Omit<IAppointment, "id"> & { id: null };
