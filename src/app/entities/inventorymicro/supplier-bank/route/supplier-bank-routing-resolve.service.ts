import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISupplierBank } from '../supplier-bank.model';
import { SupplierBankService } from '../service/supplier-bank.service';

const supplierBankResolve = (route: ActivatedRouteSnapshot): Observable<null | ISupplierBank> => {
  const id = route.params.id;
  if (id) {
    return inject(SupplierBankService)
      .find(id)
      .pipe(
        mergeMap((supplierBank: HttpResponse<ISupplierBank>) => {
          if (supplierBank.body) {
            return of(supplierBank.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default supplierBankResolve;
