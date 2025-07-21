import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IJobEstimate } from '../job-estimate.model';

@Component({
  selector: 'jhi-job-estimate-detail',
  templateUrl: './job-estimate-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class JobEstimateDetailComponent {
  jobEstimate = input<IJobEstimate | null>(null);

  previousState(): void {
    window.history.back();
  }
}
