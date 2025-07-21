import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import InvoicePaymentsResolve from './route/invoice-payments-routing-resolve.service';

const invoicePaymentsRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/invoice-payments.component').then(m => m.InvoicePaymentsComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/invoice-payments-detail.component').then(m => m.InvoicePaymentsDetailComponent),
    resolve: {
      invoicePayments: InvoicePaymentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/invoice-payments-update.component').then(m => m.InvoicePaymentsUpdateComponent),
    resolve: {
      invoicePayments: InvoicePaymentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/invoice-payments-update.component').then(m => m.InvoicePaymentsUpdateComponent),
    resolve: {
      invoicePayments: InvoicePaymentsResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default invoicePaymentsRoute;
