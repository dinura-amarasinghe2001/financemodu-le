import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IGRN } from '../grn.model';

@Component({
  selector: 'jhi-grn-detail',
  templateUrl: './grn-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class GRNDetailComponent {
  gRN = input<IGRN | null>(null);

  previousState(): void {
    window.history.back();
  }
}
