import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ITheInventoryBatches } from '../the-inventory-batches.model';

@Component({
  selector: 'jhi-the-inventory-batches-detail',
  templateUrl: './the-inventory-batches-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class TheInventoryBatchesDetailComponent {
  theInventoryBatches = input<ITheInventoryBatches | null>(null);

  previousState(): void {
    window.history.back();
  }
}
