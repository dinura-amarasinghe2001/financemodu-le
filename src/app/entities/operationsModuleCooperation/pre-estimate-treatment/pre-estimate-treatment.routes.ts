import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import PreEstimateTreatmentResolve from './route/pre-estimate-treatment-routing-resolve.service';

const preEstimateTreatmentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pre-estimate-treatment.component').then(m => m.PreEstimateTreatmentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pre-estimate-treatment-detail.component').then(m => m.PreEstimateTreatmentDetailComponent),
    resolve: {
      preEstimateTreatment: PreEstimateTreatmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pre-estimate-treatment-update.component').then(m => m.PreEstimateTreatmentUpdateComponent),
    resolve: {
      preEstimateTreatment: PreEstimateTreatmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pre-estimate-treatment-update.component').then(m => m.PreEstimateTreatmentUpdateComponent),
    resolve: {
      preEstimateTreatment: PreEstimateTreatmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default preEstimateTreatmentRoute;
