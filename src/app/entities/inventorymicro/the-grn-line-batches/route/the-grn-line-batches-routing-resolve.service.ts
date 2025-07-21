import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITheGRNLineBatches } from '../the-grn-line-batches.model';
import { TheGRNLineBatchesService } from '../service/the-grn-line-batches.service';

const theGRNLineBatchesResolve = (route: ActivatedRouteSnapshot): Observable<null | ITheGRNLineBatches> => {
  const id = route.params.id;
  if (id) {
    return inject(TheGRNLineBatchesService)
      .find(id)
      .pipe(
        mergeMap((theGRNLineBatches: HttpResponse<ITheGRNLineBatches>) => {
          if (theGRNLineBatches.body) {
            return of(theGRNLineBatches.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default theGRNLineBatchesResolve;
