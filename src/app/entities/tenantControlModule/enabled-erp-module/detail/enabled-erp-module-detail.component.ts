import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IEnabledERPModule } from '../enabled-erp-module.model';

@Component({
  selector: 'jhi-enabled-erp-module-detail',
  templateUrl: './enabled-erp-module-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class EnabledERPModuleDetailComponent {
  enabledERPModule = input<IEnabledERPModule | null>(null);

  previousState(): void {
    window.history.back();
  }
}
