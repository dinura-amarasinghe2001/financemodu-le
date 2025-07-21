import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobEstimate } from '../job-estimate.model';
import { JobEstimateService } from '../service/job-estimate.service';

const jobEstimateResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobEstimate> => {
  const id = route.params.id;
  if (id) {
    return inject(JobEstimateService)
      .find(id)
      .pipe(
        mergeMap((jobEstimate: HttpResponse<IJobEstimate>) => {
          if (jobEstimate.body) {
            return of(jobEstimate.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jobEstimateResolve;
