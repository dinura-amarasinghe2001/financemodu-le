import dayjs from 'dayjs/esm';
import { IJobCard } from 'app/entities/operationsModuleCooperation/job-card/job-card.model';
import { JobItemType } from 'app/entities/enumerations/job-item-type.model';

export interface IJobItemTimeEstimation {
  id: number;
  startDateTime?: dayjs.Dayjs | null;
  endDateTime?: dayjs.Dayjs | null;
  remark?: string | null;
  jobItemType?: keyof typeof JobItemType | null;
  opsUnitID?: string | null;
  createdBy?: string | null;
  createdDate?: dayjs.Dayjs | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: dayjs.Dayjs | null;
  jobCard?: IJobCard | null;
}

export type NewJobItemTimeEstimation = Omit<IJobItemTimeEstimation, 'id'> & { id: null };
