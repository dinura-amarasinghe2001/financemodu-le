import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBinCard } from '../bin-card.model';
import { BinCardService } from '../service/bin-card.service';

const binCardResolve = (route: ActivatedRouteSnapshot): Observable<null | IBinCard> => {
  const id = route.params.id;
  if (id) {
    return inject(BinCardService)
      .find(id)
      .pipe(
        mergeMap((binCard: HttpResponse<IBinCard>) => {
          if (binCard.body) {
            return of(binCard.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default binCardResolve;
