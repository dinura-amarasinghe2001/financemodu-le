import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IVehicleTreatmentRegistry, NewVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';

export type PartialUpdateVehicleTreatmentRegistry = Partial<IVehicleTreatmentRegistry> & Pick<IVehicleTreatmentRegistry, 'id'>;

type RestOf<T extends IVehicleTreatmentRegistry | NewVehicleTreatmentRegistry> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestVehicleTreatmentRegistry = RestOf<IVehicleTreatmentRegistry>;

export type NewRestVehicleTreatmentRegistry = RestOf<NewVehicleTreatmentRegistry>;

export type PartialUpdateRestVehicleTreatmentRegistry = RestOf<PartialUpdateVehicleTreatmentRegistry>;

export type EntityResponseType = HttpResponse<IVehicleTreatmentRegistry>;
export type EntityArrayResponseType = HttpResponse<IVehicleTreatmentRegistry[]>;

@Injectable({ providedIn: 'root' })
export class VehicleTreatmentRegistryService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehicle-treatment-registries', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor(
    'api/vehicle-treatment-registries/_search',
    'operationsmodule',
  );

  create(vehicleTreatmentRegistry: NewVehicleTreatmentRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleTreatmentRegistry);
    return this.http
      .post<RestVehicleTreatmentRegistry>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vehicleTreatmentRegistry: IVehicleTreatmentRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleTreatmentRegistry);
    return this.http
      .put<RestVehicleTreatmentRegistry>(
        `${this.resourceUrl}/${this.getVehicleTreatmentRegistryIdentifier(vehicleTreatmentRegistry)}`,
        copy,
        { observe: 'response' },
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vehicleTreatmentRegistry: PartialUpdateVehicleTreatmentRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleTreatmentRegistry);
    return this.http
      .patch<RestVehicleTreatmentRegistry>(
        `${this.resourceUrl}/${this.getVehicleTreatmentRegistryIdentifier(vehicleTreatmentRegistry)}`,
        copy,
        { observe: 'response' },
      )
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVehicleTreatmentRegistry>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVehicleTreatmentRegistry[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestVehicleTreatmentRegistry[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IVehicleTreatmentRegistry[]>()], asapScheduler)),
    );
  }

  getVehicleTreatmentRegistryIdentifier(vehicleTreatmentRegistry: Pick<IVehicleTreatmentRegistry, 'id'>): number {
    return vehicleTreatmentRegistry.id;
  }

  compareVehicleTreatmentRegistry(
    o1: Pick<IVehicleTreatmentRegistry, 'id'> | null,
    o2: Pick<IVehicleTreatmentRegistry, 'id'> | null,
  ): boolean {
    return o1 && o2 ? this.getVehicleTreatmentRegistryIdentifier(o1) === this.getVehicleTreatmentRegistryIdentifier(o2) : o1 === o2;
  }

  addVehicleTreatmentRegistryToCollectionIfMissing<Type extends Pick<IVehicleTreatmentRegistry, 'id'>>(
    vehicleTreatmentRegistryCollection: Type[],
    ...vehicleTreatmentRegistriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vehicleTreatmentRegistries: Type[] = vehicleTreatmentRegistriesToCheck.filter(isPresent);
    if (vehicleTreatmentRegistries.length > 0) {
      const vehicleTreatmentRegistryCollectionIdentifiers = vehicleTreatmentRegistryCollection.map(vehicleTreatmentRegistryItem =>
        this.getVehicleTreatmentRegistryIdentifier(vehicleTreatmentRegistryItem),
      );
      const vehicleTreatmentRegistriesToAdd = vehicleTreatmentRegistries.filter(vehicleTreatmentRegistryItem => {
        const vehicleTreatmentRegistryIdentifier = this.getVehicleTreatmentRegistryIdentifier(vehicleTreatmentRegistryItem);
        if (vehicleTreatmentRegistryCollectionIdentifiers.includes(vehicleTreatmentRegistryIdentifier)) {
          return false;
        }
        vehicleTreatmentRegistryCollectionIdentifiers.push(vehicleTreatmentRegistryIdentifier);
        return true;
      });
      return [...vehicleTreatmentRegistriesToAdd, ...vehicleTreatmentRegistryCollection];
    }
    return vehicleTreatmentRegistryCollection;
  }

  protected convertDateFromClient<
    T extends IVehicleTreatmentRegistry | NewVehicleTreatmentRegistry | PartialUpdateVehicleTreatmentRegistry,
  >(vehicleTreatmentRegistry: T): RestOf<T> {
    return {
      ...vehicleTreatmentRegistry,
      createdDate: vehicleTreatmentRegistry.createdDate?.toJSON() ?? null,
      lastModifiedDate: vehicleTreatmentRegistry.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVehicleTreatmentRegistry: RestVehicleTreatmentRegistry): IVehicleTreatmentRegistry {
    return {
      ...restVehicleTreatmentRegistry,
      createdDate: restVehicleTreatmentRegistry.createdDate ? dayjs(restVehicleTreatmentRegistry.createdDate) : undefined,
      lastModifiedDate: restVehicleTreatmentRegistry.lastModifiedDate ? dayjs(restVehicleTreatmentRegistry.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVehicleTreatmentRegistry>): HttpResponse<IVehicleTreatmentRegistry> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVehicleTreatmentRegistry[]>): HttpResponse<IVehicleTreatmentRegistry[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
