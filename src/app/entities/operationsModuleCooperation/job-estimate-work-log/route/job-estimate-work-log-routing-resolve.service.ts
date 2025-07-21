import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobEstimateWorkLog } from '../job-estimate-work-log.model';
import { JobEstimateWorkLogService } from '../service/job-estimate-work-log.service';

const jobEstimateWorkLogResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobEstimateWorkLog> => {
  const id = route.params.id;
  if (id) {
    return inject(JobEstimateWorkLogService)
      .find(id)
      .pipe(
        mergeMap((jobEstimateWorkLog: HttpResponse<IJobEstimateWorkLog>) => {
          if (jobEstimateWorkLog.body) {
            return of(jobEstimateWorkLog.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jobEstimateWorkLogResolve;
