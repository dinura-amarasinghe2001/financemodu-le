import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IEstimate } from '../estimate.model';

@Component({
  selector: 'jhi-estimate-detail',
  templateUrl: './estimate-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class EstimateDetailComponent {
  estimate = input<IEstimate | null>(null);

  previousState(): void {
    window.history.back();
  }
}
