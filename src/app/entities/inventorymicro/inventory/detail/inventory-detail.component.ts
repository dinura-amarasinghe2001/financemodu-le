import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IInventory } from '../inventory.model';

@Component({
  selector: 'jhi-inventory-detail',
  templateUrl: './inventory-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class InventoryDetailComponent {
  inventory = input<IInventory | null>(null);

  previousState(): void {
    window.history.back();
  }
}
