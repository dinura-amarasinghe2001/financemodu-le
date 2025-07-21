import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IGRNLines, NewGRNLines } from '../grn-lines.model';

export type PartialUpdateGRNLines = Partial<IGRNLines> & Pick<IGRNLines, 'id'>;

type RestOf<T extends IGRNLines | NewGRNLines> = Omit<T, 'lmd'> & {
  lmd?: string | null;
};

export type RestGRNLines = RestOf<IGRNLines>;

export type NewRestGRNLines = RestOf<NewGRNLines>;

export type PartialUpdateRestGRNLines = RestOf<PartialUpdateGRNLines>;

export type EntityResponseType = HttpResponse<IGRNLines>;
export type EntityArrayResponseType = HttpResponse<IGRNLines[]>;

@Injectable({ providedIn: 'root' })
export class GRNLinesService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grn-lines', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/grn-lines/_search', 'inventorymicro');

  create(gRNLines: NewGRNLines): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRNLines);
    return this.http
      .post<RestGRNLines>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(gRNLines: IGRNLines): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRNLines);
    return this.http
      .put<RestGRNLines>(`${this.resourceUrl}/${this.getGRNLinesIdentifier(gRNLines)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(gRNLines: PartialUpdateGRNLines): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(gRNLines);
    return this.http
      .patch<RestGRNLines>(`${this.resourceUrl}/${this.getGRNLinesIdentifier(gRNLines)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGRNLines>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGRNLines[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestGRNLines[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IGRNLines[]>()], asapScheduler)),
    );
  }

  getGRNLinesIdentifier(gRNLines: Pick<IGRNLines, 'id'>): number {
    return gRNLines.id;
  }

  compareGRNLines(o1: Pick<IGRNLines, 'id'> | null, o2: Pick<IGRNLines, 'id'> | null): boolean {
    return o1 && o2 ? this.getGRNLinesIdentifier(o1) === this.getGRNLinesIdentifier(o2) : o1 === o2;
  }

  addGRNLinesToCollectionIfMissing<Type extends Pick<IGRNLines, 'id'>>(
    gRNLinesCollection: Type[],
    ...gRNLinesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gRNLines: Type[] = gRNLinesToCheck.filter(isPresent);
    if (gRNLines.length > 0) {
      const gRNLinesCollectionIdentifiers = gRNLinesCollection.map(gRNLinesItem => this.getGRNLinesIdentifier(gRNLinesItem));
      const gRNLinesToAdd = gRNLines.filter(gRNLinesItem => {
        const gRNLinesIdentifier = this.getGRNLinesIdentifier(gRNLinesItem);
        if (gRNLinesCollectionIdentifiers.includes(gRNLinesIdentifier)) {
          return false;
        }
        gRNLinesCollectionIdentifiers.push(gRNLinesIdentifier);
        return true;
      });
      return [...gRNLinesToAdd, ...gRNLinesCollection];
    }
    return gRNLinesCollection;
  }

  protected convertDateFromClient<T extends IGRNLines | NewGRNLines | PartialUpdateGRNLines>(gRNLines: T): RestOf<T> {
    return {
      ...gRNLines,
      lmd: gRNLines.lmd?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restGRNLines: RestGRNLines): IGRNLines {
    return {
      ...restGRNLines,
      lmd: restGRNLines.lmd ? dayjs(restGRNLines.lmd) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGRNLines>): HttpResponse<IGRNLines> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGRNLines[]>): HttpResponse<IGRNLines[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
