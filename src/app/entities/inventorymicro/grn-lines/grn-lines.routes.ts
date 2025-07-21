import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GRNLinesResolve from './route/grn-lines-routing-resolve.service';

const gRNLinesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/grn-lines.component').then(m => m.GRNLinesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/grn-lines-detail.component').then(m => m.GRNLinesDetailComponent),
    resolve: {
      gRNLines: GRNLinesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/grn-lines-update.component').then(m => m.GRNLinesUpdateComponent),
    resolve: {
      gRNLines: GRNLinesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/grn-lines-update.component').then(m => m.GRNLinesUpdateComponent),
    resolve: {
      gRNLines: GRNLinesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gRNLinesRoute;
