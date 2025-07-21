import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IInventoryBatches, NewInventoryBatches } from '../inventory-batches.model';

export type PartialUpdateInventoryBatches = Partial<IInventoryBatches> & Pick<IInventoryBatches, 'id'>;

type RestOf<T extends IInventoryBatches | NewInventoryBatches> = Omit<
  T,
  'txDate' | 'lmd' | 'manufactureDate' | 'expireDate' | 'addedDate'
> & {
  txDate?: string | null;
  lmd?: string | null;
  manufactureDate?: string | null;
  expireDate?: string | null;
  addedDate?: string | null;
};

export type RestInventoryBatches = RestOf<IInventoryBatches>;

export type NewRestInventoryBatches = RestOf<NewInventoryBatches>;

export type PartialUpdateRestInventoryBatches = RestOf<PartialUpdateInventoryBatches>;

export type EntityResponseType = HttpResponse<IInventoryBatches>;
export type EntityArrayResponseType = HttpResponse<IInventoryBatches[]>;

@Injectable({ providedIn: 'root' })
export class InventoryBatchesService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/inventory-batches', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/inventory-batches/_search', 'inventorymicro');

  create(inventoryBatches: NewInventoryBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inventoryBatches);
    return this.http
      .post<RestInventoryBatches>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(inventoryBatches: IInventoryBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inventoryBatches);
    return this.http
      .put<RestInventoryBatches>(`${this.resourceUrl}/${this.getInventoryBatchesIdentifier(inventoryBatches)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(inventoryBatches: PartialUpdateInventoryBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(inventoryBatches);
    return this.http
      .patch<RestInventoryBatches>(`${this.resourceUrl}/${this.getInventoryBatchesIdentifier(inventoryBatches)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInventoryBatches>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInventoryBatches[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestInventoryBatches[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IInventoryBatches[]>()], asapScheduler)),
    );
  }

  getInventoryBatchesIdentifier(inventoryBatches: Pick<IInventoryBatches, 'id'>): number {
    return inventoryBatches.id;
  }

  compareInventoryBatches(o1: Pick<IInventoryBatches, 'id'> | null, o2: Pick<IInventoryBatches, 'id'> | null): boolean {
    return o1 && o2 ? this.getInventoryBatchesIdentifier(o1) === this.getInventoryBatchesIdentifier(o2) : o1 === o2;
  }

  addInventoryBatchesToCollectionIfMissing<Type extends Pick<IInventoryBatches, 'id'>>(
    inventoryBatchesCollection: Type[],
    ...inventoryBatchesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const inventoryBatches: Type[] = inventoryBatchesToCheck.filter(isPresent);
    if (inventoryBatches.length > 0) {
      const inventoryBatchesCollectionIdentifiers = inventoryBatchesCollection.map(inventoryBatchesItem =>
        this.getInventoryBatchesIdentifier(inventoryBatchesItem),
      );
      const inventoryBatchesToAdd = inventoryBatches.filter(inventoryBatchesItem => {
        const inventoryBatchesIdentifier = this.getInventoryBatchesIdentifier(inventoryBatchesItem);
        if (inventoryBatchesCollectionIdentifiers.includes(inventoryBatchesIdentifier)) {
          return false;
        }
        inventoryBatchesCollectionIdentifiers.push(inventoryBatchesIdentifier);
        return true;
      });
      return [...inventoryBatchesToAdd, ...inventoryBatchesCollection];
    }
    return inventoryBatchesCollection;
  }

  protected convertDateFromClient<T extends IInventoryBatches | NewInventoryBatches | PartialUpdateInventoryBatches>(
    inventoryBatches: T,
  ): RestOf<T> {
    return {
      ...inventoryBatches,
      txDate: inventoryBatches.txDate?.toJSON() ?? null,
      lmd: inventoryBatches.lmd?.toJSON() ?? null,
      manufactureDate: inventoryBatches.manufactureDate?.toJSON() ?? null,
      expireDate: inventoryBatches.expireDate?.toJSON() ?? null,
      addedDate: inventoryBatches.addedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInventoryBatches: RestInventoryBatches): IInventoryBatches {
    return {
      ...restInventoryBatches,
      txDate: restInventoryBatches.txDate ? dayjs(restInventoryBatches.txDate) : undefined,
      lmd: restInventoryBatches.lmd ? dayjs(restInventoryBatches.lmd) : undefined,
      manufactureDate: restInventoryBatches.manufactureDate ? dayjs(restInventoryBatches.manufactureDate) : undefined,
      expireDate: restInventoryBatches.expireDate ? dayjs(restInventoryBatches.expireDate) : undefined,
      addedDate: restInventoryBatches.addedDate ? dayjs(restInventoryBatches.addedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInventoryBatches>): HttpResponse<IInventoryBatches> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInventoryBatches[]>): HttpResponse<IInventoryBatches[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
