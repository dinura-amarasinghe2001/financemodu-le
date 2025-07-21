import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IVat } from '../vat.model';
import { VatService } from '../service/vat.service';

@Component({
  templateUrl: './vat-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class VatDeleteDialogComponent {
  vat?: IVat;

  protected vatService = inject(VatService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vatService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
