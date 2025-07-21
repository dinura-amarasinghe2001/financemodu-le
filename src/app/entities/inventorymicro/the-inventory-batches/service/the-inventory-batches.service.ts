import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ITheInventoryBatches, NewTheInventoryBatches } from '../the-inventory-batches.model';

export type PartialUpdateTheInventoryBatches = Partial<ITheInventoryBatches> & Pick<ITheInventoryBatches, 'id'>;

type RestOf<T extends ITheInventoryBatches | NewTheInventoryBatches> = Omit<
  T,
  'txDate' | 'lmd' | 'manufactureDate' | 'expireDate' | 'addedDate'
> & {
  txDate?: string | null;
  lmd?: string | null;
  manufactureDate?: string | null;
  expireDate?: string | null;
  addedDate?: string | null;
};

export type RestTheInventoryBatches = RestOf<ITheInventoryBatches>;

export type NewRestTheInventoryBatches = RestOf<NewTheInventoryBatches>;

export type PartialUpdateRestTheInventoryBatches = RestOf<PartialUpdateTheInventoryBatches>;

export type EntityResponseType = HttpResponse<ITheInventoryBatches>;
export type EntityArrayResponseType = HttpResponse<ITheInventoryBatches[]>;

@Injectable({ providedIn: 'root' })
export class TheInventoryBatchesService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/the-inventory-batches', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/the-inventory-batches/_search', 'inventorymicro');

  create(theInventoryBatches: NewTheInventoryBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(theInventoryBatches);
    return this.http
      .post<RestTheInventoryBatches>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(theInventoryBatches: ITheInventoryBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(theInventoryBatches);
    return this.http
      .put<RestTheInventoryBatches>(`${this.resourceUrl}/${this.getTheInventoryBatchesIdentifier(theInventoryBatches)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(theInventoryBatches: PartialUpdateTheInventoryBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(theInventoryBatches);
    return this.http
      .patch<RestTheInventoryBatches>(`${this.resourceUrl}/${this.getTheInventoryBatchesIdentifier(theInventoryBatches)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTheInventoryBatches>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTheInventoryBatches[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestTheInventoryBatches[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<ITheInventoryBatches[]>()], asapScheduler)),
    );
  }

  getTheInventoryBatchesIdentifier(theInventoryBatches: Pick<ITheInventoryBatches, 'id'>): number {
    return theInventoryBatches.id;
  }

  compareTheInventoryBatches(o1: Pick<ITheInventoryBatches, 'id'> | null, o2: Pick<ITheInventoryBatches, 'id'> | null): boolean {
    return o1 && o2 ? this.getTheInventoryBatchesIdentifier(o1) === this.getTheInventoryBatchesIdentifier(o2) : o1 === o2;
  }

  addTheInventoryBatchesToCollectionIfMissing<Type extends Pick<ITheInventoryBatches, 'id'>>(
    theInventoryBatchesCollection: Type[],
    ...theInventoryBatchesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const theInventoryBatches: Type[] = theInventoryBatchesToCheck.filter(isPresent);
    if (theInventoryBatches.length > 0) {
      const theInventoryBatchesCollectionIdentifiers = theInventoryBatchesCollection.map(theInventoryBatchesItem =>
        this.getTheInventoryBatchesIdentifier(theInventoryBatchesItem),
      );
      const theInventoryBatchesToAdd = theInventoryBatches.filter(theInventoryBatchesItem => {
        const theInventoryBatchesIdentifier = this.getTheInventoryBatchesIdentifier(theInventoryBatchesItem);
        if (theInventoryBatchesCollectionIdentifiers.includes(theInventoryBatchesIdentifier)) {
          return false;
        }
        theInventoryBatchesCollectionIdentifiers.push(theInventoryBatchesIdentifier);
        return true;
      });
      return [...theInventoryBatchesToAdd, ...theInventoryBatchesCollection];
    }
    return theInventoryBatchesCollection;
  }

  protected convertDateFromClient<T extends ITheInventoryBatches | NewTheInventoryBatches | PartialUpdateTheInventoryBatches>(
    theInventoryBatches: T,
  ): RestOf<T> {
    return {
      ...theInventoryBatches,
      txDate: theInventoryBatches.txDate?.toJSON() ?? null,
      lmd: theInventoryBatches.lmd?.toJSON() ?? null,
      manufactureDate: theInventoryBatches.manufactureDate?.toJSON() ?? null,
      expireDate: theInventoryBatches.expireDate?.toJSON() ?? null,
      addedDate: theInventoryBatches.addedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTheInventoryBatches: RestTheInventoryBatches): ITheInventoryBatches {
    return {
      ...restTheInventoryBatches,
      txDate: restTheInventoryBatches.txDate ? dayjs(restTheInventoryBatches.txDate) : undefined,
      lmd: restTheInventoryBatches.lmd ? dayjs(restTheInventoryBatches.lmd) : undefined,
      manufactureDate: restTheInventoryBatches.manufactureDate ? dayjs(restTheInventoryBatches.manufactureDate) : undefined,
      expireDate: restTheInventoryBatches.expireDate ? dayjs(restTheInventoryBatches.expireDate) : undefined,
      addedDate: restTheInventoryBatches.addedDate ? dayjs(restTheInventoryBatches.addedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTheInventoryBatches>): HttpResponse<ITheInventoryBatches> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTheInventoryBatches[]>): HttpResponse<ITheInventoryBatches[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
