import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IGatePass } from '../gate-pass.model';

@Component({
  selector: 'jhi-gate-pass-detail',
  templateUrl: './gate-pass-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class GatePassDetailComponent {
  gatePass = input<IGatePass | null>(null);

  previousState(): void {
    window.history.back();
  }
}
