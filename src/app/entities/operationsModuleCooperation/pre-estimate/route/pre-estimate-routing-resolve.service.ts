import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPreEstimate } from '../pre-estimate.model';
import { PreEstimateService } from '../service/pre-estimate.service';

const preEstimateResolve = (route: ActivatedRouteSnapshot): Observable<null | IPreEstimate> => {
  const id = route.params.id;
  if (id) {
    return inject(PreEstimateService)
      .find(id)
      .pipe(
        mergeMap((preEstimate: HttpResponse<IPreEstimate>) => {
          if (preEstimate.body) {
            return of(preEstimate.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default preEstimateResolve;
