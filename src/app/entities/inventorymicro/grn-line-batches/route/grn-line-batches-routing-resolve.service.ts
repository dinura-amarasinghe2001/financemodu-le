import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGRNLineBatches } from '../grn-line-batches.model';
import { GRNLineBatchesService } from '../service/grn-line-batches.service';

const gRNLineBatchesResolve = (route: ActivatedRouteSnapshot): Observable<null | IGRNLineBatches> => {
  const id = route.params.id;
  if (id) {
    return inject(GRNLineBatchesService)
      .find(id)
      .pipe(
        mergeMap((gRNLineBatches: HttpResponse<IGRNLineBatches>) => {
          if (gRNLineBatches.body) {
            return of(gRNLineBatches.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default gRNLineBatchesResolve;
