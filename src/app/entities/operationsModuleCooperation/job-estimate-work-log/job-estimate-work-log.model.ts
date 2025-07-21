import dayjs from "dayjs/esm";
import { IJobEstimate } from "../job-estimate/job-estimate.model";
import { IJobEstimateWorkProducts } from "../job-estimate-work-products/job-estimate-work-products.model";

export interface IJobEstimateWorkLog {
  id: number;
  workedEmployeeName?: string | null;
  workedHours?: number | null;
  workDate?: dayjs.Dayjs | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  jobEstimate?: IJobEstimate | null;
  jobEstimateProducts?: IJobEstimateWorkProducts[];
}

export type NewJobEstimateWorkLog = Omit<IJobEstimateWorkLog, "id"> & {
  id: null;
};
