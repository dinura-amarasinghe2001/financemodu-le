import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInsuranceRegistry } from '../insurance-registry.model';
import { InsuranceRegistryService } from '../service/insurance-registry.service';

const insuranceRegistryResolve = (route: ActivatedRouteSnapshot): Observable<null | IInsuranceRegistry> => {
  const id = route.params.id;
  if (id) {
    return inject(InsuranceRegistryService)
      .find(id)
      .pipe(
        mergeMap((insuranceRegistry: HttpResponse<IInsuranceRegistry>) => {
          if (insuranceRegistry.body) {
            return of(insuranceRegistry.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default insuranceRegistryResolve;
