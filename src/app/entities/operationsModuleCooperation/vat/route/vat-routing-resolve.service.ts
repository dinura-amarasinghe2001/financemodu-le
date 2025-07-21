import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVat } from '../vat.model';
import { VatService } from '../service/vat.service';

const vatResolve = (route: ActivatedRouteSnapshot): Observable<null | IVat> => {
  const id = route.params.id;
  if (id) {
    return inject(VatService)
      .find(id)
      .pipe(
        mergeMap((vat: HttpResponse<IVat>) => {
          if (vat.body) {
            return of(vat.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default vatResolve;
