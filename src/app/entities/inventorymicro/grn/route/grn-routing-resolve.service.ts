import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGRN } from '../grn.model';
import { GRNService } from '../service/grn.service';

const gRNResolve = (route: ActivatedRouteSnapshot): Observable<null | IGRN> => {
  const id = route.params.id;
  if (id) {
    return inject(GRNService)
      .find(id)
      .pipe(
        mergeMap((gRN: HttpResponse<IGRN>) => {
          if (gRN.body) {
            return of(gRN.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gRNResolve;
