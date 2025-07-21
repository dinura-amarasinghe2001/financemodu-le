import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import TheGRNLineBatchesResolve from './route/the-grn-line-batches-routing-resolve.service';

const theGRNLineBatchesRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/the-grn-line-batches.component').then(m => m.TheGRNLineBatchesComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/the-grn-line-batches-detail.component').then(m => m.TheGRNLineBatchesDetailComponent),
    resolve: {
      theGRNLineBatches: TheGRNLineBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/the-grn-line-batches-update.component').then(m => m.TheGRNLineBatchesUpdateComponent),
    resolve: {
      theGRNLineBatches: TheGRNLineBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/the-grn-line-batches-update.component').then(m => m.TheGRNLineBatchesUpdateComponent),
    resolve: {
      theGRNLineBatches: TheGRNLineBatchesResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default theGRNLineBatchesRoute;
