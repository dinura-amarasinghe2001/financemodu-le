import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IJobItemTimeEstimation, NewJobItemTimeEstimation } from '../job-item-time-estimation.model';

export type PartialUpdateJobItemTimeEstimation = Partial<IJobItemTimeEstimation> & Pick<IJobItemTimeEstimation, 'id'>;

type RestOf<T extends IJobItemTimeEstimation | NewJobItemTimeEstimation> = Omit<
  T,
  'startDateTime' | 'endDateTime' | 'createdDate' | 'lastModifiedDate'
> & {
  startDateTime?: string | null;
  endDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestJobItemTimeEstimation = RestOf<IJobItemTimeEstimation>;

export type NewRestJobItemTimeEstimation = RestOf<NewJobItemTimeEstimation>;

export type PartialUpdateRestJobItemTimeEstimation = RestOf<PartialUpdateJobItemTimeEstimation>;

export type EntityResponseType = HttpResponse<IJobItemTimeEstimation>;
export type EntityArrayResponseType = HttpResponse<IJobItemTimeEstimation[]>;

@Injectable({ providedIn: 'root' })
export class JobItemTimeEstimationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-item-time-estimations', 'operationsmodulecooperation');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor(
    'api/job-item-time-estimations/_search',
    'operationsmodulecooperation',
  );

  create(jobItemTimeEstimation: NewJobItemTimeEstimation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobItemTimeEstimation);
    return this.http
      .post<RestJobItemTimeEstimation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(jobItemTimeEstimation: IJobItemTimeEstimation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobItemTimeEstimation);
    return this.http
      .put<RestJobItemTimeEstimation>(`${this.resourceUrl}/${this.getJobItemTimeEstimationIdentifier(jobItemTimeEstimation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(jobItemTimeEstimation: PartialUpdateJobItemTimeEstimation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(jobItemTimeEstimation);
    return this.http
      .patch<RestJobItemTimeEstimation>(`${this.resourceUrl}/${this.getJobItemTimeEstimationIdentifier(jobItemTimeEstimation)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJobItemTimeEstimation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJobItemTimeEstimation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestJobItemTimeEstimation[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IJobItemTimeEstimation[]>()], asapScheduler)),
    );
  }

  getJobItemTimeEstimationIdentifier(jobItemTimeEstimation: Pick<IJobItemTimeEstimation, 'id'>): number {
    return jobItemTimeEstimation.id;
  }

  compareJobItemTimeEstimation(o1: Pick<IJobItemTimeEstimation, 'id'> | null, o2: Pick<IJobItemTimeEstimation, 'id'> | null): boolean {
    return o1 && o2 ? this.getJobItemTimeEstimationIdentifier(o1) === this.getJobItemTimeEstimationIdentifier(o2) : o1 === o2;
  }

  addJobItemTimeEstimationToCollectionIfMissing<Type extends Pick<IJobItemTimeEstimation, 'id'>>(
    jobItemTimeEstimationCollection: Type[],
    ...jobItemTimeEstimationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobItemTimeEstimations: Type[] = jobItemTimeEstimationsToCheck.filter(isPresent);
    if (jobItemTimeEstimations.length > 0) {
      const jobItemTimeEstimationCollectionIdentifiers = jobItemTimeEstimationCollection.map(jobItemTimeEstimationItem =>
        this.getJobItemTimeEstimationIdentifier(jobItemTimeEstimationItem),
      );
      const jobItemTimeEstimationsToAdd = jobItemTimeEstimations.filter(jobItemTimeEstimationItem => {
        const jobItemTimeEstimationIdentifier = this.getJobItemTimeEstimationIdentifier(jobItemTimeEstimationItem);
        if (jobItemTimeEstimationCollectionIdentifiers.includes(jobItemTimeEstimationIdentifier)) {
          return false;
        }
        jobItemTimeEstimationCollectionIdentifiers.push(jobItemTimeEstimationIdentifier);
        return true;
      });
      return [...jobItemTimeEstimationsToAdd, ...jobItemTimeEstimationCollection];
    }
    return jobItemTimeEstimationCollection;
  }

  protected convertDateFromClient<T extends IJobItemTimeEstimation | NewJobItemTimeEstimation | PartialUpdateJobItemTimeEstimation>(
    jobItemTimeEstimation: T,
  ): RestOf<T> {
    return {
      ...jobItemTimeEstimation,
      startDateTime: jobItemTimeEstimation.startDateTime?.toJSON() ?? null,
      endDateTime: jobItemTimeEstimation.endDateTime?.toJSON() ?? null,
      createdDate: jobItemTimeEstimation.createdDate?.toJSON() ?? null,
      lastModifiedDate: jobItemTimeEstimation.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restJobItemTimeEstimation: RestJobItemTimeEstimation): IJobItemTimeEstimation {
    return {
      ...restJobItemTimeEstimation,
      startDateTime: restJobItemTimeEstimation.startDateTime ? dayjs(restJobItemTimeEstimation.startDateTime) : undefined,
      endDateTime: restJobItemTimeEstimation.endDateTime ? dayjs(restJobItemTimeEstimation.endDateTime) : undefined,
      createdDate: restJobItemTimeEstimation.createdDate ? dayjs(restJobItemTimeEstimation.createdDate) : undefined,
      lastModifiedDate: restJobItemTimeEstimation.lastModifiedDate ? dayjs(restJobItemTimeEstimation.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestJobItemTimeEstimation>): HttpResponse<IJobItemTimeEstimation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestJobItemTimeEstimation[]>): HttpResponse<IJobItemTimeEstimation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
