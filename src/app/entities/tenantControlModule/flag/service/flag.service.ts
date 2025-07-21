import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IFlag, NewFlag } from '../flag.model';

export type PartialUpdateFlag = Partial<IFlag> & Pick<IFlag, 'id'>;

type RestOf<T extends IFlag | NewFlag> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestFlag = RestOf<IFlag>;

export type NewRestFlag = RestOf<NewFlag>;

export type PartialUpdateRestFlag = RestOf<PartialUpdateFlag>;

export type EntityResponseType = HttpResponse<IFlag>;
export type EntityArrayResponseType = HttpResponse<IFlag[]>;

@Injectable({ providedIn: 'root' })
export class FlagService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/flags', 'tenantcontrolmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/flags/_search', 'tenantcontrolmodule');

  create(flag: NewFlag): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(flag);
    return this.http.post<RestFlag>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(flag: IFlag): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(flag);
    return this.http
      .put<RestFlag>(`${this.resourceUrl}/${this.getFlagIdentifier(flag)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(flag: PartialUpdateFlag): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(flag);
    return this.http
      .patch<RestFlag>(`${this.resourceUrl}/${this.getFlagIdentifier(flag)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFlag>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFlag[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestFlag[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IFlag[]>()], asapScheduler)),
    );
  }

  getFlagIdentifier(flag: Pick<IFlag, 'id'>): number {
    return flag.id;
  }

  compareFlag(o1: Pick<IFlag, 'id'> | null, o2: Pick<IFlag, 'id'> | null): boolean {
    return o1 && o2 ? this.getFlagIdentifier(o1) === this.getFlagIdentifier(o2) : o1 === o2;
  }

  addFlagToCollectionIfMissing<Type extends Pick<IFlag, 'id'>>(
    flagCollection: Type[],
    ...flagsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const flags: Type[] = flagsToCheck.filter(isPresent);
    if (flags.length > 0) {
      const flagCollectionIdentifiers = flagCollection.map(flagItem => this.getFlagIdentifier(flagItem));
      const flagsToAdd = flags.filter(flagItem => {
        const flagIdentifier = this.getFlagIdentifier(flagItem);
        if (flagCollectionIdentifiers.includes(flagIdentifier)) {
          return false;
        }
        flagCollectionIdentifiers.push(flagIdentifier);
        return true;
      });
      return [...flagsToAdd, ...flagCollection];
    }
    return flagCollection;
  }

  protected convertDateFromClient<T extends IFlag | NewFlag | PartialUpdateFlag>(flag: T): RestOf<T> {
    return {
      ...flag,
      createdDate: flag.createdDate?.toJSON() ?? null,
      lastModifiedDate: flag.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFlag: RestFlag): IFlag {
    return {
      ...restFlag,
      createdDate: restFlag.createdDate ? dayjs(restFlag.createdDate) : undefined,
      lastModifiedDate: restFlag.lastModifiedDate ? dayjs(restFlag.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFlag>): HttpResponse<IFlag> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFlag[]>): HttpResponse<IFlag[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
