import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ITheGRNLineBatches, NewTheGRNLineBatches } from '../the-grn-line-batches.model';

export type PartialUpdateTheGRNLineBatches = Partial<ITheGRNLineBatches> & Pick<ITheGRNLineBatches, 'id'>;

type RestOf<T extends ITheGRNLineBatches | NewTheGRNLineBatches> = Omit<T, 'txDate' | 'manufactureDate' | 'expiredDate' | 'lmd'> & {
  txDate?: string | null;
  manufactureDate?: string | null;
  expiredDate?: string | null;
  lmd?: string | null;
};

export type RestTheGRNLineBatches = RestOf<ITheGRNLineBatches>;

export type NewRestTheGRNLineBatches = RestOf<NewTheGRNLineBatches>;

export type PartialUpdateRestTheGRNLineBatches = RestOf<PartialUpdateTheGRNLineBatches>;

export type EntityResponseType = HttpResponse<ITheGRNLineBatches>;
export type EntityArrayResponseType = HttpResponse<ITheGRNLineBatches[]>;

@Injectable({ providedIn: 'root' })
export class TheGRNLineBatchesService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/the-grn-line-batches', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/the-grn-line-batches/_search', 'inventorymicro');

  create(theGRNLineBatches: NewTheGRNLineBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(theGRNLineBatches);
    return this.http
      .post<RestTheGRNLineBatches>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(theGRNLineBatches: ITheGRNLineBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(theGRNLineBatches);
    return this.http
      .put<RestTheGRNLineBatches>(`${this.resourceUrl}/${this.getTheGRNLineBatchesIdentifier(theGRNLineBatches)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(theGRNLineBatches: PartialUpdateTheGRNLineBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(theGRNLineBatches);
    return this.http
      .patch<RestTheGRNLineBatches>(`${this.resourceUrl}/${this.getTheGRNLineBatchesIdentifier(theGRNLineBatches)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTheGRNLineBatches>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTheGRNLineBatches[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestTheGRNLineBatches[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<ITheGRNLineBatches[]>()], asapScheduler)),
    );
  }

  getTheGRNLineBatchesIdentifier(theGRNLineBatches: Pick<ITheGRNLineBatches, 'id'>): number {
    return theGRNLineBatches.id;
  }

  compareTheGRNLineBatches(o1: Pick<ITheGRNLineBatches, 'id'> | null, o2: Pick<ITheGRNLineBatches, 'id'> | null): boolean {
    return o1 && o2 ? this.getTheGRNLineBatchesIdentifier(o1) === this.getTheGRNLineBatchesIdentifier(o2) : o1 === o2;
  }

  addTheGRNLineBatchesToCollectionIfMissing<Type extends Pick<ITheGRNLineBatches, 'id'>>(
    theGRNLineBatchesCollection: Type[],
    ...theGRNLineBatchesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const theGRNLineBatches: Type[] = theGRNLineBatchesToCheck.filter(isPresent);
    if (theGRNLineBatches.length > 0) {
      const theGRNLineBatchesCollectionIdentifiers = theGRNLineBatchesCollection.map(theGRNLineBatchesItem =>
        this.getTheGRNLineBatchesIdentifier(theGRNLineBatchesItem),
      );
      const theGRNLineBatchesToAdd = theGRNLineBatches.filter(theGRNLineBatchesItem => {
        const theGRNLineBatchesIdentifier = this.getTheGRNLineBatchesIdentifier(theGRNLineBatchesItem);
        if (theGRNLineBatchesCollectionIdentifiers.includes(theGRNLineBatchesIdentifier)) {
          return false;
        }
        theGRNLineBatchesCollectionIdentifiers.push(theGRNLineBatchesIdentifier);
        return true;
      });
      return [...theGRNLineBatchesToAdd, ...theGRNLineBatchesCollection];
    }
    return theGRNLineBatchesCollection;
  }

  protected convertDateFromClient<T extends ITheGRNLineBatches | NewTheGRNLineBatches | PartialUpdateTheGRNLineBatches>(
    theGRNLineBatches: T,
  ): RestOf<T> {
    return {
      ...theGRNLineBatches,
      txDate: theGRNLineBatches.txDate?.toJSON() ?? null,
      manufactureDate: theGRNLineBatches.manufactureDate?.toJSON() ?? null,
      expiredDate: theGRNLineBatches.expiredDate?.toJSON() ?? null,
      lmd: theGRNLineBatches.lmd?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTheGRNLineBatches: RestTheGRNLineBatches): ITheGRNLineBatches {
    return {
      ...restTheGRNLineBatches,
      txDate: restTheGRNLineBatches.txDate ? dayjs(restTheGRNLineBatches.txDate) : undefined,
      manufactureDate: restTheGRNLineBatches.manufactureDate ? dayjs(restTheGRNLineBatches.manufactureDate) : undefined,
      expiredDate: restTheGRNLineBatches.expiredDate ? dayjs(restTheGRNLineBatches.expiredDate) : undefined,
      lmd: restTheGRNLineBatches.lmd ? dayjs(restTheGRNLineBatches.lmd) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTheGRNLineBatches>): HttpResponse<ITheGRNLineBatches> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTheGRNLineBatches[]>): HttpResponse<ITheGRNLineBatches[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
