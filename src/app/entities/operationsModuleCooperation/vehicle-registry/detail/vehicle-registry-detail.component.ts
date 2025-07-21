import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IVehicleRegistry } from '../vehicle-registry.model';

@Component({
  selector: 'jhi-vehicle-registry-detail',
  templateUrl: './vehicle-registry-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class VehicleRegistryDetailComponent {
  vehicleRegistry = input<IVehicleRegistry | null>(null);

  previousState(): void {
    window.history.back();
  }
}
