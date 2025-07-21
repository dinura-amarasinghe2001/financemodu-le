import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IGatePass, NewGatePass } from '../gate-pass.model';

export type PartialUpdateGatePass = Partial<IGatePass> & Pick<IGatePass, 'id'>;

type RestOf<T extends IGatePass | NewGatePass> = Omit<T, 'entryDateTime' | 'createdDate' | 'lastModifiedDate'> & {
  entryDateTime?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestGatePass = RestOf<IGatePass>;

export type NewRestGatePass = RestOf<NewGatePass>;

export type PartialUpdateRestGatePass = RestOf<PartialUpdateGatePass>;

export type EntityResponseType = HttpResponse<IGatePass>;
export type EntityArrayResponseType = HttpResponse<IGatePass[]>;

@Injectable({ providedIn: 'root' })
export class GatePassService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/gate-passes', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/gate-passes/_search', 'operationsmodule');

  create(gatePass: NewGatePass): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gatePass);
    return this.http
      .post<RestGatePass>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gatePass: IGatePass): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gatePass);
    return this.http
      .put<RestGatePass>(`${this.resourceUrl}/${this.getGatePassIdentifier(gatePass)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gatePass: PartialUpdateGatePass): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gatePass);
    return this.http
      .patch<RestGatePass>(`${this.resourceUrl}/${this.getGatePassIdentifier(gatePass)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGatePass>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGatePass[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestGatePass[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IGatePass[]>()], asapScheduler)),
    );
  }

  getGatePassIdentifier(gatePass: Pick<IGatePass, 'id'>): number {
    return gatePass.id;
  }

  compareGatePass(o1: Pick<IGatePass, 'id'> | null, o2: Pick<IGatePass, 'id'> | null): boolean {
    return o1 && o2 ? this.getGatePassIdentifier(o1) === this.getGatePassIdentifier(o2) : o1 === o2;
  }

  addGatePassToCollectionIfMissing<Type extends Pick<IGatePass, 'id'>>(
    gatePassCollection: Type[],
    ...gatePassesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gatePasses: Type[] = gatePassesToCheck.filter(isPresent);
    if (gatePasses.length > 0) {
      const gatePassCollectionIdentifiers = gatePassCollection.map(gatePassItem => this.getGatePassIdentifier(gatePassItem));
      const gatePassesToAdd = gatePasses.filter(gatePassItem => {
        const gatePassIdentifier = this.getGatePassIdentifier(gatePassItem);
        if (gatePassCollectionIdentifiers.includes(gatePassIdentifier)) {
          return false;
        }
        gatePassCollectionIdentifiers.push(gatePassIdentifier);
        return true;
      });
      return [...gatePassesToAdd, ...gatePassCollection];
    }
    return gatePassCollection;
  }

  protected convertDateFromClient<T extends IGatePass | NewGatePass | PartialUpdateGatePass>(gatePass: T): RestOf<T> {
    return {
      ...gatePass,
      entryDateTime: gatePass.entryDateTime?.toJSON() ?? null,
      createdDate: gatePass.createdDate?.toJSON() ?? null,
      lastModifiedDate: gatePass.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGatePass: RestGatePass): IGatePass {
    return {
      ...restGatePass,
      entryDateTime: restGatePass.entryDateTime ? dayjs(restGatePass.entryDateTime) : undefined,
      createdDate: restGatePass.createdDate ? dayjs(restGatePass.createdDate) : undefined,
      lastModifiedDate: restGatePass.lastModifiedDate ? dayjs(restGatePass.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGatePass>): HttpResponse<IGatePass> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGatePass[]>): HttpResponse<IGatePass[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
