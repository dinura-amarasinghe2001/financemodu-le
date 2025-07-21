import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { ITenant } from '../tenant.model';

@Component({
  selector: 'jhi-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class TenantDetailComponent {
  tenant = input<ITenant | null>(null);

  previousState(): void {
    window.history.back();
  }
}
