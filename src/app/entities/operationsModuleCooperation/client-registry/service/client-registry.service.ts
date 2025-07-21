import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IClientRegistry, NewClientRegistry } from '../client-registry.model';

export type PartialUpdateClientRegistry = Partial<IClientRegistry> & Pick<IClientRegistry, 'id'>;

type RestOf<T extends IClientRegistry | NewClientRegistry> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestClientRegistry = RestOf<IClientRegistry>;

export type NewRestClientRegistry = RestOf<NewClientRegistry>;

export type PartialUpdateRestClientRegistry = RestOf<PartialUpdateClientRegistry>;

export type EntityResponseType = HttpResponse<IClientRegistry>;
export type EntityArrayResponseType = HttpResponse<IClientRegistry[]>;

@Injectable({ providedIn: 'root' })
export class ClientRegistryService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/client-registries', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor(
    'api/client-registries/_search',
    'operationsmodule',
  );

  create(clientRegistry: NewClientRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientRegistry);
    return this.http
      .post<RestClientRegistry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(clientRegistry: IClientRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientRegistry);
    return this.http
      .put<RestClientRegistry>(`${this.resourceUrl}/${this.getClientRegistryIdentifier(clientRegistry)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(clientRegistry: PartialUpdateClientRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(clientRegistry);
    return this.http
      .patch<RestClientRegistry>(`${this.resourceUrl}/${this.getClientRegistryIdentifier(clientRegistry)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestClientRegistry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestClientRegistry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestClientRegistry[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IClientRegistry[]>()], asapScheduler)),
    );
  }

  getClientRegistryIdentifier(clientRegistry: Pick<IClientRegistry, 'id'>): number {
    return clientRegistry.id;
  }

  compareClientRegistry(o1: Pick<IClientRegistry, 'id'> | null, o2: Pick<IClientRegistry, 'id'> | null): boolean {
    return o1 && o2 ? this.getClientRegistryIdentifier(o1) === this.getClientRegistryIdentifier(o2) : o1 === o2;
  }

  addClientRegistryToCollectionIfMissing<Type extends Pick<IClientRegistry, 'id'>>(
    clientRegistryCollection: Type[],
    ...clientRegistriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clientRegistries: Type[] = clientRegistriesToCheck.filter(isPresent);
    if (clientRegistries.length > 0) {
      const clientRegistryCollectionIdentifiers = clientRegistryCollection.map(clientRegistryItem =>
        this.getClientRegistryIdentifier(clientRegistryItem),
      );
      const clientRegistriesToAdd = clientRegistries.filter(clientRegistryItem => {
        const clientRegistryIdentifier = this.getClientRegistryIdentifier(clientRegistryItem);
        if (clientRegistryCollectionIdentifiers.includes(clientRegistryIdentifier)) {
          return false;
        }
        clientRegistryCollectionIdentifiers.push(clientRegistryIdentifier);
        return true;
      });
      return [...clientRegistriesToAdd, ...clientRegistryCollection];
    }
    return clientRegistryCollection;
  }

  protected convertDateFromClient<T extends IClientRegistry | NewClientRegistry | PartialUpdateClientRegistry>(
    clientRegistry: T,
  ): RestOf<T> {
    return {
      ...clientRegistry,
      createdDate: clientRegistry.createdDate?.toJSON() ?? null,
      lastModifiedDate: clientRegistry.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restClientRegistry: RestClientRegistry): IClientRegistry {
    return {
      ...restClientRegistry,
      createdDate: restClientRegistry.createdDate ? dayjs(restClientRegistry.createdDate) : undefined,
      lastModifiedDate: restClientRegistry.lastModifiedDate ? dayjs(restClientRegistry.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestClientRegistry>): HttpResponse<IClientRegistry> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestClientRegistry[]>): HttpResponse<IClientRegistry[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
