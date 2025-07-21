import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IGRNLineBatches } from '../grn-line-batches.model';

@Component({
  selector: 'jhi-grn-line-batches-detail',
  templateUrl: './grn-line-batches-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class GRNLineBatchesDetailComponent {
  gRNLineBatches = input<IGRNLineBatches | null>(null);

  previousState(): void {
    window.history.back();
  }
}
