import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ITheGRNLineBatches } from '../the-grn-line-batches.model';

@Component({
  selector: 'jhi-the-grn-line-batches-detail',
  templateUrl: './the-grn-line-batches-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class TheGRNLineBatchesDetailComponent {
  theGRNLineBatches = input<ITheGRNLineBatches | null>(null);

  previousState(): void {
    window.history.back();
  }
}
