import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TheInventoryBatchesResolve from './route/the-inventory-batches-routing-resolve.service';

const theInventoryBatchesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/the-inventory-batches.component').then(m => m.TheInventoryBatchesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/the-inventory-batches-detail.component').then(m => m.TheInventoryBatchesDetailComponent),
    resolve: {
      theInventoryBatches: TheInventoryBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/the-inventory-batches-update.component').then(m => m.TheInventoryBatchesUpdateComponent),
    resolve: {
      theInventoryBatches: TheInventoryBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/the-inventory-batches-update.component').then(m => m.TheInventoryBatchesUpdateComponent),
    resolve: {
      theInventoryBatches: TheInventoryBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default theInventoryBatchesRoute;
