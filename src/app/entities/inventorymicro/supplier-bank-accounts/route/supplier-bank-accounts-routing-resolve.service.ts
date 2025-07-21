import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISupplierBankAccounts } from '../supplier-bank-accounts.model';
import { SupplierBankAccountsService } from '../service/supplier-bank-accounts.service';

const supplierBankAccountsResolve = (route: ActivatedRouteSnapshot): Observable<null | ISupplierBankAccounts> => {
  const id = route.params.id;
  if (id) {
    return inject(SupplierBankAccountsService)
      .find(id)
      .pipe(
        mergeMap((supplierBankAccounts: HttpResponse<ISupplierBankAccounts>) => {
          if (supplierBankAccounts.body) {
            return of(supplierBankAccounts.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default supplierBankAccountsResolve;
