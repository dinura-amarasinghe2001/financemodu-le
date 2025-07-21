import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstimateTreatment } from '../estimate-treatment.model';
import { EstimateTreatmentService } from '../service/estimate-treatment.service';

const estimateTreatmentResolve = (route: ActivatedRouteSnapshot): Observable<null | IEstimateTreatment> => {
  const id = route.params.id;
  if (id) {
    return inject(EstimateTreatmentService)
      .find(id)
      .pipe(
        mergeMap((estimateTreatment: HttpResponse<IEstimateTreatment>) => {
          if (estimateTreatment.body) {
            return of(estimateTreatment.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default estimateTreatmentResolve;
