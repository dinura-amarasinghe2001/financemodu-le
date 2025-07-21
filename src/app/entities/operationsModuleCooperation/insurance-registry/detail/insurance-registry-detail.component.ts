import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IInsuranceRegistry } from '../insurance-registry.model';

@Component({
  selector: 'jhi-insurance-registry-detail',
  templateUrl: './insurance-registry-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class InsuranceRegistryDetailComponent {
  insuranceRegistry = input<IInsuranceRegistry | null>(null);

  previousState(): void {
    window.history.back();
  }
}
