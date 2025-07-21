import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOperationalUnit } from '../operational-unit.model';
import { OperationalUnitService } from '../service/operational-unit.service';

const operationalUnitResolve = (route: ActivatedRouteSnapshot): Observable<null | IOperationalUnit> => {
  const id = route.params.id;
  if (id) {
    return inject(OperationalUnitService)
      .find(id)
      .pipe(
        mergeMap((operationalUnit: HttpResponse<IOperationalUnit>) => {
          if (operationalUnit.body) {
            return of(operationalUnit.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default operationalUnitResolve;
