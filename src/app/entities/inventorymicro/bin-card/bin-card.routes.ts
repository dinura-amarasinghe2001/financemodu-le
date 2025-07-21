import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BinCardResolve from './route/bin-card-routing-resolve.service';

const binCardRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/bin-card.component').then(m => m.BinCardComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/bin-card-detail.component').then(m => m.BinCardDetailComponent),
    resolve: {
      binCard: BinCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/bin-card-update.component').then(m => m.BinCardUpdateComponent),
    resolve: {
      binCard: BinCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/bin-card-update.component').then(m => m.BinCardUpdateComponent),
    resolve: {
      binCard: BinCardResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default binCardRoute;
