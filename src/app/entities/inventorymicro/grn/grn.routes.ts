import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GRNResolve from './route/grn-routing-resolve.service';

const gRNRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/grn.component').then(m => m.GRNComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/grn-detail.component').then(m => m.GRNDetailComponent),
    resolve: {
      gRN: GRNResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/grn-update.component').then(m => m.GRNUpdateComponent),
    resolve: {
      gRN: GRNResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/grn-update.component').then(m => m.GRNUpdateComponent),
    resolve: {
      gRN: GRNResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gRNRoute;
