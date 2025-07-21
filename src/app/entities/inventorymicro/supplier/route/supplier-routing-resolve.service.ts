import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISupplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';

const supplierResolve = (route: ActivatedRouteSnapshot): Observable<null | ISupplier> => {
  const id = route.params.id;
  if (id) {
    return inject(SupplierService)
      .find(id)
      .pipe(
        mergeMap((supplier: HttpResponse<ISupplier>) => {
          if (supplier.body) {
            return of(supplier.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default supplierResolve;
