import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BrandResolve from './route/brand-routing-resolve.service';

const brandRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/brand.component').then(m => m.BrandComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/brand-detail.component').then(m => m.BrandDetailComponent),
    resolve: {
      brand: BrandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/brand-update.component').then(m => m.BrandUpdateComponent),
    resolve: {
      brand: BrandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/brand-update.component').then(m => m.BrandUpdateComponent),
    resolve: {
      brand: BrandResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default brandRoute;
