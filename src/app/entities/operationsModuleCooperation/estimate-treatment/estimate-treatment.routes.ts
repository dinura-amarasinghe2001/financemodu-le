import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EstimateTreatmentResolve from './route/estimate-treatment-routing-resolve.service';

const estimateTreatmentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/estimate-treatment.component').then(m => m.EstimateTreatmentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/estimate-treatment-detail.component').then(m => m.EstimateTreatmentDetailComponent),
    resolve: {
      estimateTreatment: EstimateTreatmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/estimate-treatment-update.component').then(m => m.EstimateTreatmentUpdateComponent),
    resolve: {
      estimateTreatment: EstimateTreatmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/estimate-treatment-update.component').then(m => m.EstimateTreatmentUpdateComponent),
    resolve: {
      estimateTreatment: EstimateTreatmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default estimateTreatmentRoute;
