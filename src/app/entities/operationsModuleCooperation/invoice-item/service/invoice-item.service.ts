import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IInvoiceItem, NewInvoiceItem } from '../invoice-item.model';

export type PartialUpdateInvoiceItem = Partial<IInvoiceItem> & Pick<IInvoiceItem, 'id'>;

type RestOf<T extends IInvoiceItem | NewInvoiceItem> = Omit<T, 'invoiceDate'> & {
  invoiceDate?: string | null;
};

export type RestInvoiceItem = RestOf<IInvoiceItem>;

export type NewRestInvoiceItem = RestOf<NewInvoiceItem>;

export type PartialUpdateRestInvoiceItem = RestOf<PartialUpdateInvoiceItem>;

export type EntityResponseType = HttpResponse<IInvoiceItem>;
export type EntityArrayResponseType = HttpResponse<IInvoiceItem[]>;

@Injectable({ providedIn: 'root' })
export class InvoiceItemService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoice-items', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/invoice-items/_search', 'operationsmodule');

  create(invoiceItem: NewInvoiceItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceItem);
    return this.http
      .post<RestInvoiceItem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(invoiceItem: IInvoiceItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceItem);
    return this.http
      .put<RestInvoiceItem>(`${this.resourceUrl}/${this.getInvoiceItemIdentifier(invoiceItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(invoiceItem: PartialUpdateInvoiceItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoiceItem);
    return this.http
      .patch<RestInvoiceItem>(`${this.resourceUrl}/${this.getInvoiceItemIdentifier(invoiceItem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInvoiceItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInvoiceItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestInvoiceItem[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IInvoiceItem[]>()], asapScheduler)),
    );
  }

  getInvoiceItemIdentifier(invoiceItem: Pick<IInvoiceItem, 'id'>): number {
    return invoiceItem.id;
  }

  compareInvoiceItem(o1: Pick<IInvoiceItem, 'id'> | null, o2: Pick<IInvoiceItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoiceItemIdentifier(o1) === this.getInvoiceItemIdentifier(o2) : o1 === o2;
  }

  addInvoiceItemToCollectionIfMissing<Type extends Pick<IInvoiceItem, 'id'>>(
    invoiceItemCollection: Type[],
    ...invoiceItemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoiceItems: Type[] = invoiceItemsToCheck.filter(isPresent);
    if (invoiceItems.length > 0) {
      const invoiceItemCollectionIdentifiers = invoiceItemCollection.map(invoiceItemItem => this.getInvoiceItemIdentifier(invoiceItemItem));
      const invoiceItemsToAdd = invoiceItems.filter(invoiceItemItem => {
        const invoiceItemIdentifier = this.getInvoiceItemIdentifier(invoiceItemItem);
        if (invoiceItemCollectionIdentifiers.includes(invoiceItemIdentifier)) {
          return false;
        }
        invoiceItemCollectionIdentifiers.push(invoiceItemIdentifier);
        return true;
      });
      return [...invoiceItemsToAdd, ...invoiceItemCollection];
    }
    return invoiceItemCollection;
  }

  protected convertDateFromClient<T extends IInvoiceItem | NewInvoiceItem | PartialUpdateInvoiceItem>(invoiceItem: T): RestOf<T> {
    return {
      ...invoiceItem,
      invoiceDate: invoiceItem.invoiceDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInvoiceItem: RestInvoiceItem): IInvoiceItem {
    return {
      ...restInvoiceItem,
      invoiceDate: restInvoiceItem.invoiceDate ? dayjs(restInvoiceItem.invoiceDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInvoiceItem>): HttpResponse<IInvoiceItem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInvoiceItem[]>): HttpResponse<IInvoiceItem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
