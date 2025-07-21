import dayjs from 'dayjs/esm';
import { GatePassState } from './gate-pass-state.model';
import { IJobCard } from '../job-card/job-card.model';


export interface IGatePass {
  id: number;
  vehicleID?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  vehicleLicenseNumber?: string | null;
  vehicleOwnerID?: string | null;
  vehicleOwnerName?: string | null;
  vehicleOwnerContactNumber1?: string | null;
  vehicleOwnerContactNumber2?: string | null;
  fuelLevel?: string | null;
  meterReading?: string | null;
  status?: keyof typeof GatePassState | null;
  frontView1?: string | null;
  sideRView1?: string | null;
  sideLView1?: string | null;
  rearView1?: string | null;
  jobCardNumber?: string | null;
  receiptValue?: number | null;
  entryDateTime?: dayjs.Dayjs | null;
  opsUnitID?: string | null;
  invoiceNumber?: string | null;
  ownerBelongings?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  jobCard?: IJobCard | null;
}

export type NewGatePass = Omit<IGatePass, 'id'> & { id: null };
