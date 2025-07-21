import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IGRNLineBatches, NewGRNLineBatches } from '../grn-line-batches.model';

export type PartialUpdateGRNLineBatches = Partial<IGRNLineBatches> & Pick<IGRNLineBatches, 'id'>;

type RestOf<T extends IGRNLineBatches | NewGRNLineBatches> = Omit<T, 'txDate' | 'manufactureDate' | 'expiredDate' | 'lmd'> & {
  txDate?: string | null;
  manufactureDate?: string | null;
  expiredDate?: string | null;
  lmd?: string | null;
};

export type RestGRNLineBatches = RestOf<IGRNLineBatches>;

export type NewRestGRNLineBatches = RestOf<NewGRNLineBatches>;

export type PartialUpdateRestGRNLineBatches = RestOf<PartialUpdateGRNLineBatches>;

export type EntityResponseType = HttpResponse<IGRNLineBatches>;
export type EntityArrayResponseType = HttpResponse<IGRNLineBatches[]>;

@Injectable({ providedIn: 'root' })
export class GRNLineBatchesService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grn-line-batches', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/grn-line-batches/_search', 'inventorymicro');

  create(gRNLineBatches: any): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRNLineBatches);
    return this.http
      .post<RestGRNLineBatches>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gRNLineBatches: IGRNLineBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRNLineBatches);
    return this.http
      .put<RestGRNLineBatches>(`${this.resourceUrl}/${this.getGRNLineBatchesIdentifier(gRNLineBatches)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gRNLineBatches: PartialUpdateGRNLineBatches): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRNLineBatches);
    return this.http
      .patch<RestGRNLineBatches>(`${this.resourceUrl}/${this.getGRNLineBatchesIdentifier(gRNLineBatches)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGRNLineBatches>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGRNLineBatches[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestGRNLineBatches[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IGRNLineBatches[]>()], asapScheduler)),
    );
  }

  getGRNLineBatchesIdentifier(gRNLineBatches: Pick<IGRNLineBatches, 'id'>): number {
    return gRNLineBatches.id;
  }

  compareGRNLineBatches(o1: Pick<IGRNLineBatches, 'id'> | null, o2: Pick<IGRNLineBatches, 'id'> | null): boolean {
    return o1 && o2 ? this.getGRNLineBatchesIdentifier(o1) === this.getGRNLineBatchesIdentifier(o2) : o1 === o2;
  }

  addGRNLineBatchesToCollectionIfMissing<Type extends Pick<IGRNLineBatches, 'id'>>(
    gRNLineBatchesCollection: Type[],
    ...gRNLineBatchesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gRNLineBatches: Type[] = gRNLineBatchesToCheck.filter(isPresent);
    if (gRNLineBatches.length > 0) {
      const gRNLineBatchesCollectionIdentifiers = gRNLineBatchesCollection.map(gRNLineBatchesItem =>
        this.getGRNLineBatchesIdentifier(gRNLineBatchesItem),
      );
      const gRNLineBatchesToAdd = gRNLineBatches.filter(gRNLineBatchesItem => {
        const gRNLineBatchesIdentifier = this.getGRNLineBatchesIdentifier(gRNLineBatchesItem);
        if (gRNLineBatchesCollectionIdentifiers.includes(gRNLineBatchesIdentifier)) {
          return false;
        }
        gRNLineBatchesCollectionIdentifiers.push(gRNLineBatchesIdentifier);
        return true;
      });
      return [...gRNLineBatchesToAdd, ...gRNLineBatchesCollection];
    }
    return gRNLineBatchesCollection;
  }

  protected convertDateFromClient<T extends IGRNLineBatches | NewGRNLineBatches | PartialUpdateGRNLineBatches>(
    gRNLineBatches: T,
  ): RestOf<T> {
    return {
      ...gRNLineBatches,
      txDate: gRNLineBatches.txDate?.toJSON() ?? null,
      manufactureDate: gRNLineBatches.manufactureDate?.toJSON() ?? null,
      expiredDate: gRNLineBatches.expiredDate?.toJSON() ?? null,
      lmd: gRNLineBatches.lmd?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGRNLineBatches: RestGRNLineBatches): IGRNLineBatches {
    return {
      ...restGRNLineBatches,
      txDate: restGRNLineBatches.txDate ? dayjs(restGRNLineBatches.txDate) : undefined,
      manufactureDate: restGRNLineBatches.manufactureDate ? dayjs(restGRNLineBatches.manufactureDate) : undefined,
      expiredDate: restGRNLineBatches.expiredDate ? dayjs(restGRNLineBatches.expiredDate) : undefined,
      lmd: restGRNLineBatches.lmd ? dayjs(restGRNLineBatches.lmd) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGRNLineBatches>): HttpResponse<IGRNLineBatches> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGRNLineBatches[]>): HttpResponse<IGRNLineBatches[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
