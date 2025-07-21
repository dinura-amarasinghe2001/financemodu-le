import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IOperationalUnit } from '../operational-unit.model';

@Component({
  selector: 'jhi-operational-unit-detail',
  templateUrl: './operational-unit-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class OperationalUnitDetailComponent {
  operationalUnit = input<IOperationalUnit | null>(null);

  previousState(): void {
    window.history.back();
  }
}
