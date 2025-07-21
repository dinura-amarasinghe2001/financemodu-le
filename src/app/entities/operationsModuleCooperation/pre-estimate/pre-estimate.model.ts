import dayjs from "dayjs/esm";

export interface IPreEstimate {
  id: number;
  vehicleID?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  licenseNo?: string | null;
  vehicleOwnerID?: string | null;
  vehicleOwnerName?: string | null;
  vehicleOwnerContactNumber1?: string | null;
  vehicleOwnerContactNumber2?: string | null;
  preEstimateNumber?: string | null;
  numberOfPanels?: number | null;
  preEstimateType?: string | null;
  preEstimateType2?: string | null;
  jobType?: number | null;
  isInsurance?: boolean | null;
  insuranceName?: string | null;
  insuranceID?: string | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  totalPrice?: number | null;
  isActive?: boolean | null;
}

export type NewPreEstimate = Omit<IPreEstimate, "id"> & { id: null };
