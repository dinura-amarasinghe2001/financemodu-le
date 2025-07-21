import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IGRN, NewGRN } from '../grn.model';

export type PartialUpdateGRN = Partial<IGRN> & Pick<IGRN, 'id'>;

type RestOf<T extends IGRN | NewGRN> = Omit<T, 'grnDate' | 'lmd' | 'supplierInvoiceDate'> & {
  grnDate?: string | null;
  lmd?: string | null;
  supplierInvoiceDate?: string | null;
};

export type RestGRN = RestOf<IGRN>;

export type NewRestGRN = RestOf<NewGRN>;

export type PartialUpdateRestGRN = RestOf<PartialUpdateGRN>;

export type EntityResponseType = HttpResponse<IGRN>;
export type EntityArrayResponseType = HttpResponse<IGRN[]>;

@Injectable({ providedIn: 'root' })
export class GRNService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grns', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/grns/_search', 'inventorymicro');

  create(gRN: NewGRN): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRN);
    return this.http.post<RestGRN>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gRN: IGRN): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRN);
    return this.http
      .put<RestGRN>(`${this.resourceUrl}/${this.getGRNIdentifier(gRN)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gRN: PartialUpdateGRN): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRN);
    return this.http
      .patch<RestGRN>(`${this.resourceUrl}/${this.getGRNIdentifier(gRN)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGRN>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGRN[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestGRN[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IGRN[]>()], asapScheduler)),
    );
  }

  getGRNIdentifier(gRN: Pick<IGRN, 'id'>): number {
    return gRN.id;
  }

  compareGRN(o1: Pick<IGRN, 'id'> | null, o2: Pick<IGRN, 'id'> | null): boolean {
    return o1 && o2 ? this.getGRNIdentifier(o1) === this.getGRNIdentifier(o2) : o1 === o2;
  }

  addGRNToCollectionIfMissing<Type extends Pick<IGRN, 'id'>>(gRNCollection: Type[], ...gRNSToCheck: (Type | null | undefined)[]): Type[] {
    const gRNS: Type[] = gRNSToCheck.filter(isPresent);
    if (gRNS.length > 0) {
      const gRNCollectionIdentifiers = gRNCollection.map(gRNItem => this.getGRNIdentifier(gRNItem));
      const gRNSToAdd = gRNS.filter(gRNItem => {
        const gRNIdentifier = this.getGRNIdentifier(gRNItem);
        if (gRNCollectionIdentifiers.includes(gRNIdentifier)) {
          return false;
        }
        gRNCollectionIdentifiers.push(gRNIdentifier);
        return true;
      });
      return [...gRNSToAdd, ...gRNCollection];
    }
    return gRNCollection;
  }

  protected convertDateFromClient<T extends IGRN | NewGRN | PartialUpdateGRN>(gRN: T): RestOf<T> {
    return {
      ...gRN,
      grnDate: gRN.grnDate?.toJSON() ?? null,
      lmd: gRN.lmd?.toJSON() ?? null,
      supplierInvoiceDate: gRN.supplierInvoiceDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGRN: RestGRN): IGRN {
    return {
      ...restGRN,
      grnDate: restGRN.grnDate ? dayjs(restGRN.grnDate) : undefined,
      lmd: restGRN.lmd ? dayjs(restGRN.lmd) : undefined,
      supplierInvoiceDate: restGRN.supplierInvoiceDate ? dayjs(restGRN.supplierInvoiceDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGRN>): HttpResponse<IGRN> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGRN[]>): HttpResponse<IGRN[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
