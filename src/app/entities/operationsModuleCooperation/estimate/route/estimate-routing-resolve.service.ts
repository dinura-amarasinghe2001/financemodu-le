import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstimate } from '../estimate.model';
import { EstimateService } from '../service/estimate.service';

const estimateResolve = (route: ActivatedRouteSnapshot): Observable<null | IEstimate> => {
  const id = route.params.id;
  if (id) {
    return inject(EstimateService)
      .find(id)
      .pipe(
        mergeMap((estimate: HttpResponse<IEstimate>) => {
          if (estimate.body) {
            return of(estimate.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default estimateResolve;
