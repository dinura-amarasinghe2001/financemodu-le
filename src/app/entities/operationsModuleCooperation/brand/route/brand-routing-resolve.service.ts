import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBrand } from '../brand.model';
import { BrandService } from '../service/brand.service';

const brandResolve = (route: ActivatedRouteSnapshot): Observable<null | IBrand> => {
  const id = route.params.id;
  if (id) {
    return inject(BrandService)
      .find(id)
      .pipe(
        mergeMap((brand: HttpResponse<IBrand>) => {
          if (brand.body) {
            return of(brand.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default brandResolve;
