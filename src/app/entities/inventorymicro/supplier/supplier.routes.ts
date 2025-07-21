import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SupplierResolve from './route/supplier-routing-resolve.service';

const supplierRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/supplier.component').then(m => m.SupplierComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/supplier-detail.component').then(m => m.SupplierDetailComponent),
    resolve: {
      supplier: SupplierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/supplier-update.component').then(m => m.SupplierUpdateComponent),
    resolve: {
      supplier: SupplierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/supplier-update.component').then(m => m.SupplierUpdateComponent),
    resolve: {
      supplier: SupplierResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default supplierRoute;
