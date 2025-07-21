import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EstimateResolve from './route/estimate-routing-resolve.service';

const estimateRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/estimate.component').then(m => m.EstimateComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/estimate-detail.component').then(m => m.EstimateDetailComponent),
    resolve: {
      estimate: EstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/estimate-update.component').then(m => m.EstimateUpdateComponent),
    resolve: {
      estimate: EstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/estimate-update.component').then(m => m.EstimateUpdateComponent),
    resolve: {
      estimate: EstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default estimateRoute;
