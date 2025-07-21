import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SupplierBankResolve from './route/supplier-bank-routing-resolve.service';

const supplierBankRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/supplier-bank.component').then(m => m.SupplierBankComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/supplier-bank-detail.component').then(m => m.SupplierBankDetailComponent),
    resolve: {
      supplierBank: SupplierBankResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/supplier-bank-update.component').then(m => m.SupplierBankUpdateComponent),
    resolve: {
      supplierBank: SupplierBankResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/supplier-bank-update.component').then(m => m.SupplierBankUpdateComponent),
    resolve: {
      supplierBank: SupplierBankResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default supplierBankRoute;
