import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IAccountType, NewAccountType } from '../account-type.model';

export type PartialUpdateAccountType = Partial<IAccountType> & Pick<IAccountType, 'id'>;

type RestOf<T extends IAccountType | NewAccountType> = Omit<T, 'lmd'> & {
  lmd?: string | null;
};

export type RestAccountType = RestOf<IAccountType>;

export type NewRestAccountType = RestOf<NewAccountType>;

export type PartialUpdateRestAccountType = RestOf<PartialUpdateAccountType>;

export type EntityResponseType = HttpResponse<IAccountType>;
export type EntityArrayResponseType = HttpResponse<IAccountType[]>;

@Injectable({ providedIn: 'root' })
export class AccountTypeService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/account-types', 'financemicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/account-types/_search', 'financemicro');

  create(accountType: NewAccountType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountType);
    return this.http
      .post<RestAccountType>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(accountType: IAccountType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountType);
    return this.http
      .put<RestAccountType>(`${this.resourceUrl}/${this.getAccountTypeIdentifier(accountType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(accountType: PartialUpdateAccountType): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(accountType);
    return this.http
      .patch<RestAccountType>(`${this.resourceUrl}/${this.getAccountTypeIdentifier(accountType)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAccountType>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAccountType[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestAccountType[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IAccountType[]>()], asapScheduler)),
    );
  }

  getAccountTypeIdentifier(accountType: Pick<IAccountType, 'id'>): number {
    return accountType.id;
  }

  compareAccountType(o1: Pick<IAccountType, 'id'> | null, o2: Pick<IAccountType, 'id'> | null): boolean {
    return o1 && o2 ? this.getAccountTypeIdentifier(o1) === this.getAccountTypeIdentifier(o2) : o1 === o2;
  }

  addAccountTypeToCollectionIfMissing<Type extends Pick<IAccountType, 'id'>>(
    accountTypeCollection: Type[],
    ...accountTypesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const accountTypes: Type[] = accountTypesToCheck.filter(isPresent);
    if (accountTypes.length > 0) {
      const accountTypeCollectionIdentifiers = accountTypeCollection.map(accountTypeItem => this.getAccountTypeIdentifier(accountTypeItem));
      const accountTypesToAdd = accountTypes.filter(accountTypeItem => {
        const accountTypeIdentifier = this.getAccountTypeIdentifier(accountTypeItem);
        if (accountTypeCollectionIdentifiers.includes(accountTypeIdentifier)) {
          return false;
        }
        accountTypeCollectionIdentifiers.push(accountTypeIdentifier);
        return true;
      });
      return [...accountTypesToAdd, ...accountTypeCollection];
    }
    return accountTypeCollection;
  }

  protected convertDateFromClient<T extends IAccountType | NewAccountType | PartialUpdateAccountType>(accountType: T): RestOf<T> {
    return {
      ...accountType,
      lmd: accountType.lmd?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAccountType: RestAccountType): IAccountType {
    return {
      ...restAccountType,
      lmd: restAccountType.lmd ? dayjs(restAccountType.lmd) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAccountType>): HttpResponse<IAccountType> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAccountType[]>): HttpResponse<IAccountType[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
