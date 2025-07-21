import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import GRNLineBatchesResolve from './route/grn-line-batches-routing-resolve.service';

const gRNLineBatchesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/grn-line-batches.component').then(m => m.GRNLineBatchesComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/grn-line-batches-detail.component').then(m => m.GRNLineBatchesDetailComponent),
    resolve: {
      gRNLineBatches: GRNLineBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/grn-line-batches-update.component').then(m => m.GRNLineBatchesUpdateComponent),
    resolve: {
      gRNLineBatches: GRNLineBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/grn-line-batches-update.component').then(m => m.GRNLineBatchesUpdateComponent),
    resolve: {
      gRNLineBatches: GRNLineBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default gRNLineBatchesRoute;
