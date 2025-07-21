import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import InsuranceRegistryResolve from './route/insurance-registry-routing-resolve.service';

const insuranceRegistryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/insurance-registry.component').then(m => m.InsuranceRegistryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/insurance-registry-detail.component').then(m => m.InsuranceRegistryDetailComponent),
    resolve: {
      insuranceRegistry: InsuranceRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/insurance-registry-update.component').then(m => m.InsuranceRegistryUpdateComponent),
    resolve: {
      insuranceRegistry: InsuranceRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/insurance-registry-update.component').then(m => m.InsuranceRegistryUpdateComponent),
    resolve: {
      insuranceRegistry: InsuranceRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default insuranceRegistryRoute;
