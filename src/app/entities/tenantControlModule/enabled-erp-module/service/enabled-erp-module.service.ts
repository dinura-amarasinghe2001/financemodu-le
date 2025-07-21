import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IEnabledERPModule, NewEnabledERPModule } from '../enabled-erp-module.model';

export type PartialUpdateEnabledERPModule = Partial<IEnabledERPModule> & Pick<IEnabledERPModule, 'id'>;

type RestOf<T extends IEnabledERPModule | NewEnabledERPModule> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestEnabledERPModule = RestOf<IEnabledERPModule>;

export type NewRestEnabledERPModule = RestOf<NewEnabledERPModule>;

export type PartialUpdateRestEnabledERPModule = RestOf<PartialUpdateEnabledERPModule>;

export type EntityResponseType = HttpResponse<IEnabledERPModule>;
export type EntityArrayResponseType = HttpResponse<IEnabledERPModule[]>;

@Injectable({ providedIn: 'root' })
export class EnabledERPModuleService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/enabled-erp-modules', 'tenantcontrolmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/enabled-erp-modules/_search', 'tenantcontrolmodule');

  create(enabledERPModule: NewEnabledERPModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enabledERPModule);
    return this.http
      .post<RestEnabledERPModule>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(enabledERPModule: IEnabledERPModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enabledERPModule);
    return this.http
      .put<RestEnabledERPModule>(`${this.resourceUrl}/${this.getEnabledERPModuleIdentifier(enabledERPModule)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(enabledERPModule: PartialUpdateEnabledERPModule): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(enabledERPModule);
    return this.http
      .patch<RestEnabledERPModule>(`${this.resourceUrl}/${this.getEnabledERPModuleIdentifier(enabledERPModule)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEnabledERPModule>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEnabledERPModule[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestEnabledERPModule[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IEnabledERPModule[]>()], asapScheduler)),
    );
  }

  getEnabledERPModuleIdentifier(enabledERPModule: Pick<IEnabledERPModule, 'id'>): number {
    return enabledERPModule.id;
  }

  compareEnabledERPModule(o1: Pick<IEnabledERPModule, 'id'> | null, o2: Pick<IEnabledERPModule, 'id'> | null): boolean {
    return o1 && o2 ? this.getEnabledERPModuleIdentifier(o1) === this.getEnabledERPModuleIdentifier(o2) : o1 === o2;
  }

  addEnabledERPModuleToCollectionIfMissing<Type extends Pick<IEnabledERPModule, 'id'>>(
    enabledERPModuleCollection: Type[],
    ...enabledERPModulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const enabledERPModules: Type[] = enabledERPModulesToCheck.filter(isPresent);
    if (enabledERPModules.length > 0) {
      const enabledERPModuleCollectionIdentifiers = enabledERPModuleCollection.map(enabledERPModuleItem =>
        this.getEnabledERPModuleIdentifier(enabledERPModuleItem),
      );
      const enabledERPModulesToAdd = enabledERPModules.filter(enabledERPModuleItem => {
        const enabledERPModuleIdentifier = this.getEnabledERPModuleIdentifier(enabledERPModuleItem);
        if (enabledERPModuleCollectionIdentifiers.includes(enabledERPModuleIdentifier)) {
          return false;
        }
        enabledERPModuleCollectionIdentifiers.push(enabledERPModuleIdentifier);
        return true;
      });
      return [...enabledERPModulesToAdd, ...enabledERPModuleCollection];
    }
    return enabledERPModuleCollection;
  }

  protected convertDateFromClient<T extends IEnabledERPModule | NewEnabledERPModule | PartialUpdateEnabledERPModule>(
    enabledERPModule: T,
  ): RestOf<T> {
    return {
      ...enabledERPModule,
      createdDate: enabledERPModule.createdDate?.toJSON() ?? null,
      lastModifiedDate: enabledERPModule.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restEnabledERPModule: RestEnabledERPModule): IEnabledERPModule {
    return {
      ...restEnabledERPModule,
      createdDate: restEnabledERPModule.createdDate ? dayjs(restEnabledERPModule.createdDate) : undefined,
      lastModifiedDate: restEnabledERPModule.lastModifiedDate ? dayjs(restEnabledERPModule.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEnabledERPModule>): HttpResponse<IEnabledERPModule> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEnabledERPModule[]>): HttpResponse<IEnabledERPModule[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
