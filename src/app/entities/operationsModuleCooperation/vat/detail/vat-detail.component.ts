import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IVat } from '../vat.model';

@Component({
  selector: 'jhi-vat-detail',
  templateUrl: './vat-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class VatDetailComponent {
  vat = input<IVat | null>(null);

  previousState(): void {
    window.history.back();
  }
}
