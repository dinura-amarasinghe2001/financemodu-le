import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEstimateTreatment, NewEstimateTreatment } from '../estimate-treatment.model';

export type PartialUpdateEstimateTreatment = Partial<IEstimateTreatment> & Pick<IEstimateTreatment, 'id'>;

type RestOf<T extends IEstimateTreatment | NewEstimateTreatment> = Omit<T, 'approvedDate' | 'createdDate' | 'lastModifiedDate'> & {
  approvedDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestEstimateTreatment = RestOf<IEstimateTreatment>;

export type NewRestEstimateTreatment = RestOf<NewEstimateTreatment>;

export type PartialUpdateRestEstimateTreatment = RestOf<PartialUpdateEstimateTreatment>;

export type EntityResponseType = HttpResponse<IEstimateTreatment>;
export type EntityArrayResponseType = HttpResponse<IEstimateTreatment[]>;

@Injectable({ providedIn: 'root' })
export class EstimateTreatmentService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estimate-treatments', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/estimate-treatments/_search', 'operationsmodule');

  create(estimateTreatment: NewEstimateTreatment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimateTreatment);
    return this.http
      .post<RestEstimateTreatment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(estimateTreatment: IEstimateTreatment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimateTreatment);
    return this.http
      .put<RestEstimateTreatment>(`${this.resourceUrl}/${this.getEstimateTreatmentIdentifier(estimateTreatment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(estimateTreatment: PartialUpdateEstimateTreatment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimateTreatment);
    return this.http
      .patch<RestEstimateTreatment>(`${this.resourceUrl}/${this.getEstimateTreatmentIdentifier(estimateTreatment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEstimateTreatment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEstimateTreatment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestEstimateTreatment[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IEstimateTreatment[]>()], asapScheduler)),
    );
  }

  getEstimateTreatmentIdentifier(estimateTreatment: Pick<IEstimateTreatment, 'id'>): number {
    return estimateTreatment.id;
  }

  compareEstimateTreatment(o1: Pick<IEstimateTreatment, 'id'> | null, o2: Pick<IEstimateTreatment, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstimateTreatmentIdentifier(o1) === this.getEstimateTreatmentIdentifier(o2) : o1 === o2;
  }

  addEstimateTreatmentToCollectionIfMissing<Type extends Pick<IEstimateTreatment, 'id'>>(
    estimateTreatmentCollection: Type[],
    ...estimateTreatmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estimateTreatments: Type[] = estimateTreatmentsToCheck.filter(isPresent);
    if (estimateTreatments.length > 0) {
      const estimateTreatmentCollectionIdentifiers = estimateTreatmentCollection.map(estimateTreatmentItem =>
        this.getEstimateTreatmentIdentifier(estimateTreatmentItem),
      );
      const estimateTreatmentsToAdd = estimateTreatments.filter(estimateTreatmentItem => {
        const estimateTreatmentIdentifier = this.getEstimateTreatmentIdentifier(estimateTreatmentItem);
        if (estimateTreatmentCollectionIdentifiers.includes(estimateTreatmentIdentifier)) {
          return false;
        }
        estimateTreatmentCollectionIdentifiers.push(estimateTreatmentIdentifier);
        return true;
      });
      return [...estimateTreatmentsToAdd, ...estimateTreatmentCollection];
    }
    return estimateTreatmentCollection;
  }

  protected convertDateFromClient<T extends IEstimateTreatment | NewEstimateTreatment | PartialUpdateEstimateTreatment>(
    estimateTreatment: T,
  ): RestOf<T> {
    return {
      ...estimateTreatment,
      approvedDate: estimateTreatment.approvedDate?.format(DATE_FORMAT) ?? null,
      createdDate: estimateTreatment.createdDate?.toJSON() ?? null,
      lastModifiedDate: estimateTreatment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEstimateTreatment: RestEstimateTreatment): IEstimateTreatment {
    return {
      ...restEstimateTreatment,
      approvedDate: restEstimateTreatment.approvedDate ? dayjs(restEstimateTreatment.approvedDate) : undefined,
      createdDate: restEstimateTreatment.createdDate ? dayjs(restEstimateTreatment.createdDate) : undefined,
      lastModifiedDate: restEstimateTreatment.lastModifiedDate ? dayjs(restEstimateTreatment.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEstimateTreatment>): HttpResponse<IEstimateTreatment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEstimateTreatment[]>): HttpResponse<IEstimateTreatment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
