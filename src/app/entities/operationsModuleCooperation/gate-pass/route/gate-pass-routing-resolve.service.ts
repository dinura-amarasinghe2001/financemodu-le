import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGatePass } from '../gate-pass.model';
import { GatePassService } from '../service/gate-pass.service';

const gatePassResolve = (route: ActivatedRouteSnapshot): Observable<null | IGatePass> => {
  const id = route.params.id;
  if (id) {
    return inject(GatePassService)
      .find(id)
      .pipe(
        mergeMap((gatePass: HttpResponse<IGatePass>) => {
          if (gatePass.body) {
            return of(gatePass.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gatePassResolve;
