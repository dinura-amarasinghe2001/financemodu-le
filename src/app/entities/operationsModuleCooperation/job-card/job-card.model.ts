import dayjs from "dayjs/esm";

export interface IJobCard {
  id: number;
  vehicleID?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  vehicleLicenseNumber?: string | null;
  vehicleOwnerID?: string | null;
  vehicleOwnerName?: string | null;
  vehicleOwnerContactNumber1?: string | null;
  vehicleOwnerContactNumber2?: string | null;
  estimateID?: string | null;
  insuranceCompany?: string | null;
  serviceAdvisor?: string | null;
  serviceAdvisorID?: string | null;
  numberOfPanels?: number | null;
  fuelLevel?: string | null;
  meterReading?: string | null;
  ownerBelongings?: string | null;
  startDate?: dayjs.Dayjs | null;
  jobCardNumber?: string | null;
  jobCompleteDate?: dayjs.Dayjs | null;
  boothDate?: dayjs.Dayjs | null;
  opsUnitID?: string | null;
  tinkeringStartDateTime?: dayjs.Dayjs | null;
  tinkeringEndDateTime?: dayjs.Dayjs | null;
  paintStartDateTime?: dayjs.Dayjs | null;
  paintEndDateTime?: dayjs.Dayjs | null;
  fittingStartDateTime?: dayjs.Dayjs | null;
  fittingEndDateTime?: dayjs.Dayjs | null;
  qcStartDateTime?: dayjs.Dayjs | null;
  qcEndDateTime?: dayjs.Dayjs | null;
  sparePartStartDateTime?: dayjs.Dayjs | null;
  sparePartEndDateTime?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
}

export type NewJobCard = Omit<IJobCard, "id"> & { id: null };
