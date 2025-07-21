import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ISupplierBank, NewSupplierBank } from '../supplier-bank.model';

export type PartialUpdateSupplierBank = Partial<ISupplierBank> & Pick<ISupplierBank, 'id'>;

type RestOf<T extends ISupplierBank | NewSupplierBank> = Omit<T, 'lmd'> & {
  lmd?: string | null;
};

export type RestSupplierBank = RestOf<ISupplierBank>;

export type NewRestSupplierBank = RestOf<NewSupplierBank>;

export type PartialUpdateRestSupplierBank = RestOf<PartialUpdateSupplierBank>;

export type EntityResponseType = HttpResponse<ISupplierBank>;
export type EntityArrayResponseType = HttpResponse<ISupplierBank[]>;

@Injectable({ providedIn: 'root' })
export class SupplierBankService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/supplier-banks', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/supplier-banks/_search', 'inventorymicro');

  create(supplierBank: NewSupplierBank): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(supplierBank);
    return this.http
      .post<RestSupplierBank>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(supplierBank: ISupplierBank): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(supplierBank);
    return this.http
      .put<RestSupplierBank>(`${this.resourceUrl}/${this.getSupplierBankIdentifier(supplierBank)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(supplierBank: PartialUpdateSupplierBank): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(supplierBank);
    return this.http
      .patch<RestSupplierBank>(`${this.resourceUrl}/${this.getSupplierBankIdentifier(supplierBank)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestSupplierBank>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestSupplierBank[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestSupplierBank[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<ISupplierBank[]>()], asapScheduler)),
    );
  }

  getSupplierBankIdentifier(supplierBank: Pick<ISupplierBank, 'id'>): number {
    return supplierBank.id;
  }

  compareSupplierBank(o1: Pick<ISupplierBank, 'id'> | null, o2: Pick<ISupplierBank, 'id'> | null): boolean {
    return o1 && o2 ? this.getSupplierBankIdentifier(o1) === this.getSupplierBankIdentifier(o2) : o1 === o2;
  }

  addSupplierBankToCollectionIfMissing<Type extends Pick<ISupplierBank, 'id'>>(
    supplierBankCollection: Type[],
    ...supplierBanksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const supplierBanks: Type[] = supplierBanksToCheck.filter(isPresent);
    if (supplierBanks.length > 0) {
      const supplierBankCollectionIdentifiers = supplierBankCollection.map(supplierBankItem =>
        this.getSupplierBankIdentifier(supplierBankItem),
      );
      const supplierBanksToAdd = supplierBanks.filter(supplierBankItem => {
        const supplierBankIdentifier = this.getSupplierBankIdentifier(supplierBankItem);
        if (supplierBankCollectionIdentifiers.includes(supplierBankIdentifier)) {
          return false;
        }
        supplierBankCollectionIdentifiers.push(supplierBankIdentifier);
        return true;
      });
      return [...supplierBanksToAdd, ...supplierBankCollection];
    }
    return supplierBankCollection;
  }

  protected convertDateFromClient<T extends ISupplierBank | NewSupplierBank | PartialUpdateSupplierBank>(supplierBank: T): RestOf<T> {
    return {
      ...supplierBank,
      lmd: supplierBank.lmd?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restSupplierBank: RestSupplierBank): ISupplierBank {
    return {
      ...restSupplierBank,
      lmd: restSupplierBank.lmd ? dayjs(restSupplierBank.lmd) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestSupplierBank>): HttpResponse<ISupplierBank> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestSupplierBank[]>): HttpResponse<ISupplierBank[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
