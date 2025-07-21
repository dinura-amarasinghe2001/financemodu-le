import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PreEstimateResolve from './route/pre-estimate-routing-resolve.service';

const preEstimateRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pre-estimate.component').then(m => m.PreEstimateComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pre-estimate-detail.component').then(m => m.PreEstimateDetailComponent),
    resolve: {
      preEstimate: PreEstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pre-estimate-update.component').then(m => m.PreEstimateUpdateComponent),
    resolve: {
      preEstimate: PreEstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pre-estimate-update.component').then(m => m.PreEstimateUpdateComponent),
    resolve: {
      preEstimate: PreEstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default preEstimateRoute;
