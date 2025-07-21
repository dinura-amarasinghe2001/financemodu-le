import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInventoryBatches } from '../inventory-batches.model';
import { InventoryBatchesService } from '../service/inventory-batches.service';

const inventoryBatchesResolve = (route: ActivatedRouteSnapshot): Observable<null | IInventoryBatches> => {
  const id = route.params.id;
  if (id) {
    return inject(InventoryBatchesService)
      .find(id)
      .pipe(
        mergeMap((inventoryBatches: HttpResponse<IInventoryBatches>) => {
          if (inventoryBatches.body) {
            return of(inventoryBatches.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default inventoryBatchesResolve;
