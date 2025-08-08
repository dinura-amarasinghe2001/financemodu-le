import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import AccountTypeResolve from './route/account-type-routing-resolve.service';

const accountTypeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/account-type.component').then(m => m.AccountTypeComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/account-type-detail.component').then(m => m.AccountTypeDetailComponent),
    resolve: {
      accountType: AccountTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/account-type-update.component').then(m => m.AccountTypeUpdateComponent),
    resolve: {
      accountType: AccountTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/account-type-update.component').then(m => m.AccountTypeUpdateComponent),
    resolve: {
      accountType: AccountTypeResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default accountTypeRoute;
