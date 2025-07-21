import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IClientRegistry } from '../client-registry.model';
import { ClientRegistryService } from '../service/client-registry.service';

@Component({
  templateUrl: './client-registry-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ClientRegistryDeleteDialogComponent {
  clientRegistry?: IClientRegistry;

  protected clientRegistryService = inject(ClientRegistryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.clientRegistryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
