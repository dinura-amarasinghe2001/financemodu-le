import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import JobCardResolve from './route/job-card-routing-resolve.service';

const jobCardRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/job-card.component').then(m => m.JobCardComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/job-card-detail.component').then(m => m.JobCardDetailComponent),
    resolve: {
      jobCard: JobCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/job-card-update.component').then(m => m.JobCardUpdateComponent),
    resolve: {
      jobCard: JobCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/job-card-update.component').then(m => m.JobCardUpdateComponent),
    resolve: {
      jobCard: JobCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jobCardRoute;
