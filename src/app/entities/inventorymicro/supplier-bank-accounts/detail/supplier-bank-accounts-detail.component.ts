import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ISupplierBankAccounts } from '../supplier-bank-accounts.model';

@Component({
  selector: 'jhi-supplier-bank-accounts-detail',
  templateUrl: './supplier-bank-accounts-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class SupplierBankAccountsDetailComponent {
  supplierBankAccounts = input<ISupplierBankAccounts | null>(null);

  previousState(): void {
    window.history.back();
  }
}
