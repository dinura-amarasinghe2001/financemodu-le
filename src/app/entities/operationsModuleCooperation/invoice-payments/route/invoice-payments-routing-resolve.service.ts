import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInvoicePayments } from '../invoice-payments.model';
import { InvoicePaymentsService } from '../service/invoice-payments.service';

const invoicePaymentsResolve = (route: ActivatedRouteSnapshot): Observable<null | IInvoicePayments> => {
  const id = route.params.id;
  if (id) {
    return inject(InvoicePaymentsService)
      .find(id)
      .pipe(
        mergeMap((invoicePayments: HttpResponse<IInvoicePayments>) => {
          if (invoicePayments.body) {
            return of(invoicePayments.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default invoicePaymentsResolve;
