import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobEstimateWorkProducts } from '../job-estimate-work-products.model';
import { JobEstimateWorkProductsService } from '../service/job-estimate-work-products.service';

const jobEstimateWorkProductsResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobEstimateWorkProducts> => {
  const id = route.params.id;
  if (id) {
    return inject(JobEstimateWorkProductsService)
      .find(id)
      .pipe(
        mergeMap((jobEstimateWorkProducts: HttpResponse<IJobEstimateWorkProducts>) => {
          if (jobEstimateWorkProducts.body) {
            return of(jobEstimateWorkProducts.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jobEstimateWorkProductsResolve;
