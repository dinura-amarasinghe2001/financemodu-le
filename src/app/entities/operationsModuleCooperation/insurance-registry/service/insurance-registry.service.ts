import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IInsuranceRegistry, NewInsuranceRegistry } from '../insurance-registry.model';

export type PartialUpdateInsuranceRegistry = Partial<IInsuranceRegistry> & Pick<IInsuranceRegistry, 'id'>;

type RestOf<T extends IInsuranceRegistry | NewInsuranceRegistry> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestInsuranceRegistry = RestOf<IInsuranceRegistry>;

export type NewRestInsuranceRegistry = RestOf<NewInsuranceRegistry>;

export type PartialUpdateRestInsuranceRegistry = RestOf<PartialUpdateInsuranceRegistry>;

export type EntityResponseType = HttpResponse<IInsuranceRegistry>;
export type EntityArrayResponseType = HttpResponse<IInsuranceRegistry[]>;

@Injectable({ providedIn: 'root' })
export class InsuranceRegistryService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/insurance-registries', 'operationsmodulecooperation');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor(
    'api/insurance-registries/_search',
    'operationsmodulecooperation',
  );

  create(insuranceRegistry: NewInsuranceRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(insuranceRegistry);
    return this.http
      .post<RestInsuranceRegistry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(insuranceRegistry: IInsuranceRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(insuranceRegistry);
    return this.http
      .put<RestInsuranceRegistry>(`${this.resourceUrl}/${this.getInsuranceRegistryIdentifier(insuranceRegistry)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(insuranceRegistry: PartialUpdateInsuranceRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(insuranceRegistry);
    return this.http
      .patch<RestInsuranceRegistry>(`${this.resourceUrl}/${this.getInsuranceRegistryIdentifier(insuranceRegistry)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInsuranceRegistry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInsuranceRegistry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestInsuranceRegistry[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IInsuranceRegistry[]>()], asapScheduler)),
    );
  }

  getInsuranceRegistryIdentifier(insuranceRegistry: Pick<IInsuranceRegistry, 'id'>): number {
    return insuranceRegistry.id;
  }

  compareInsuranceRegistry(o1: Pick<IInsuranceRegistry, 'id'> | null, o2: Pick<IInsuranceRegistry, 'id'> | null): boolean {
    return o1 && o2 ? this.getInsuranceRegistryIdentifier(o1) === this.getInsuranceRegistryIdentifier(o2) : o1 === o2;
  }

  addInsuranceRegistryToCollectionIfMissing<Type extends Pick<IInsuranceRegistry, 'id'>>(
    insuranceRegistryCollection: Type[],
    ...insuranceRegistriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const insuranceRegistries: Type[] = insuranceRegistriesToCheck.filter(isPresent);
    if (insuranceRegistries.length > 0) {
      const insuranceRegistryCollectionIdentifiers = insuranceRegistryCollection.map(insuranceRegistryItem =>
        this.getInsuranceRegistryIdentifier(insuranceRegistryItem),
      );
      const insuranceRegistriesToAdd = insuranceRegistries.filter(insuranceRegistryItem => {
        const insuranceRegistryIdentifier = this.getInsuranceRegistryIdentifier(insuranceRegistryItem);
        if (insuranceRegistryCollectionIdentifiers.includes(insuranceRegistryIdentifier)) {
          return false;
        }
        insuranceRegistryCollectionIdentifiers.push(insuranceRegistryIdentifier);
        return true;
      });
      return [...insuranceRegistriesToAdd, ...insuranceRegistryCollection];
    }
    return insuranceRegistryCollection;
  }

  protected convertDateFromClient<T extends IInsuranceRegistry | NewInsuranceRegistry | PartialUpdateInsuranceRegistry>(
    insuranceRegistry: T,
  ): RestOf<T> {
    return {
      ...insuranceRegistry,
      createdDate: insuranceRegistry.createdDate?.toJSON() ?? null,
      lastModifiedDate: insuranceRegistry.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInsuranceRegistry: RestInsuranceRegistry): IInsuranceRegistry {
    return {
      ...restInsuranceRegistry,
      createdDate: restInsuranceRegistry.createdDate ? dayjs(restInsuranceRegistry.createdDate) : undefined,
      lastModifiedDate: restInsuranceRegistry.lastModifiedDate ? dayjs(restInsuranceRegistry.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInsuranceRegistry>): HttpResponse<IInsuranceRegistry> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInsuranceRegistry[]>): HttpResponse<IInsuranceRegistry[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
