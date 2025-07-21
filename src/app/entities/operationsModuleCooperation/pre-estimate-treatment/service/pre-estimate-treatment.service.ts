import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IPreEstimateTreatment, NewPreEstimateTreatment } from '../pre-estimate-treatment.model';

export type PartialUpdatePreEstimateTreatment = Partial<IPreEstimateTreatment> & Pick<IPreEstimateTreatment, 'id'>;

type RestOf<T extends IPreEstimateTreatment | NewPreEstimateTreatment> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestPreEstimateTreatment = RestOf<IPreEstimateTreatment>;

export type NewRestPreEstimateTreatment = RestOf<NewPreEstimateTreatment>;

export type PartialUpdateRestPreEstimateTreatment = RestOf<PartialUpdatePreEstimateTreatment>;

export type EntityResponseType = HttpResponse<IPreEstimateTreatment>;
export type EntityArrayResponseType = HttpResponse<IPreEstimateTreatment[]>;

@Injectable({ providedIn: 'root' })
export class PreEstimateTreatmentService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/pre-estimate-treatments', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/pre-estimate-treatments/_search', 'operationsmodule');

  create(preEstimateTreatment: NewPreEstimateTreatment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(preEstimateTreatment);
    return this.http
      .post<RestPreEstimateTreatment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(preEstimateTreatment: IPreEstimateTreatment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(preEstimateTreatment);
    return this.http
      .put<RestPreEstimateTreatment>(`${this.resourceUrl}/${this.getPreEstimateTreatmentIdentifier(preEstimateTreatment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(preEstimateTreatment: PartialUpdatePreEstimateTreatment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(preEstimateTreatment);
    return this.http
      .patch<RestPreEstimateTreatment>(`${this.resourceUrl}/${this.getPreEstimateTreatmentIdentifier(preEstimateTreatment)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPreEstimateTreatment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPreEstimateTreatment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestPreEstimateTreatment[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IPreEstimateTreatment[]>()], asapScheduler)),
    );
  }

  getPreEstimateTreatmentIdentifier(preEstimateTreatment: Pick<IPreEstimateTreatment, 'id'>): number {
    return preEstimateTreatment.id;
  }

  comparePreEstimateTreatment(o1: Pick<IPreEstimateTreatment, 'id'> | null, o2: Pick<IPreEstimateTreatment, 'id'> | null): boolean {
    return o1 && o2 ? this.getPreEstimateTreatmentIdentifier(o1) === this.getPreEstimateTreatmentIdentifier(o2) : o1 === o2;
  }

  addPreEstimateTreatmentToCollectionIfMissing<Type extends Pick<IPreEstimateTreatment, 'id'>>(
    preEstimateTreatmentCollection: Type[],
    ...preEstimateTreatmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const preEstimateTreatments: Type[] = preEstimateTreatmentsToCheck.filter(isPresent);
    if (preEstimateTreatments.length > 0) {
      const preEstimateTreatmentCollectionIdentifiers = preEstimateTreatmentCollection.map(preEstimateTreatmentItem =>
        this.getPreEstimateTreatmentIdentifier(preEstimateTreatmentItem),
      );
      const preEstimateTreatmentsToAdd = preEstimateTreatments.filter(preEstimateTreatmentItem => {
        const preEstimateTreatmentIdentifier = this.getPreEstimateTreatmentIdentifier(preEstimateTreatmentItem);
        if (preEstimateTreatmentCollectionIdentifiers.includes(preEstimateTreatmentIdentifier)) {
          return false;
        }
        preEstimateTreatmentCollectionIdentifiers.push(preEstimateTreatmentIdentifier);
        return true;
      });
      return [...preEstimateTreatmentsToAdd, ...preEstimateTreatmentCollection];
    }
    return preEstimateTreatmentCollection;
  }

  protected convertDateFromClient<T extends IPreEstimateTreatment | NewPreEstimateTreatment | PartialUpdatePreEstimateTreatment>(
    preEstimateTreatment: T,
  ): RestOf<T> {
    return {
      ...preEstimateTreatment,
      createdDate: preEstimateTreatment.createdDate?.toJSON() ?? null,
      lastModifiedDate: preEstimateTreatment.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restPreEstimateTreatment: RestPreEstimateTreatment): IPreEstimateTreatment {
    return {
      ...restPreEstimateTreatment,
      createdDate: restPreEstimateTreatment.createdDate ? dayjs(restPreEstimateTreatment.createdDate) : undefined,
      lastModifiedDate: restPreEstimateTreatment.lastModifiedDate ? dayjs(restPreEstimateTreatment.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPreEstimateTreatment>): HttpResponse<IPreEstimateTreatment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPreEstimateTreatment[]>): HttpResponse<IPreEstimateTreatment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
