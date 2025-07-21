import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IBinCard } from '../bin-card.model';

@Component({
  selector: 'jhi-bin-card-detail',
  templateUrl: './bin-card-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class BinCardDetailComponent {
  binCard = input<IBinCard | null>(null);

  previousState(): void {
    window.history.back();
  }
}
