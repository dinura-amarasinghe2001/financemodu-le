import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IJobItemTimeEstimation } from '../job-item-time-estimation.model';

@Component({
  selector: 'jhi-job-item-time-estimation-detail',
  templateUrl: './job-item-time-estimation-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class JobItemTimeEstimationDetailComponent {
  jobItemTimeEstimation = input<IJobItemTimeEstimation | null>(null);

  previousState(): void {
    window.history.back();
  }
}
