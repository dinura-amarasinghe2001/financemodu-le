import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IJobCard } from '../job-card.model';

@Component({
  selector: 'jhi-job-card-detail',
  templateUrl: './job-card-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class JobCardDetailComponent {
  jobCard = input<IJobCard | null>(null);

  previousState(): void {
    window.history.back();
  }
}
