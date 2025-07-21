import { IJobEstimateWorkLog } from "../job-estimate-work-log/job-estimate-work-log.model";

export interface IJobEstimateWorkProducts {
  id: number;
  workProductName?: string | null;
  quantity?: number | null;
  unit?: string | null;
  notes?: string | null;
  jobEstimateWorkLog?: IJobEstimateWorkLog | null;
}

export type NewJobEstimateWorkProducts = Omit<IJobEstimateWorkProducts, 'id'> & { id: null };
