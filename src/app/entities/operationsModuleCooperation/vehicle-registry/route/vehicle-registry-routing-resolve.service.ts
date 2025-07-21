import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicleRegistry } from '../vehicle-registry.model';
import { VehicleRegistryService } from '../service/vehicle-registry.service';

const vehicleRegistryResolve = (route: ActivatedRouteSnapshot): Observable<null | IVehicleRegistry> => {
  const id = route.params.id;
  if (id) {
    return inject(VehicleRegistryService)
      .find(id)
      .pipe(
        mergeMap((vehicleRegistry: HttpResponse<IVehicleRegistry>) => {
          if (vehicleRegistry.body) {
            return of(vehicleRegistry.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default vehicleRegistryResolve;
