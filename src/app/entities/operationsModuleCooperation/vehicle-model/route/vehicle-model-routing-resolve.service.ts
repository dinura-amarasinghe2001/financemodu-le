import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehicleModel } from '../vehicle-model.model';
import { VehicleModelService } from '../service/vehicle-model.service';

const vehicleModelResolve = (route: ActivatedRouteSnapshot): Observable<null | IVehicleModel> => {
  const id = route.params.id;
  if (id) {
    return inject(VehicleModelService)
      .find(id)
      .pipe(
        mergeMap((vehicleModel: HttpResponse<IVehicleModel>) => {
          if (vehicleModel.body) {
            return of(vehicleModel.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default vehicleModelResolve;
