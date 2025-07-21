import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import JobItemTimeEstimationResolve from './route/job-item-time-estimation-routing-resolve.service';

const jobItemTimeEstimationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/job-item-time-estimation.component').then(m => m.JobItemTimeEstimationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/job-item-time-estimation-detail.component').then(m => m.JobItemTimeEstimationDetailComponent),
    resolve: {
      jobItemTimeEstimation: JobItemTimeEstimationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/job-item-time-estimation-update.component').then(m => m.JobItemTimeEstimationUpdateComponent),
    resolve: {
      jobItemTimeEstimation: JobItemTimeEstimationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/job-item-time-estimation-update.component').then(m => m.JobItemTimeEstimationUpdateComponent),
    resolve: {
      jobItemTimeEstimation: JobItemTimeEstimationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jobItemTimeEstimationRoute;
