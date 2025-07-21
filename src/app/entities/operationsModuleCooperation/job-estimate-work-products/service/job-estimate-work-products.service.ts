import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, asapScheduler, scheduled } from 'rxjs';

import { catchError } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { SearchWithPagination } from 'app/core/request/request.model';
import { IJobEstimateWorkProducts, NewJobEstimateWorkProducts } from '../job-estimate-work-products.model';

export type PartialUpdateJobEstimateWorkProducts = Partial<IJobEstimateWorkProducts> & Pick<IJobEstimateWorkProducts, 'id'>;

export type EntityResponseType = HttpResponse<IJobEstimateWorkProducts>;
export type EntityArrayResponseType = HttpResponse<IJobEstimateWorkProducts[]>;

@Injectable({ providedIn: 'root' })
export class JobEstimateWorkProductsService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/job-estimate-work-products', 'operationsmodule');
  protected resourceSearchUrl = this.applicationConfigService.getEndpointFor('api/job-estimate-work-products/_search', 'operationsmodule');

  create(jobEstimateWorkProducts: NewJobEstimateWorkProducts): Observable<EntityResponseType> {
    return this.http.post<IJobEstimateWorkProducts>(this.resourceUrl, jobEstimateWorkProducts, { observe: 'response' });
  }

  update(jobEstimateWorkProducts: IJobEstimateWorkProducts): Observable<EntityResponseType> {
    return this.http.put<IJobEstimateWorkProducts>(
      `${this.resourceUrl}/${this.getJobEstimateWorkProductsIdentifier(jobEstimateWorkProducts)}`,
      jobEstimateWorkProducts,
      { observe: 'response' },
    );
  }

  partialUpdate(jobEstimateWorkProducts: PartialUpdateJobEstimateWorkProducts): Observable<EntityResponseType> {
    return this.http.patch<IJobEstimateWorkProducts>(
      `${this.resourceUrl}/${this.getJobEstimateWorkProductsIdentifier(jobEstimateWorkProducts)}`,
      jobEstimateWorkProducts,
      { observe: 'response' },
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJobEstimateWorkProducts>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJobEstimateWorkProducts[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  search(req: SearchWithPagination): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IJobEstimateWorkProducts[]>(this.resourceSearchUrl, { params: options, observe: 'response' })
      .pipe(catchError(() => scheduled([new HttpResponse<IJobEstimateWorkProducts[]>()], asapScheduler)));
  }

  getJobEstimateWorkProductsIdentifier(jobEstimateWorkProducts: Pick<IJobEstimateWorkProducts, 'id'>): number {
    return jobEstimateWorkProducts.id;
  }

  compareJobEstimateWorkProducts(
    o1: Pick<IJobEstimateWorkProducts, 'id'> | null,
    o2: Pick<IJobEstimateWorkProducts, 'id'> | null,
  ): boolean {
    return o1 && o2 ? this.getJobEstimateWorkProductsIdentifier(o1) === this.getJobEstimateWorkProductsIdentifier(o2) : o1 === o2;
  }

  addJobEstimateWorkProductsToCollectionIfMissing<Type extends Pick<IJobEstimateWorkProducts, 'id'>>(
    jobEstimateWorkProductsCollection: Type[],
    ...jobEstimateWorkProductsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const jobEstimateWorkProducts: Type[] = jobEstimateWorkProductsToCheck.filter(isPresent);
    if (jobEstimateWorkProducts.length > 0) {
      const jobEstimateWorkProductsCollectionIdentifiers = jobEstimateWorkProductsCollection.map(jobEstimateWorkProductsItem =>
        this.getJobEstimateWorkProductsIdentifier(jobEstimateWorkProductsItem),
      );
      const jobEstimateWorkProductsToAdd = jobEstimateWorkProducts.filter(jobEstimateWorkProductsItem => {
        const jobEstimateWorkProductsIdentifier = this.getJobEstimateWorkProductsIdentifier(jobEstimateWorkProductsItem);
        if (jobEstimateWorkProductsCollectionIdentifiers.includes(jobEstimateWorkProductsIdentifier)) {
          return false;
        }
        jobEstimateWorkProductsCollectionIdentifiers.push(jobEstimateWorkProductsIdentifier);
        return true;
      });
      return [...jobEstimateWorkProductsToAdd, ...jobEstimateWorkProductsCollection];
    }
    return jobEstimateWorkProductsCollection;
  }
}
