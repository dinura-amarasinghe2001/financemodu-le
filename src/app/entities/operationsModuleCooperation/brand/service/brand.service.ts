import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IBrand, NewBrand } from '../brand.model';

export type PartialUpdateBrand = Partial<IBrand> & Pick<IBrand, 'id'>;

type RestOf<T extends IBrand | NewBrand> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestBrand = RestOf<IBrand>;

export type NewRestBrand = RestOf<NewBrand>;

export type PartialUpdateRestBrand = RestOf<PartialUpdateBrand>;

export type EntityResponseType = HttpResponse<IBrand>;
export type EntityArrayResponseType = HttpResponse<IBrand[]>;

@Injectable({ providedIn: 'root' })
export class BrandService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/brands', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/brands/_search', 'operationsmodule');

  create(brand: NewBrand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(brand);
    return this.http.post<RestBrand>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(brand: IBrand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(brand);
    return this.http
      .put<RestBrand>(`${this.resourceUrl}/${this.getBrandIdentifier(brand)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(brand: PartialUpdateBrand): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(brand);
    return this.http
      .patch<RestBrand>(`${this.resourceUrl}/${this.getBrandIdentifier(brand)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBrand>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBrand[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestBrand[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IBrand[]>()], asapScheduler)),
    );
  }

  getBrandIdentifier(brand: Pick<IBrand, 'id'>): number {
    return brand.id;
  }

  compareBrand(o1: Pick<IBrand, 'id'> | null, o2: Pick<IBrand, 'id'> | null): boolean {
    return o1 && o2 ? this.getBrandIdentifier(o1) === this.getBrandIdentifier(o2) : o1 === o2;
  }

  addBrandToCollectionIfMissing<Type extends Pick<IBrand, 'id'>>(
    brandCollection: Type[],
    ...brandsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const brands: Type[] = brandsToCheck.filter(isPresent);
    if (brands.length > 0) {
      const brandCollectionIdentifiers = brandCollection.map(brandItem => this.getBrandIdentifier(brandItem));
      const brandsToAdd = brands.filter(brandItem => {
        const brandIdentifier = this.getBrandIdentifier(brandItem);
        if (brandCollectionIdentifiers.includes(brandIdentifier)) {
          return false;
        }
        brandCollectionIdentifiers.push(brandIdentifier);
        return true;
      });
      return [...brandsToAdd, ...brandCollection];
    }
    return brandCollection;
  }

  protected convertDateFromClient<T extends IBrand | NewBrand | PartialUpdateBrand>(brand: T): RestOf<T> {
    return {
      ...brand,
      createdDate: brand.createdDate?.toJSON() ?? null,
      lastModifiedDate: brand.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBrand: RestBrand): IBrand {
    return {
      ...restBrand,
      createdDate: restBrand.createdDate ? dayjs(restBrand.createdDate) : undefined,
      lastModifiedDate: restBrand.lastModifiedDate ? dayjs(restBrand.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBrand>): HttpResponse<IBrand> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBrand[]>): HttpResponse<IBrand[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
