import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import VehicleTreatmentRegistryResolve from './route/vehicle-treatment-registry-routing-resolve.service';

const vehicleTreatmentRegistryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/vehicle-treatment-registry.component').then(m => m.VehicleTreatmentRegistryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () =>
      import('./detail/vehicle-treatment-registry-detail.component').then(m => m.VehicleTreatmentRegistryDetailComponent),
    resolve: {
      vehicleTreatmentRegistry: VehicleTreatmentRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./update/vehicle-treatment-registry-update.component').then(m => m.VehicleTreatmentRegistryUpdateComponent),
    resolve: {
      vehicleTreatmentRegistry: VehicleTreatmentRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./update/vehicle-treatment-registry-update.component').then(m => m.VehicleTreatmentRegistryUpdateComponent),
    resolve: {
      vehicleTreatmentRegistry: VehicleTreatmentRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default vehicleTreatmentRegistryRoute;
