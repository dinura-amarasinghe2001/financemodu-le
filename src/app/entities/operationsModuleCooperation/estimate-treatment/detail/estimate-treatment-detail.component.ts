import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IEstimateTreatment } from '../estimate-treatment.model';

@Component({
  selector: 'jhi-estimate-treatment-detail',
  templateUrl: './estimate-treatment-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EstimateTreatmentDetailComponent {
  estimateTreatment = input<IEstimateTreatment | null>(null);

  previousState(): void {
    window.history.back();
  }
}
