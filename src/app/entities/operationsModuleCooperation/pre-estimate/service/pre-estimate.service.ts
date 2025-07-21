import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPreEstimate, NewPreEstimate } from '../pre-estimate.model';

export type PartialUpdatePreEstimate = Partial<IPreEstimate> & Pick<IPreEstimate, 'id'>;

type RestOf<T extends IPreEstimate | NewPreEstimate> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPreEstimate = RestOf<IPreEstimate>;

export type NewRestPreEstimate = RestOf<NewPreEstimate>;

export type PartialUpdateRestPreEstimate = RestOf<PartialUpdatePreEstimate>;

export type EntityResponseType = HttpResponse<IPreEstimate>;
export type EntityArrayResponseType = HttpResponse<IPreEstimate[]>;

@Injectable({ providedIn: 'root' })
export class PreEstimateService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pre-estimates', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/pre-estimates/_search', 'operationsmodule');

  create(preEstimate: NewPreEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(preEstimate);
    return this.http
      .post<RestPreEstimate>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(preEstimate: IPreEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(preEstimate);
    return this.http
      .put<RestPreEstimate>(`${this.resourceUrl}/${this.getPreEstimateIdentifier(preEstimate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(preEstimate: PartialUpdatePreEstimate): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(preEstimate);
    return this.http
      .patch<RestPreEstimate>(`${this.resourceUrl}/${this.getPreEstimateIdentifier(preEstimate)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPreEstimate>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPreEstimate[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestPreEstimate[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IPreEstimate[]>()], asapScheduler)),
    );
  }

  getPreEstimateIdentifier(preEstimate: Pick<IPreEstimate, 'id'>): number {
    return preEstimate.id;
  }

  comparePreEstimate(o1: Pick<IPreEstimate, 'id'> | null, o2: Pick<IPreEstimate, 'id'> | null): boolean {
    return o1 && o2 ? this.getPreEstimateIdentifier(o1) === this.getPreEstimateIdentifier(o2) : o1 === o2;
  }

  addPreEstimateToCollectionIfMissing<Type extends Pick<IPreEstimate, 'id'>>(
    preEstimateCollection: Type[],
    ...preEstimatesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const preEstimates: Type[] = preEstimatesToCheck.filter(isPresent);
    if (preEstimates.length > 0) {
      const preEstimateCollectionIdentifiers = preEstimateCollection.map(preEstimateItem => this.getPreEstimateIdentifier(preEstimateItem));
      const preEstimatesToAdd = preEstimates.filter(preEstimateItem => {
        const preEstimateIdentifier = this.getPreEstimateIdentifier(preEstimateItem);
        if (preEstimateCollectionIdentifiers.includes(preEstimateIdentifier)) {
          return false;
        }
        preEstimateCollectionIdentifiers.push(preEstimateIdentifier);
        return true;
      });
      return [...preEstimatesToAdd, ...preEstimateCollection];
    }
    return preEstimateCollection;
  }

  protected convertDateFromClient<T extends IPreEstimate | NewPreEstimate | PartialUpdatePreEstimate>(preEstimate: T): RestOf<T> {
    return {
      ...preEstimate,
      createdDate: preEstimate.createdDate?.toJSON() ?? null,
      lastModifiedDate: preEstimate.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPreEstimate: RestPreEstimate): IPreEstimate {
    return {
      ...restPreEstimate,
      createdDate: restPreEstimate.createdDate ? dayjs(restPreEstimate.createdDate) : undefined,
      lastModifiedDate: restPreEstimate.lastModifiedDate ? dayjs(restPreEstimate.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPreEstimate>): HttpResponse<IPreEstimate> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPreEstimate[]>): HttpResponse<IPreEstimate[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
