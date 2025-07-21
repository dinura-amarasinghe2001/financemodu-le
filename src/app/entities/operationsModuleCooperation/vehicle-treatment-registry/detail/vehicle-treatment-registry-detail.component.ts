import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';

@Component({
  selector: 'jhi-vehicle-treatment-registry-detail',
  templateUrl: './vehicle-treatment-registry-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class VehicleTreatmentRegistryDetailComponent {
  vehicleTreatmentRegistry = input<IVehicleTreatmentRegistry | null>(null);

  previousState(): void {
    window.history.back();
  }
}
