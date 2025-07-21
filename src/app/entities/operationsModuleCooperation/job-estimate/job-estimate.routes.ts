import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import JobEstimateResolve from './route/job-estimate-routing-resolve.service';

const jobEstimateRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/job-estimate.component').then(m => m.JobEstimateComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/job-estimate-detail.component').then(m => m.JobEstimateDetailComponent),
    resolve: {
      jobEstimate: JobEstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/job-estimate-update.component').then(m => m.JobEstimateUpdateComponent),
    resolve: {
      jobEstimate: JobEstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/job-estimate-update.component').then(m => m.JobEstimateUpdateComponent),
    resolve: {
      jobEstimate: JobEstimateResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jobEstimateRoute;
