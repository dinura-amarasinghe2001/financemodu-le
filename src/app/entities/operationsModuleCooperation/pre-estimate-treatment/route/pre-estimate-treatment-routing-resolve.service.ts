import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPreEstimateTreatment } from '../pre-estimate-treatment.model';
import { PreEstimateTreatmentService } from '../service/pre-estimate-treatment.service';

const preEstimateTreatmentResolve = (route: ActivatedRouteSnapshot): Observable<null | IPreEstimateTreatment> => {
  const id = route.params.id;
  if (id) {
    return inject(PreEstimateTreatmentService)
      .find(id)
      .pipe(
        mergeMap((preEstimateTreatment: HttpResponse<IPreEstimateTreatment>) => {
          if (preEstimateTreatment.body) {
            return of(preEstimateTreatment.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default preEstimateTreatmentResolve;
