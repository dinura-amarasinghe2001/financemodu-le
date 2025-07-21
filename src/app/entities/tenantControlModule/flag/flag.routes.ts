import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import FlagResolve from './route/flag-routing-resolve.service';

const flagRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/flag.component').then(m => m.FlagComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/flag-detail.component').then(m => m.FlagDetailComponent),
    resolve: {
      flag: FlagResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/flag-update.component').then(m => m.FlagUpdateComponent),
    resolve: {
      flag: FlagResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/flag-update.component').then(m => m.FlagUpdateComponent),
    resolve: {
      flag: FlagResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default flagRoute;
