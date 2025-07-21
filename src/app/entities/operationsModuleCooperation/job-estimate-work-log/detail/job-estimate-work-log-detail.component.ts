import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IJobEstimateWorkLog } from '../job-estimate-work-log.model';

@Component({
  selector: 'jhi-job-estimate-work-log-detail',
  templateUrl: './job-estimate-work-log-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class JobEstimateWorkLogDetailComponent {
  jobEstimateWorkLog = input<IJobEstimateWorkLog | null>(null);

  previousState(): void {
    window.history.back();
  }
}
