import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, map, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IInvoicePayments, NewInvoicePayments } from '../invoice-payments.model';

export type PartialUpdateInvoicePayments = Partial<IInvoicePayments> & Pick<IInvoicePayments, 'id'>;

type RestOf<T extends IInvoicePayments | NewInvoicePayments> = Omit<T, 'createdDate' | 'lastModifiedDate'> & {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
};

export type RestInvoicePayments = RestOf<IInvoicePayments>;

export type NewRestInvoicePayments = RestOf<NewInvoicePayments>;

export type PartialUpdateRestInvoicePayments = RestOf<PartialUpdateInvoicePayments>;

export type EntityResponseType = HttpResponse<IInvoicePayments>;
export type EntityArrayResponseType = HttpResponse<IInvoicePayments[]>;

@Injectable({ providedIn: 'root' })
export class InvoicePaymentsService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/invoice-payments', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/invoice-payments/_search', 'operationsmodule');

  create(invoicePayments: NewInvoicePayments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoicePayments);
    return this.http
      .post<RestInvoicePayments>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(invoicePayments: IInvoicePayments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoicePayments);
    return this.http
      .put<RestInvoicePayments>(`${this.resourceUrl}/${this.getInvoicePaymentsIdentifier(invoicePayments)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(invoicePayments: PartialUpdateInvoicePayments): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(invoicePayments);
    return this.http
      .patch<RestInvoicePayments>(`${this.resourceUrl}/${this.getInvoicePaymentsIdentifier(invoicePayments)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInvoicePayments>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInvoicePayments[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<RestInvoicePayments[]>(this.resourceSearchUrl, { params: options, observe: 'response' }).pipe(
      map(res => this.convertResponseArrayFromServer(res)),

      catchError(() => scheduled([new HttpResponse<IInvoicePayments[]>()], asapScheduler)),
    );
  }

  getInvoicePaymentsIdentifier(invoicePayments: Pick<IInvoicePayments, 'id'>): number {
    return invoicePayments.id;
  }

  compareInvoicePayments(o1: Pick<IInvoicePayments, 'id'> | null, o2: Pick<IInvoicePayments, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvoicePaymentsIdentifier(o1) === this.getInvoicePaymentsIdentifier(o2) : o1 === o2;
  }

  addInvoicePaymentsToCollectionIfMissing<Type extends Pick<IInvoicePayments, 'id'>>(
    invoicePaymentsCollection: Type[],
    ...invoicePaymentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const invoicePayments: Type[] = invoicePaymentsToCheck.filter(isPresent);
    if (invoicePayments.length > 0) {
      const invoicePaymentsCollectionIdentifiers = invoicePaymentsCollection.map(invoicePaymentsItem =>
        this.getInvoicePaymentsIdentifier(invoicePaymentsItem),
      );
      const invoicePaymentsToAdd = invoicePayments.filter(invoicePaymentsItem => {
        const invoicePaymentsIdentifier = this.getInvoicePaymentsIdentifier(invoicePaymentsItem);
        if (invoicePaymentsCollectionIdentifiers.includes(invoicePaymentsIdentifier)) {
          return false;
        }
        invoicePaymentsCollectionIdentifiers.push(invoicePaymentsIdentifier);
        return true;
      });
      return [...invoicePaymentsToAdd, ...invoicePaymentsCollection];
    }
    return invoicePaymentsCollection;
  }

  protected convertDateFromClient<T extends IInvoicePayments | NewInvoicePayments | PartialUpdateInvoicePayments>(
    invoicePayments: T,
  ): RestOf<T> {
    return {
      ...invoicePayments,
      createdDate: invoicePayments.createdDate?.toJSON() ?? null,
      lastModifiedDate: invoicePayments.lastModifiedDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restInvoicePayments: RestInvoicePayments): IInvoicePayments {
    return {
      ...restInvoicePayments,
      createdDate: restInvoicePayments.createdDate ? dayjs(restInvoicePayments.createdDate) : undefined,
      lastModifiedDate: restInvoicePayments.lastModifiedDate ? dayjs(restInvoicePayments.lastModifiedDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInvoicePayments>): HttpResponse<IInvoicePayments> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInvoicePayments[]>): HttpResponse<IInvoicePayments[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
