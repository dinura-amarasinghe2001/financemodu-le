import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';
import { VehicleTreatmentRegistryService } from '../service/vehicle-treatment-registry.service';

const vehicleTreatmentRegistryResolve = (route: ActivatedRouteSnapshot): Observable<null | IVehicleTreatmentRegistry> => {
  const id = route.params.id;
  if (id) {
    return inject(VehicleTreatmentRegistryService)
      .find(id)
      .pipe(
        mergeMap((vehicleTreatmentRegistry: HttpResponse<IVehicleTreatmentRegistry>) => {
          if (vehicleTreatmentRegistry.body) {
            return of(vehicleTreatmentRegistry.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default vehicleTreatmentRegistryResolve;
