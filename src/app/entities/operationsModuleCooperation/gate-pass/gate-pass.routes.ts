import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import GatePassResolve from './route/gate-pass-routing-resolve.service';

const gatePassRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/gate-pass.component').then(m => m.GatePassComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/gate-pass-detail.component').then(m => m.GatePassDetailComponent),
    resolve: {
      gatePass: GatePassResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/gate-pass-update.component').then(m => m.GatePassUpdateComponent),
    resolve: {
      gatePass: GatePassResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/gate-pass-update.component').then(m => m.GatePassUpdateComponent),
    resolve: {
      gatePass: GatePassResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gatePassRoute;
