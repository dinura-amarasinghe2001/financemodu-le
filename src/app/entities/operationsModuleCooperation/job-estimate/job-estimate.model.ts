import dayjs from "dayjs/esm";
import { JobCurrentState } from "app/entities/enumerations/job-current-state.model";
import { IJobCard } from "../job-card/job-card.model";
import {
  IJobEstimateWorkLog,
  NewJobEstimateWorkLog,
} from "../job-estimate-work-log/job-estimate-work-log.model";

export interface IJobEstimate {
  id: number;
  jobID?: string | null;
  departmentID?: string | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  currentState?: keyof typeof JobCurrentState | null;
  remarks?: string | null;
  estStartDate?: dayjs.Dayjs | null;
  estEndDate?: dayjs.Dayjs | null;
  opsUnitID?: string | null;
  estimateID?: string | null;
  vehicleLicenseNumber?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  jobCard?: IJobCard | null;
  jobEstimateWorkLogs?: NewJobEstimateWorkLog[];
}

export type NewJobEstimate = Omit<IJobEstimate, "id"> & { id: null };
