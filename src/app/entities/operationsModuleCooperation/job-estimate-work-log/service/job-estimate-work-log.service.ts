import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IJobEstimateWorkLog, NewJobEstimateWorkLog } from '../job-estimate-work-log.model';

export type PartialUpdateJobEstimateWorkLog = Partial<IJobEstimateWorkLog> & Pick<IJobEstimateWorkLog, 'id'>;

type RestOf<T extends IJobEstimateWorkLog | NewJobEstimateWorkLog> = Omit<T, 'workDate' | 'createdDate' | 'lastModifiedDate'> & {
  workDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestJobEstimateWorkLog = RestOf<IJobEstimateWorkLog>;

export type NewRestJobEstimateWorkLog = RestOf<NewJobEstimateWorkLog>;

export type PartialUpdateRestJobEstimateWorkLog = RestOf<PartialUpdateJobEstimateWorkLog>;

export type EntityResponseType = HttpResponse<IJobEstimateWorkLog>;
export type EntityArrayResponseType = HttpResponse<IJobEstimateWorkLog[]>;

@Injectable({ providedIn: 'root' })
export class JobEstimateWorkLogService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-estimate-work-logs', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/job-estimate-work-logs/_search', 'operationsmodule');

  create(jobEstimateWorkLog: NewJobEstimateWorkLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobEstimateWorkLog);
    return this.http
      .post<RestJobEstimateWorkLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(jobEstimateWorkLog: IJobEstimateWorkLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobEstimateWorkLog);
    return this.http
      .put<RestJobEstimateWorkLog>(`${this.resourceUrl}/${this.getJobEstimateWorkLogIdentifier(jobEstimateWorkLog)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(jobEstimateWorkLog: PartialUpdateJobEstimateWorkLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobEstimateWorkLog);
    return this.http
      .patch<RestJobEstimateWorkLog>(`${this.resourceUrl}/${this.getJobEstimateWorkLogIdentifier(jobEstimateWorkLog)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJobEstimateWorkLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJobEstimateWorkLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestJobEstimateWorkLog[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IJobEstimateWorkLog[]>()], asapScheduler)),
    );
  }

  getJobEstimateWorkLogIdentifier(jobEstimateWorkLog: Pick<IJobEstimateWorkLog, 'id'>): number {
    return jobEstimateWorkLog.id;
  }

  compareJobEstimateWorkLog(o1: Pick<IJobEstimateWorkLog, 'id'> | null, o2: Pick<IJobEstimateWorkLog, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobEstimateWorkLogIdentifier(o1) === this.getJobEstimateWorkLogIdentifier(o2) : o1 === o2;
  }

  addJobEstimateWorkLogToCollectionIfMissing<Type extends Pick<IJobEstimateWorkLog, 'id'>>(
    jobEstimateWorkLogCollection: Type[],
    ...jobEstimateWorkLogsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobEstimateWorkLogs: Type[] = jobEstimateWorkLogsToCheck.filter(isPresent);
    if (jobEstimateWorkLogs.length > 0) {
      const jobEstimateWorkLogCollectionIdentifiers = jobEstimateWorkLogCollection.map(jobEstimateWorkLogItem =>
        this.getJobEstimateWorkLogIdentifier(jobEstimateWorkLogItem),
      );
      const jobEstimateWorkLogsToAdd = jobEstimateWorkLogs.filter(jobEstimateWorkLogItem => {
        const jobEstimateWorkLogIdentifier = this.getJobEstimateWorkLogIdentifier(jobEstimateWorkLogItem);
        if (jobEstimateWorkLogCollectionIdentifiers.includes(jobEstimateWorkLogIdentifier)) {
          return false;
        }
        jobEstimateWorkLogCollectionIdentifiers.push(jobEstimateWorkLogIdentifier);
        return true;
      });
      return [...jobEstimateWorkLogsToAdd, ...jobEstimateWorkLogCollection];
    }
    return jobEstimateWorkLogCollection;
  }

  protected convertDateFromClient<T extends IJobEstimateWorkLog | NewJobEstimateWorkLog | PartialUpdateJobEstimateWorkLog>(
    jobEstimateWorkLog: T,
  ): RestOf<T> {
    return {
      ...jobEstimateWorkLog,
      workDate: jobEstimateWorkLog.workDate?.toJSON() ?? null,
      createdDate: jobEstimateWorkLog.createdDate?.toJSON() ?? null,
      lastModifiedDate: jobEstimateWorkLog.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restJobEstimateWorkLog: RestJobEstimateWorkLog): IJobEstimateWorkLog {
    return {
      ...restJobEstimateWorkLog,
      workDate: restJobEstimateWorkLog.workDate ? dayjs(restJobEstimateWorkLog.workDate) : undefined,
      createdDate: restJobEstimateWorkLog.createdDate ? dayjs(restJobEstimateWorkLog.createdDate) : undefined,
      lastModifiedDate: restJobEstimateWorkLog.lastModifiedDate ? dayjs(restJobEstimateWorkLog.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestJobEstimateWorkLog>): HttpResponse<IJobEstimateWorkLog> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestJobEstimateWorkLog[]>): HttpResponse<IJobEstimateWorkLog[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
