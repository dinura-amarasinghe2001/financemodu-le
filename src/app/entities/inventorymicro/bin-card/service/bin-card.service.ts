import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IBinCard, NewBinCard } from '../bin-card.model';

export type PartialUpdateBinCard = Partial<IBinCard> & Pick<IBinCard, 'id'>;

type RestOf<T extends IBinCard | NewBinCard> = Omit<T, 'txDate' | 'lmd' | 'recordDate'> & {
  txDate?: string | null;
  lmd?: string | null;
  recordDate?: string | null;
};

export type RestBinCard = RestOf<IBinCard>;

export type NewRestBinCard = RestOf<NewBinCard>;

export type PartialUpdateRestBinCard = RestOf<PartialUpdateBinCard>;

export type EntityResponseType = HttpResponse<IBinCard>;
export type EntityArrayResponseType = HttpResponse<IBinCard[]>;

@Injectable({ providedIn: 'root' })
export class BinCardService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bin-cards', 'inventorymicro');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/bin-cards/_search', 'inventorymicro');

  create(binCard: NewBinCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(binCard);
    return this.http
      .post<RestBinCard>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(binCard: IBinCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(binCard);
    return this.http
      .put<RestBinCard>(`${this.resourceUrl}/${this.getBinCardIdentifier(binCard)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(binCard: PartialUpdateBinCard): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(binCard);
    return this.http
      .patch<RestBinCard>(`${this.resourceUrl}/${this.getBinCardIdentifier(binCard)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBinCard>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBinCard[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestBinCard[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IBinCard[]>()], asapScheduler)),
    );
  }

  getBinCardIdentifier(binCard: Pick<IBinCard, 'id'>): number {
    return binCard.id;
  }

  compareBinCard(o1: Pick<IBinCard, 'id'> | null, o2: Pick<IBinCard, 'id'> | null): boolean {
    return o1 && o2 ? this.getBinCardIdentifier(o1) === this.getBinCardIdentifier(o2) : o1 === o2;
  }

  addBinCardToCollectionIfMissing<Type extends Pick<IBinCard, 'id'>>(
    binCardCollection: Type[],
    ...binCardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const binCards: Type[] = binCardsToCheck.filter(isPresent);
    if (binCards.length > 0) {
      const binCardCollectionIdentifiers = binCardCollection.map(binCardItem => this.getBinCardIdentifier(binCardItem));
      const binCardsToAdd = binCards.filter(binCardItem => {
        const binCardIdentifier = this.getBinCardIdentifier(binCardItem);
        if (binCardCollectionIdentifiers.includes(binCardIdentifier)) {
          return false;
        }
        binCardCollectionIdentifiers.push(binCardIdentifier);
        return true;
      });
      return [...binCardsToAdd, ...binCardCollection];
    }
    return binCardCollection;
  }

  protected convertDateFromClient<T extends IBinCard | NewBinCard | PartialUpdateBinCard>(binCard: T): RestOf<T> {
    return {
      ...binCard,
      txDate: binCard.txDate?.toJSON() ?? null,
      lmd: binCard.lmd?.toJSON() ?? null,
      recordDate: binCard.recordDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBinCard: RestBinCard): IBinCard {
    return {
      ...restBinCard,
      txDate: restBinCard.txDate ? dayjs(restBinCard.txDate) : undefined,
      lmd: restBinCard.lmd ? dayjs(restBinCard.lmd) : undefined,
      recordDate: restBinCard.recordDate ? dayjs(restBinCard.recordDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBinCard>): HttpResponse<IBinCard> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBinCard[]>): HttpResponse<IBinCard[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
