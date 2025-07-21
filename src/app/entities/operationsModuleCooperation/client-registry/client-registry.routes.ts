import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ClientRegistryResolve from './route/client-registry-routing-resolve.service';

const clientRegistryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/client-registry.component').then(m => m.ClientRegistryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/client-registry-detail.component').then(m => m.ClientRegistryDetailComponent),
    resolve: {
      clientRegistry: ClientRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/client-registry-update.component').then(m => m.ClientRegistryUpdateComponent),
    resolve: {
      clientRegistry: ClientRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/client-registry-update.component').then(m => m.ClientRegistryUpdateComponent),
    resolve: {
      clientRegistry: ClientRegistryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default clientRegistryRoute;
