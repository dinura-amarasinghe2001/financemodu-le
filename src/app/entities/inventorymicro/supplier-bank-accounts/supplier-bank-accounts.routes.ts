import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SupplierBankAccountsResolve from './route/supplier-bank-accounts-routing-resolve.service';

const supplierBankAccountsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/supplier-bank-accounts.component').then(m => m.SupplierBankAccountsComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/supplier-bank-accounts-detail.component').then(m => m.SupplierBankAccountsDetailComponent),
    resolve: {
      supplierBankAccounts: SupplierBankAccountsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/supplier-bank-accounts-update.component').then(m => m.SupplierBankAccountsUpdateComponent),
    resolve: {
      supplierBankAccounts: SupplierBankAccountsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/supplier-bank-accounts-update.component').then(m => m.SupplierBankAccountsUpdateComponent),
    resolve: {
      supplierBankAccounts: SupplierBankAccountsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default supplierBankAccountsRoute;
