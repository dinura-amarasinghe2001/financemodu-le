import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IOperationalUnit, NewOperationalUnit } from '../operational-unit.model';

export type PartialUpdateOperationalUnit = Partial<IOperationalUnit> & Pick<IOperationalUnit, 'id'>;

type RestOf<T extends IOperationalUnit | NewOperationalUnit> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestOperationalUnit = RestOf<IOperationalUnit>;

export type NewRestOperationalUnit = RestOf<NewOperationalUnit>;

export type PartialUpdateRestOperationalUnit = RestOf<PartialUpdateOperationalUnit>;

export type EntityResponseType = HttpResponse<IOperationalUnit>;
export type EntityArrayResponseType = HttpResponse<IOperationalUnit[]>;

@Injectable({ providedIn: 'root' })
export class OperationalUnitService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/operational-units', 'tenantcontrolmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/operational-units/_search', 'tenantcontrolmodule');

  create(operationalUnit: NewOperationalUnit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operationalUnit);
    return this.http
      .post<RestOperationalUnit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(operationalUnit: IOperationalUnit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operationalUnit);
    return this.http
      .put<RestOperationalUnit>(`${this.resourceUrl}/${this.getOperationalUnitIdentifier(operationalUnit)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(operationalUnit: PartialUpdateOperationalUnit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(operationalUnit);
    return this.http
      .patch<RestOperationalUnit>(`${this.resourceUrl}/${this.getOperationalUnitIdentifier(operationalUnit)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestOperationalUnit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestOperationalUnit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestOperationalUnit[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IOperationalUnit[]>()], asapScheduler)),
    );
  }

  getOperationalUnitIdentifier(operationalUnit: Pick<IOperationalUnit, 'id'>): number {
    return operationalUnit.id;
  }

  compareOperationalUnit(o1: Pick<IOperationalUnit, 'id'> | null, o2: Pick<IOperationalUnit, 'id'> | null): boolean {
    return o1 && o2 ? this.getOperationalUnitIdentifier(o1) === this.getOperationalUnitIdentifier(o2) : o1 === o2;
  }

  addOperationalUnitToCollectionIfMissing<Type extends Pick<IOperationalUnit, 'id'>>(
    operationalUnitCollection: Type[],
    ...operationalUnitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const operationalUnits: Type[] = operationalUnitsToCheck.filter(isPresent);
    if (operationalUnits.length > 0) {
      const operationalUnitCollectionIdentifiers = operationalUnitCollection.map(operationalUnitItem =>
        this.getOperationalUnitIdentifier(operationalUnitItem),
      );
      const operationalUnitsToAdd = operationalUnits.filter(operationalUnitItem => {
        const operationalUnitIdentifier = this.getOperationalUnitIdentifier(operationalUnitItem);
        if (operationalUnitCollectionIdentifiers.includes(operationalUnitIdentifier)) {
          return false;
        }
        operationalUnitCollectionIdentifiers.push(operationalUnitIdentifier);
        return true;
      });
      return [...operationalUnitsToAdd, ...operationalUnitCollection];
    }
    return operationalUnitCollection;
  }

  protected convertDateFromClient<T extends IOperationalUnit | NewOperationalUnit | PartialUpdateOperationalUnit>(
    operationalUnit: T,
  ): RestOf<T> {
    return {
      ...operationalUnit,
      createdDate: operationalUnit.createdDate?.toJSON() ?? null,
      lastModifiedDate: operationalUnit.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restOperationalUnit: RestOperationalUnit): IOperationalUnit {
    return {
      ...restOperationalUnit,
      createdDate: restOperationalUnit.createdDate ? dayjs(restOperationalUnit.createdDate) : undefined,
      lastModifiedDate: restOperationalUnit.lastModifiedDate ? dayjs(restOperationalUnit.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestOperationalUnit>): HttpResponse<IOperationalUnit> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestOperationalUnit[]>): HttpResponse<IOperationalUnit[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
