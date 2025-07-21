import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IPreEstimate } from '../pre-estimate.model';

@Component({
  selector: 'jhi-pre-estimate-detail',
  templateUrl: './pre-estimate-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class PreEstimateDetailComponent {
  preEstimate = input<IPreEstimate | null>(null);

  previousState(): void {
    window.history.back();
  }
}
