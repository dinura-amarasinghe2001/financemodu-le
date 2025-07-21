import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGRNLines } from '../grn-lines.model';
import { GRNLinesService } from '../service/grn-lines.service';

const gRNLinesResolve = (route: ActivatedRouteSnapshot): Observable<null | IGRNLines> => {
  const id = route.params.id;
  if (id) {
    return inject(GRNLinesService)
      .find(id)
      .pipe(
        mergeMap((gRNLines: HttpResponse<IGRNLines>) => {
          if (gRNLines.body) {
            return of(gRNLines.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gRNLinesResolve;
