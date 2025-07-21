import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BankBranchResolve from './route/bank-branch-routing-resolve.service';

const bankBranchRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/bank-branch.component').then(m => m.BankBranchComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/bank-branch-detail.component').then(m => m.BankBranchDetailComponent),
    resolve: {
      bankBranch: BankBranchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/bank-branch-update.component').then(m => m.BankBranchUpdateComponent),
    resolve: {
      bankBranch: BankBranchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/bank-branch-update.component').then(m => m.BankBranchUpdateComponent),
    resolve: {
      bankBranch: BankBranchResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bankBranchRoute;
