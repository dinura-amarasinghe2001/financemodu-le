import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Observable, asapScheduler, map, scheduled } from "rxjs";

import { catchError } from "rxjs/operators";

import dayjs from "dayjs/esm";

import { isPresent } from "app/core/util/operators";
import { ApplicationConfigService } from "app/core/config/application-config.service";
import { createRequestOption } from "app/core/request/request-util";
import { SearchWithPagination } from "app/core/request/request.model";
import {
  IVehicleRegistry,
  NewVehicleRegistry,
} from "../vehicle-registry.model";

export type PartialUpdateVehicleRegistry = Partial<IVehicleRegistry> &
  Pick<IVehicleRegistry, "id">;

type RestOf<T extends IVehicleRegistry | NewVehicleRegistry> = Omit<
  T,
  "createdDate" | "lastModifiedDate"
> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestVehicleRegistry = RestOf<IVehicleRegistry>;

export type NewRestVehicleRegistry = RestOf<NewVehicleRegistry>;

export type PartialUpdateRestVehicleRegistry =
  RestOf<PartialUpdateVehicleRegistry>;

export type EntityResponseType = HttpResponse<IVehicleRegistry>;
export type EntityArrayResponseType = HttpResponse<IVehicleRegistry[]>;

@Injectable({ providedIn: "root" })
export class VehicleRegistryService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(
    ApplicationConfigService
  );

  protected resourceUrl = this.applicationConfigService.getEndpointFor(
    "api/vehicle-registries",
    "operationsmodule"
  );
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor(
    "api/vehicle-registries/_search",
    "operationsmodule"
  );

  create(vehicleRegistry: NewVehicleRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleRegistry);
    return this.http
      .post<RestVehicleRegistry>(this.resourceUrl, copy, {
        observe: "response",
      })
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  update(vehicleRegistry: IVehicleRegistry): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleRegistry);
    return this.http
      .put<RestVehicleRegistry>(
        `${this.resourceUrl}/${this.getVehicleRegistryIdentifier(vehicleRegistry)}`,
        copy,
        { observe: "response" }
      )
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  partialUpdate(
    vehicleRegistry: PartialUpdateVehicleRegistry
  ): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleRegistry);
    return this.http
      .patch<RestVehicleRegistry>(
        `${this.resourceUrl}/${this.getVehicleRegistryIdentifier(vehicleRegistry)}`,
        copy,
        {
          observe: "response",
        }
      )
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVehicleRegistry>(`${this.resourceUrl}/${id}`, {
        observe: "response",
      })
      .pipe(map((res) => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<
        RestVehicleRegistry[]
      >(this.resourceUrl, { params: options, observe: "response" })
      .pipe(map((res) => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, {
      observe: "response",
    });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<
        RestVehicleRegistry[]
      >(this.resourceSearchUrl, { params: options, observe: "response" })
      .pipe(
        map((res) => this.convertResponseArrayFromServer(res)),

        catchError(() =>
          scheduled([new HttpResponse<IVehicleRegistry[]>()], asapScheduler)
        )
      );
  }

  getVehicleRegistryIdentifier(
    vehicleRegistry: Pick<IVehicleRegistry, "id">
  ): number {
    return vehicleRegistry.id;
  }

  compareVehicleRegistry(
    o1: Pick<IVehicleRegistry, "id"> | null,
    o2: Pick<IVehicleRegistry, "id"> | null
  ): boolean {
    return o1 && o2
      ? this.getVehicleRegistryIdentifier(o1) ===
          this.getVehicleRegistryIdentifier(o2)
      : o1 === o2;
  }

  addVehicleRegistryToCollectionIfMissing<
    Type extends Pick<IVehicleRegistry, "id">,
  >(
    vehicleRegistryCollection: Type[],
    ...vehicleRegistriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vehicleRegistries: Type[] =
      vehicleRegistriesToCheck.filter(isPresent);
    if (vehicleRegistries.length > 0) {
      const vehicleRegistryCollectionIdentifiers =
        vehicleRegistryCollection.map((vehicleRegistryItem) =>
          this.getVehicleRegistryIdentifier(vehicleRegistryItem)
        );
      const vehicleRegistriesToAdd = vehicleRegistries.filter(
        (vehicleRegistryItem) => {
          const vehicleRegistryIdentifier =
            this.getVehicleRegistryIdentifier(vehicleRegistryItem);
          if (
            vehicleRegistryCollectionIdentifiers.includes(
              vehicleRegistryIdentifier
            )
          ) {
            return false;
          }
          vehicleRegistryCollectionIdentifiers.push(vehicleRegistryIdentifier);
          return true;
        }
      );
      return [...vehicleRegistriesToAdd, ...vehicleRegistryCollection];
    }
    return vehicleRegistryCollection;
  }

  protected convertDateFromClient<
    T extends
      | IVehicleRegistry
      | NewVehicleRegistry
      | PartialUpdateVehicleRegistry,
  >(vehicleRegistry: T): RestOf<T> {
    return {
      ...vehicleRegistry,
      createdDate: vehicleRegistry.createdDate?.toJSON() ?? null,
      lastModifiedDate: vehicleRegistry.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(
    restVehicleRegistry: RestVehicleRegistry
  ): IVehicleRegistry {
    return {
      ...restVehicleRegistry,
      createdDate: restVehicleRegistry.createdDate
        ? dayjs(restVehicleRegistry.createdDate)
        : undefined,
      lastModifiedDate: restVehicleRegistry.lastModifiedDate
        ? dayjs(restVehicleRegistry.lastModifiedDate)
        : undefined,
    };
  }

  protected convertResponseFromServer(
    res: HttpResponse<RestVehicleRegistry>
  ): HttpResponse<IVehicleRegistry> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(
    res: HttpResponse<RestVehicleRegistry[]>
  ): HttpResponse<IVehicleRegistry[]> {
    return res.clone({
      body: res.body
        ? res.body.map((item) => this.convertDateFromServer(item))
        : null,
    });
  }
}
