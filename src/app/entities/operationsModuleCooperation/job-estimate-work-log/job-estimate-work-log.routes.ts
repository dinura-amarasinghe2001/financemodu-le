import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import JobEstimateWorkLogResolve from './route/job-estimate-work-log-routing-resolve.service';

const jobEstimateWorkLogRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/job-estimate-work-log.component').then(m => m.JobEstimateWorkLogComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/job-estimate-work-log-detail.component').then(m => m.JobEstimateWorkLogDetailComponent),
    resolve: {
      jobEstimateWorkLog: JobEstimateWorkLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/job-estimate-work-log-update.component').then(m => m.JobEstimateWorkLogUpdateComponent),
    resolve: {
      jobEstimateWorkLog: JobEstimateWorkLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/job-estimate-work-log-update.component').then(m => m.JobEstimateWorkLogUpdateComponent),
    resolve: {
      jobEstimateWorkLog: JobEstimateWorkLogResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jobEstimateWorkLogRoute;
