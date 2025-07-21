import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import InvoiceItemResolve from './route/invoice-item-routing-resolve.service';

const invoiceItemRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/invoice-item.component').then(m => m.InvoiceItemComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/invoice-item-detail.component').then(m => m.InvoiceItemDetailComponent),
    resolve: {
      invoiceItem: InvoiceItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/invoice-item-update.component').then(m => m.InvoiceItemUpdateComponent),
    resolve: {
      invoiceItem: InvoiceItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/invoice-item-update.component').then(m => m.InvoiceItemUpdateComponent),
    resolve: {
      invoiceItem: InvoiceItemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default invoiceItemRoute;
