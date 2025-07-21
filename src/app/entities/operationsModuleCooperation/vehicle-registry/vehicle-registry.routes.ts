import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import VehicleRegistryResolve from './route/vehicle-registry-routing-resolve.service';

const vehicleRegistryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vehicle-registry.component').then(m => m.VehicleRegistryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/vehicle-registry-detail.component').then(m => m.VehicleRegistryDetailComponent),
    resolve: {
      vehicleRegistry: VehicleRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/vehicle-registry-update.component').then(m => m.VehicleRegistryUpdateComponent),
    resolve: {
      vehicleRegistry: VehicleRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/vehicle-registry-update.component').then(m => m.VehicleRegistryUpdateComponent),
    resolve: {
      vehicleRegistry: VehicleRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vehicleRegistryRoute;
