import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ISupplierBankAccounts, NewSupplierBankAccounts } from '../supplier-bank-accounts.model';

export type PartialUpdateSupplierBankAccounts = Partial<ISupplierBankAccounts> & Pick<ISupplierBankAccounts, 'id'>;

export type EntityResponseType = HttpResponse<ISupplierBankAccounts>;
export type EntityArrayResponseType = HttpResponse<ISupplierBankAccounts[]>;

@Injectable({ providedIn: 'root' })
export class SupplierBankAccountsService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/supplier-bank-accounts', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/supplier-bank-accounts/_search', 'inventorymicro');

  create(supplierBankAccounts: NewSupplierBankAccounts): Observable<EntityResponseType> {
    return this.http.post<ISupplierBankAccounts>(this.resourceUrl, supplierBankAccounts, { observe: 'response' });
  }

  update(supplierBankAccounts: ISupplierBankAccounts): Observable<EntityResponseType> {
    return this.http.put<ISupplierBankAccounts>(
      `${this.resourceUrl}/${this.getSupplierBankAccountsIdentifier(supplierBankAccounts)}`,
      supplierBankAccounts,
      { observe: 'response' },
    );
  }

  partialUpdate(supplierBankAccounts: PartialUpdateSupplierBankAccounts): Observable<EntityResponseType> {
    return this.http.patch<ISupplierBankAccounts>(
      `${this.resourceUrl}/${this.getSupplierBankAccountsIdentifier(supplierBankAccounts)}`,
      supplierBankAccounts,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISupplierBankAccounts>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISupplierBankAccounts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISupplierBankAccounts[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(catchError(() => scheduled([new HttpResponse<ISupplierBankAccounts[]>()], asapScheduler)));
  }

  getSupplierBankAccountsIdentifier(supplierBankAccounts: Pick<ISupplierBankAccounts, 'id'>): number {
    return supplierBankAccounts.id;
  }

  compareSupplierBankAccounts(o1: Pick<ISupplierBankAccounts, 'id'> | null, o2: Pick<ISupplierBankAccounts, 'id'> | null): boolean {
    return o1 && o2 ? this.getSupplierBankAccountsIdentifier(o1) === this.getSupplierBankAccountsIdentifier(o2) : o1 === o2;
  }

  addSupplierBankAccountsToCollectionIfMissing<Type extends Pick<ISupplierBankAccounts, 'id'>>(
    supplierBankAccountsCollection: Type[],
    ...supplierBankAccountsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const supplierBankAccounts: Type[] = supplierBankAccountsToCheck.filter(isPresent);
    if (supplierBankAccounts.length > 0) {
      const supplierBankAccountsCollectionIdentifiers = supplierBankAccountsCollection.map(supplierBankAccountsItem =>
        this.getSupplierBankAccountsIdentifier(supplierBankAccountsItem),
      );
      const supplierBankAccountsToAdd = supplierBankAccounts.filter(supplierBankAccountsItem => {
        const supplierBankAccountsIdentifier = this.getSupplierBankAccountsIdentifier(supplierBankAccountsItem);
        if (supplierBankAccountsCollectionIdentifiers.includes(supplierBankAccountsIdentifier)) {
          return false;
        }
        supplierBankAccountsCollectionIdentifiers.push(supplierBankAccountsIdentifier);
        return true;
      });
      return [...supplierBankAccountsToAdd, ...supplierBankAccountsCollection];
    }
    return supplierBankAccountsCollection;
  }
}
