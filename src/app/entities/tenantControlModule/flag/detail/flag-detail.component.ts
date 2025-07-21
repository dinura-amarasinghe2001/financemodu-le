import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IFlag } from '../flag.model';

@Component({
  selector: 'jhi-flag-detail',
  templateUrl: './flag-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class FlagDetailComponent {
  flag = input<IFlag | null>(null);

  previousState(): void {
    window.history.back();
  }
}
