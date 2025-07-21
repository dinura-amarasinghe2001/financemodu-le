import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IJobEstimate, NewJobEstimate } from '../job-estimate.model';

export type PartialUpdateJobEstimate = Partial<IJobEstimate> & Pick<IJobEstimate, 'id'>;

type RestOf<T extends IJobEstimate | NewJobEstimate> = Omit<
  T,
  'startDate' | 'endDate' | 'estStartDate' | 'estEndDate' | 'createdDate' | 'lastModifiedDate'
> & {
  startDate?: string | null;
  endDate?: string | null;
  estStartDate?: string | null;
  estEndDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestJobEstimate = RestOf<IJobEstimate>;

export type NewRestJobEstimate = RestOf<NewJobEstimate>;

export type PartialUpdateRestJobEstimate = RestOf<PartialUpdateJobEstimate>;

export type EntityResponseType = HttpResponse<IJobEstimate>;
export type EntityArrayResponseType = HttpResponse<IJobEstimate[]>;

@Injectable({ providedIn: 'root' })
export class JobEstimateService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-estimates', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/job-estimates/_search', 'operationsmodule');

  create(jobEstimate: NewJobEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobEstimate);
    return this.http
      .post<RestJobEstimate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(jobEstimate: IJobEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobEstimate);
    return this.http
      .put<RestJobEstimate>(`${this.resourceUrl}/${this.getJobEstimateIdentifier(jobEstimate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(jobEstimate: PartialUpdateJobEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobEstimate);
    return this.http
      .patch<RestJobEstimate>(`${this.resourceUrl}/${this.getJobEstimateIdentifier(jobEstimate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJobEstimate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJobEstimate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestJobEstimate[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IJobEstimate[]>()], asapScheduler)),
    );
  }

  getJobEstimateIdentifier(jobEstimate: Pick<IJobEstimate, 'id'>): number {
    return jobEstimate.id;
  }

  compareJobEstimate(o1: Pick<IJobEstimate, 'id'> | null, o2: Pick<IJobEstimate, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobEstimateIdentifier(o1) === this.getJobEstimateIdentifier(o2) : o1 === o2;
  }

  addJobEstimateToCollectionIfMissing<Type extends Pick<IJobEstimate, 'id'>>(
    jobEstimateCollection: Type[],
    ...jobEstimatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobEstimates: Type[] = jobEstimatesToCheck.filter(isPresent);
    if (jobEstimates.length > 0) {
      const jobEstimateCollectionIdentifiers = jobEstimateCollection.map(jobEstimateItem => this.getJobEstimateIdentifier(jobEstimateItem));
      const jobEstimatesToAdd = jobEstimates.filter(jobEstimateItem => {
        const jobEstimateIdentifier = this.getJobEstimateIdentifier(jobEstimateItem);
        if (jobEstimateCollectionIdentifiers.includes(jobEstimateIdentifier)) {
          return false;
        }
        jobEstimateCollectionIdentifiers.push(jobEstimateIdentifier);
        return true;
      });
      return [...jobEstimatesToAdd, ...jobEstimateCollection];
    }
    return jobEstimateCollection;
  }

  protected convertDateFromClient<T extends IJobEstimate | NewJobEstimate | PartialUpdateJobEstimate>(jobEstimate: T): RestOf<T> {
    return {
      ...jobEstimate,
      startDate: jobEstimate.startDate?.toJSON() ?? null,
      endDate: jobEstimate.endDate?.toJSON() ?? null,
      estStartDate: jobEstimate.estStartDate?.toJSON() ?? null,
      estEndDate: jobEstimate.estEndDate?.toJSON() ?? null,
      createdDate: jobEstimate.createdDate?.toJSON() ?? null,
      lastModifiedDate: jobEstimate.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restJobEstimate: RestJobEstimate): IJobEstimate {
    return {
      ...restJobEstimate,
      startDate: restJobEstimate.startDate ? dayjs(restJobEstimate.startDate) : undefined,
      endDate: restJobEstimate.endDate ? dayjs(restJobEstimate.endDate) : undefined,
      estStartDate: restJobEstimate.estStartDate ? dayjs(restJobEstimate.estStartDate) : undefined,
      estEndDate: restJobEstimate.estEndDate ? dayjs(restJobEstimate.estEndDate) : undefined,
      createdDate: restJobEstimate.createdDate ? dayjs(restJobEstimate.createdDate) : undefined,
      lastModifiedDate: restJobEstimate.lastModifiedDate ? dayjs(restJobEstimate.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestJobEstimate>): HttpResponse<IJobEstimate> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestJobEstimate[]>): HttpResponse<IJobEstimate[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
