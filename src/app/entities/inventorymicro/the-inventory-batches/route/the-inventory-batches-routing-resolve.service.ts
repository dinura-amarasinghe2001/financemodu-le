import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITheInventoryBatches } from '../the-inventory-batches.model';
import { TheInventoryBatchesService } from '../service/the-inventory-batches.service';

const theInventoryBatchesResolve = (route: ActivatedRouteSnapshot): Observable<null | ITheInventoryBatches> => {
  const id = route.params.id;
  if (id) {
    return inject(TheInventoryBatchesService)
      .find(id)
      .pipe(
        mergeMap((theInventoryBatches: HttpResponse<ITheInventoryBatches>) => {
          if (theInventoryBatches.body) {
            return of(theInventoryBatches.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default theInventoryBatchesResolve;
