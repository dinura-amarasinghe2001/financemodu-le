import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJobCard } from '../job-card.model';
import { JobCardService } from '../service/job-card.service';

const jobCardResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobCard> => {
  const id = route.params.id;
  if (id) {
    return inject(JobCardService)
      .find(id)
      .pipe(
        mergeMap((jobCard: HttpResponse<IJobCard>) => {
          if (jobCard.body) {
            return of(jobCard.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default jobCardResolve;
