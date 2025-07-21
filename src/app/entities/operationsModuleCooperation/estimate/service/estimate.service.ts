import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEstimate, NewEstimate } from '../estimate.model';

export type PartialUpdateEstimate = Partial<IEstimate> & Pick<IEstimate, 'id'>;

type RestOf<T extends IEstimate | NewEstimate> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestEstimate = RestOf<IEstimate>;

export type NewRestEstimate = RestOf<NewEstimate>;

export type PartialUpdateRestEstimate = RestOf<PartialUpdateEstimate>;

export type EntityResponseType = HttpResponse<IEstimate>;
export type EntityArrayResponseType = HttpResponse<IEstimate[]>;

@Injectable({ providedIn: 'root' })
export class EstimateService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estimates', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/estimates/_search', 'operationsmodule');

  create(estimate: NewEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimate);
    return this.http
      .post<RestEstimate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(estimate: IEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimate);
    return this.http
      .put<RestEstimate>(`${this.resourceUrl}/${this.getEstimateIdentifier(estimate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(estimate: PartialUpdateEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(estimate);
    return this.http
      .patch<RestEstimate>(`${this.resourceUrl}/${this.getEstimateIdentifier(estimate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEstimate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEstimate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestEstimate[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IEstimate[]>()], asapScheduler)),
    );
  }

  getEstimateIdentifier(estimate: Pick<IEstimate, 'id'>): number {
    return estimate.id;
  }

  compareEstimate(o1: Pick<IEstimate, 'id'> | null, o2: Pick<IEstimate, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstimateIdentifier(o1) === this.getEstimateIdentifier(o2) : o1 === o2;
  }

  addEstimateToCollectionIfMissing<Type extends Pick<IEstimate, 'id'>>(
    estimateCollection: Type[],
    ...estimatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estimates: Type[] = estimatesToCheck.filter(isPresent);
    if (estimates.length > 0) {
      const estimateCollectionIdentifiers = estimateCollection.map(estimateItem => this.getEstimateIdentifier(estimateItem));
      const estimatesToAdd = estimates.filter(estimateItem => {
        const estimateIdentifier = this.getEstimateIdentifier(estimateItem);
        if (estimateCollectionIdentifiers.includes(estimateIdentifier)) {
          return false;
        }
        estimateCollectionIdentifiers.push(estimateIdentifier);
        return true;
      });
      return [...estimatesToAdd, ...estimateCollection];
    }
    return estimateCollection;
  }

  protected convertDateFromClient<T extends IEstimate | NewEstimate | PartialUpdateEstimate>(estimate: T): RestOf<T> {
    return {
      ...estimate,
      createdDate: estimate.createdDate?.toJSON() ?? null,
      lastModifiedDate: estimate.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEstimate: RestEstimate): IEstimate {
    return {
      ...restEstimate,
      createdDate: restEstimate.createdDate ? dayjs(restEstimate.createdDate) : undefined,
      lastModifiedDate: restEstimate.lastModifiedDate ? dayjs(restEstimate.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEstimate>): HttpResponse<IEstimate> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEstimate[]>): HttpResponse<IEstimate[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
