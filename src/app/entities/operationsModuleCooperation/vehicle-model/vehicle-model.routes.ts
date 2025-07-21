import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import VehicleModelResolve from './route/vehicle-model-routing-resolve.service';

const vehicleModelRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vehicle-model.component').then(m => m.VehicleModelComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/vehicle-model-detail.component').then(m => m.VehicleModelDetailComponent),
    resolve: {
      vehicleModel: VehicleModelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/vehicle-model-update.component').then(m => m.VehicleModelUpdateComponent),
    resolve: {
      vehicleModel: VehicleModelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/vehicle-model-update.component').then(m => m.VehicleModelUpdateComponent),
    resolve: {
      vehicleModel: VehicleModelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vehicleModelRoute;
