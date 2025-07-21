import dayjs from "dayjs/esm";

export interface IEstimate {
  id: number;
  vehicleID?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  licenseNo?: string | null;
  vehicleOwnerID?: string | null;
  vehicleOwnerName?: string | null;
  vehicleOwnerContactNumber1?: string | null;
  vehicleOwnerContactNumber2?: string | null;
  isInsurance?: boolean | null;
  insuranceName?: string | null;
  insuranceID?: string | null;
  opsUnitID?: string | null;
  totalPrice?: number | null;
  estimateID?: string | null;
  preEstimateNumber?: string | null;
  estimateNumber?: string | null;
  numberOfPanels?: number | null;
  serviceAdvisor?: string | null;
  serviceAdvisorID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  preEstimateType?: string | null;
  preEstimateType2?: string | null;
}

export type NewEstimate = Omit<IEstimate, "id"> & { id: null };
