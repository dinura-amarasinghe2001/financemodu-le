import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEnabledERPModule } from '../enabled-erp-module.model';
import { EnabledERPModuleService } from '../service/enabled-erp-module.service';

const enabledERPModuleResolve = (route: ActivatedRouteSnapshot): Observable<null | IEnabledERPModule> => {
  const id = route.params.id;
  if (id) {
    return inject(EnabledERPModuleService)
      .find(id)
      .pipe(
        mergeMap((enabledERPModule: HttpResponse<IEnabledERPModule>) => {
          if (enabledERPModule.body) {
            return of(enabledERPModule.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default enabledERPModuleResolve;
