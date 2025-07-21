import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IInventoryBatches } from '../inventory-batches.model';

@Component({
  selector: 'jhi-inventory-batches-detail',
  templateUrl: './inventory-batches-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class InventoryBatchesDetailComponent {
  inventoryBatches = input<IInventoryBatches | null>(null);

  previousState(): void {
    window.history.back();
  }
}
