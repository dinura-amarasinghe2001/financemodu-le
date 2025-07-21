import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import InventoryBatchesResolve from './route/inventory-batches-routing-resolve.service';

const inventoryBatchesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/inventory-batches.component').then(m => m.InventoryBatchesComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/inventory-batches-detail.component').then(m => m.InventoryBatchesDetailComponent),
    resolve: {
      inventoryBatches: InventoryBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/inventory-batches-update.component').then(m => m.InventoryBatchesUpdateComponent),
    resolve: {
      inventoryBatches: InventoryBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/inventory-batches-update.component').then(m => m.InventoryBatchesUpdateComponent),
    resolve: {
      inventoryBatches: InventoryBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default inventoryBatchesRoute;
