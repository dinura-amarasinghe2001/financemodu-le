import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { ITenant, NewTenant } from '../tenant.model';

export type PartialUpdateTenant = Partial<ITenant> & Pick<ITenant, 'id'>;

type RestOf<T extends ITenant | NewTenant> = Omit<T, 'establishedDate' | 'createdDate' | 'lastModifiedDate'> & {
  establishedDate?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestTenant = RestOf<ITenant>;

export type NewRestTenant = RestOf<NewTenant>;

export type PartialUpdateRestTenant = RestOf<PartialUpdateTenant>;

export type EntityResponseType = HttpResponse<ITenant>;
export type EntityArrayResponseType = HttpResponse<ITenant[]>;

@Injectable({ providedIn: 'root' })
export class TenantService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tenants', 'tenantcontrolmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/tenants/_search', 'tenantcontrolmodule');

  create(tenant: NewTenant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tenant);
    return this.http
      .post<RestTenant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(tenant: ITenant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tenant);
    return this.http
      .put<RestTenant>(`${this.resourceUrl}/${this.getTenantIdentifier(tenant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(tenant: PartialUpdateTenant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tenant);
    return this.http
      .patch<RestTenant>(`${this.resourceUrl}/${this.getTenantIdentifier(tenant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTenant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTenant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestTenant[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<ITenant[]>()], asapScheduler)),
    );
  }

  getTenantIdentifier(tenant: Pick<ITenant, 'id'>): number {
    return tenant.id;
  }

  compareTenant(o1: Pick<ITenant, 'id'> | null, o2: Pick<ITenant, 'id'> | null): boolean {
    return o1 && o2 ? this.getTenantIdentifier(o1) === this.getTenantIdentifier(o2) : o1 === o2;
  }

  addTenantToCollectionIfMissing<Type extends Pick<ITenant, 'id'>>(
    tenantCollection: Type[],
    ...tenantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tenants: Type[] = tenantsToCheck.filter(isPresent);
    if (tenants.length > 0) {
      const tenantCollectionIdentifiers = tenantCollection.map(tenantItem => this.getTenantIdentifier(tenantItem));
      const tenantsToAdd = tenants.filter(tenantItem => {
        const tenantIdentifier = this.getTenantIdentifier(tenantItem);
        if (tenantCollectionIdentifiers.includes(tenantIdentifier)) {
          return false;
        }
        tenantCollectionIdentifiers.push(tenantIdentifier);
        return true;
      });
      return [...tenantsToAdd, ...tenantCollection];
    }
    return tenantCollection;
  }

  protected convertDateFromClient<T extends ITenant | NewTenant | PartialUpdateTenant>(tenant: T): RestOf<T> {
    return {
      ...tenant,
      establishedDate: tenant.establishedDate?.format(DATE_FORMAT) ?? null,
      createdDate: tenant.createdDate?.toJSON() ?? null,
      lastModifiedDate: tenant.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restTenant: RestTenant): ITenant {
    return {
      ...restTenant,
      establishedDate: restTenant.establishedDate ? dayjs(restTenant.establishedDate) : undefined,
      createdDate: restTenant.createdDate ? dayjs(restTenant.createdDate) : undefined,
      lastModifiedDate: restTenant.lastModifiedDate ? dayjs(restTenant.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTenant>): HttpResponse<ITenant> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTenant[]>): HttpResponse<ITenant[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
