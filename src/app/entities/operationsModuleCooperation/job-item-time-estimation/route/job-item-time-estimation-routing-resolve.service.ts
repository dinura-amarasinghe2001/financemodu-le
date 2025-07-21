import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobItemTimeEstimation } from '../job-item-time-estimation.model';
import { JobItemTimeEstimationService } from '../service/job-item-time-estimation.service';

const jobItemTimeEstimationResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobItemTimeEstimation> => {
  const id = route.params.id;
  if (id) {
    return inject(JobItemTimeEstimationService)
      .find(id)
      .pipe(
        mergeMap((jobItemTimeEstimation: HttpResponse<IJobItemTimeEstimation>) => {
          if (jobItemTimeEstimation.body) {
            return of(jobItemTimeEstimation.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jobItemTimeEstimationResolve;
