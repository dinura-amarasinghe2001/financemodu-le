import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IPreEstimateTreatment } from '../pre-estimate-treatment.model';

@Component({
  selector: 'jhi-pre-estimate-treatment-detail',
  templateUrl: './pre-estimate-treatment-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class PreEstimateTreatmentDetailComponent {
  preEstimateTreatment = input<IPreEstimateTreatment | null>(null);

  previousState(): void {
    window.history.back();
  }
}
