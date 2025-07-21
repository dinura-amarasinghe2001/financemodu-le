import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVehicleModel } from '../vehicle-model.model';
import { VehicleModelService } from '../service/vehicle-model.service';

@Component({
  templateUrl: './vehicle-model-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VehicleModelDeleteDialogComponent {
  vehicleModel?: IVehicleModel;

  protected vehicleModelService = inject(VehicleModelService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehicleModelService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
