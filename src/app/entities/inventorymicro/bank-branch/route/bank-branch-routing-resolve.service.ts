import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBankBranch } from '../bank-branch.model';
import { BankBranchService } from '../service/bank-branch.service';

const bankBranchResolve = (route: ActivatedRouteSnapshot): Observable<null | IBankBranch> => {
  const id = route.params.id;
  if (id) {
    return inject(BankBranchService)
      .find(id)
      .pipe(
        mergeMap((bankBranch: HttpResponse<IBankBranch>) => {
          if (bankBranch.body) {
            return of(bankBranch.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default bankBranchResolve;
