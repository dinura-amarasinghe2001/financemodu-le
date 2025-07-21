import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { ISupplierBank } from '../supplier-bank.model';

@Component({
  selector: 'jhi-supplier-bank-detail',
  templateUrl: './supplier-bank-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class SupplierBankDetailComponent {
  supplierBank = input<ISupplierBank | null>(null);

  previousState(): void {
    window.history.back();
  }
}
