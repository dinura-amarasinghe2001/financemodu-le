import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IVat, NewVat } from '../vat.model';

export type PartialUpdateVat = Partial<IVat> & Pick<IVat, 'id'>;

export type EntityResponseType = HttpResponse<IVat>;
export type EntityArrayResponseType = HttpResponse<IVat[]>;

@Injectable({ providedIn: 'root' })
export class VatService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vats', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/vats/_search', 'operationsmodule');

  create(vat: NewVat): Observable<EntityResponseType> {
    return this.http.post<IVat>(this.resourceUrl, vat, { observe: 'response' });
  }

  update(vat: IVat): Observable<EntityResponseType> {
    return this.http.put<IVat>(`${this.resourceUrl}/${this.getVatIdentifier(vat)}`, vat, { observe: 'response' });
  }

  partialUpdate(vat: PartialUpdateVat): Observable<EntityResponseType> {
    return this.http.patch<IVat>(`${this.resourceUrl}/${this.getVatIdentifier(vat)}`, vat, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVat>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVat[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVat[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(catchError(() => scheduled([new HttpResponse<IVat[]>()], asapScheduler)));
  }

  getVatIdentifier(vat: Pick<IVat, 'id'>): number {
    return vat.id;
  }

  compareVat(o1: Pick<IVat, 'id'> | null, o2: Pick<IVat, 'id'> | null): boolean {
    return o1 && o2 ? this.getVatIdentifier(o1) === this.getVatIdentifier(o2) : o1 === o2;
  }

  addVatToCollectionIfMissing<Type extends Pick<IVat, 'id'>>(vatCollection: Type[], ...vatsToCheck: (Type | null | undefined)[]): Type[] {
    const vats: Type[] = vatsToCheck.filter(isPresent);
    if (vats.length > 0) {
      const vatCollectionIdentifiers = vatCollection.map(vatItem => this.getVatIdentifier(vatItem));
      const vatsToAdd = vats.filter(vatItem => {
        const vatIdentifier = this.getVatIdentifier(vatItem);
        if (vatCollectionIdentifiers.includes(vatIdentifier)) {
          return false;
        }
        vatCollectionIdentifiers.push(vatIdentifier);
        return true;
      });
      return [...vatsToAdd, ...vatCollection];
    }
    return vatCollection;
  }
}
