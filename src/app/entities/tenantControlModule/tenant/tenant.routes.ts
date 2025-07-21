import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TenantResolve from './route/tenant-routing-resolve.service';

const tenantRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/tenant.component').then(m => m.TenantComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/tenant-detail.component').then(m => m.TenantDetailComponent),
    resolve: {
      tenant: TenantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/tenant-update.component').then(m => m.TenantUpdateComponent),
    resolve: {
      tenant: TenantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/tenant-update.component').then(m => m.TenantUpdateComponent),
    resolve: {
      tenant: TenantResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tenantRoute;
