import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IClientRegistry } from '../client-registry.model';

@Component({
  selector: 'jhi-client-registry-detail',
  templateUrl: './client-registry-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class ClientRegistryDetailComponent {
  clientRegistry = input<IClientRegistry | null>(null);

  previousState(): void {
    window.history.back();
  }
}
