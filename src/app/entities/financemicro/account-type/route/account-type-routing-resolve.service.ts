import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccountType } from '../account-type.model';
import { AccountTypeService } from '../service/account-type.service';

const accountTypeResolve = (route: ActivatedRouteSnapshot): Observable<null | IAccountType> => {
  const id = route.params.id;
  if (id) {
    return inject(AccountTypeService)
      .find(id)
      .pipe(
        mergeMap((accountType: HttpResponse<IAccountType>) => {
          if (accountType.body) {
            return of(accountType.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default accountTypeResolve;
