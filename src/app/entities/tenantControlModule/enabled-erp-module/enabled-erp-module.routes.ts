import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EnabledERPModuleResolve from './route/enabled-erp-module-routing-resolve.service';

const enabledERPModuleRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/enabled-erp-module.component').then(m => m.EnabledERPModuleComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/enabled-erp-module-detail.component').then(m => m.EnabledERPModuleDetailComponent),
    resolve: {
      enabledERPModule: EnabledERPModuleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/enabled-erp-module-update.component').then(m => m.EnabledERPModuleUpdateComponent),
    resolve: {
      enabledERPModule: EnabledERPModuleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/enabled-erp-module-update.component').then(m => m.EnabledERPModuleUpdateComponent),
    resolve: {
      enabledERPModule: EnabledERPModuleResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default enabledERPModuleRoute;
