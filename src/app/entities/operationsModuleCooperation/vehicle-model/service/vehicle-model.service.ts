import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IVehicleModel, NewVehicleModel } from '../vehicle-model.model';

export type PartialUpdateVehicleModel = Partial<IVehicleModel> & Pick<IVehicleModel, 'id'>;

type RestOf<T extends IVehicleModel | NewVehicleModel> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestVehicleModel = RestOf<IVehicleModel>;

export type NewRestVehicleModel = RestOf<NewVehicleModel>;

export type PartialUpdateRestVehicleModel = RestOf<PartialUpdateVehicleModel>;

export type EntityResponseType = HttpResponse<IVehicleModel>;
export type EntityArrayResponseType = HttpResponse<IVehicleModel[]>;

@Injectable({ providedIn: 'root' })
export class VehicleModelService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehicle-models', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/vehicle-models/_search', 'operationsmodule');

  create(vehicleModel: NewVehicleModel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleModel);
    return this.http
      .post<RestVehicleModel>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vehicleModel: IVehicleModel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleModel);
    return this.http
      .put<RestVehicleModel>(`${this.resourceUrl}/${this.getVehicleModelIdentifier(vehicleModel)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vehicleModel: PartialUpdateVehicleModel): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vehicleModel);
    return this.http
      .patch<RestVehicleModel>(`${this.resourceUrl}/${this.getVehicleModelIdentifier(vehicleModel)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVehicleModel>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVehicleModel[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestVehicleModel[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IVehicleModel[]>()], asapScheduler)),
    );
  }

  getVehicleModelIdentifier(vehicleModel: Pick<IVehicleModel, 'id'>): number {
    return vehicleModel.id;
  }

  compareVehicleModel(o1: Pick<IVehicleModel, 'id'> | null, o2: Pick<IVehicleModel, 'id'> | null): boolean {
    return o1 && o2 ? this.getVehicleModelIdentifier(o1) === this.getVehicleModelIdentifier(o2) : o1 === o2;
  }

  addVehicleModelToCollectionIfMissing<Type extends Pick<IVehicleModel, 'id'>>(
    vehicleModelCollection: Type[],
    ...vehicleModelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vehicleModels: Type[] = vehicleModelsToCheck.filter(isPresent);
    if (vehicleModels.length > 0) {
      const vehicleModelCollectionIdentifiers = vehicleModelCollection.map(vehicleModelItem =>
        this.getVehicleModelIdentifier(vehicleModelItem),
      );
      const vehicleModelsToAdd = vehicleModels.filter(vehicleModelItem => {
        const vehicleModelIdentifier = this.getVehicleModelIdentifier(vehicleModelItem);
        if (vehicleModelCollectionIdentifiers.includes(vehicleModelIdentifier)) {
          return false;
        }
        vehicleModelCollectionIdentifiers.push(vehicleModelIdentifier);
        return true;
      });
      return [...vehicleModelsToAdd, ...vehicleModelCollection];
    }
    return vehicleModelCollection;
  }

  protected convertDateFromClient<T extends IVehicleModel | NewVehicleModel | PartialUpdateVehicleModel>(vehicleModel: T): RestOf<T> {
    return {
      ...vehicleModel,
      createdDate: vehicleModel.createdDate?.toJSON() ?? null,
      lastModifiedDate: vehicleModel.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVehicleModel: RestVehicleModel): IVehicleModel {
    return {
      ...restVehicleModel,
      createdDate: restVehicleModel.createdDate ? dayjs(restVehicleModel.createdDate) : undefined,
      lastModifiedDate: restVehicleModel.lastModifiedDate ? dayjs(restVehicleModel.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVehicleModel>): HttpResponse<IVehicleModel> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVehicleModel[]>): HttpResponse<IVehicleModel[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
