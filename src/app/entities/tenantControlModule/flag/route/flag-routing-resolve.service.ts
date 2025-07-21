import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFlag } from '../flag.model';
import { FlagService } from '../service/flag.service';

const flagResolve = (route: ActivatedRouteSnapshot): Observable<null | IFlag> => {
  const id = route.params.id;
  if (id) {
    return inject(FlagService)
      .find(id)
      .pipe(
        mergeMap((flag: HttpResponse<IFlag>) => {
          if (flag.body) {
            return of(flag.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default flagResolve;
