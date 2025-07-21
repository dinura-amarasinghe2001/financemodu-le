import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IVehicleModel } from '../vehicle-model.model';

@Component({
  selector: 'jhi-vehicle-model-detail',
  templateUrl: './vehicle-model-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class VehicleModelDetailComponent {
  vehicleModel = input<IVehicleModel | null>(null);

  previousState(): void {
    window.history.back();
  }
}
