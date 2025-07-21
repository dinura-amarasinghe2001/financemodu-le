import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IGRNLines } from '../grn-lines.model';

@Component({
  selector: 'jhi-grn-lines-detail',
  templateUrl: './grn-lines-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class GRNLinesDetailComponent {
  gRNLines = input<IGRNLines | null>(null);

  previousState(): void {
    window.history.back();
  }
}
