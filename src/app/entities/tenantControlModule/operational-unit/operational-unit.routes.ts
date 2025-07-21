import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import OperationalUnitResolve from './route/operational-unit-routing-resolve.service';

const operationalUnitRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/operational-unit.component').then(m => m.OperationalUnitComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/operational-unit-detail.component').then(m => m.OperationalUnitDetailComponent),
    resolve: {
      operationalUnit: OperationalUnitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/operational-unit-update.component').then(m => m.OperationalUnitUpdateComponent),
    resolve: {
      operationalUnit: OperationalUnitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/operational-unit-update.component').then(m => m.OperationalUnitUpdateComponent),
    resolve: {
      operationalUnit: OperationalUnitResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default operationalUnitRoute;
