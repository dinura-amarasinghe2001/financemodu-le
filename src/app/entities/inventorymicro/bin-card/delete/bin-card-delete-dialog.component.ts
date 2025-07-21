import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IBinCard } from '../bin-card.model';
import { BinCardService } from '../service/bin-card.service';

@Component({
  templateUrl: './bin-card-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BinCardDeleteDialogComponent {
  binCard?: IBinCard;

  protected binCardService = inject(BinCardService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.binCardService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
