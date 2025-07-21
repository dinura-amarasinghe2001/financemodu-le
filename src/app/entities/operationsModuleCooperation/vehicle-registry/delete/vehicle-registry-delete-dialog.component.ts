import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVehicleRegistry } from '../vehicle-registry.model';
import { VehicleRegistryService } from '../service/vehicle-registry.service';

@Component({
  templateUrl: './vehicle-registry-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VehicleRegistryDeleteDialogComponent {
  vehicleRegistry?: IVehicleRegistry;

  protected vehicleRegistryService = inject(VehicleRegistryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehicleRegistryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
