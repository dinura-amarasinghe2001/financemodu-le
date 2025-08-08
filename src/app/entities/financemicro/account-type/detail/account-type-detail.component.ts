import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatetimePipe } from 'app/shared/date';
import { IAccountType } from '../account-type.model';

@Component({
  selector: 'jhi-account-type-detail',
  templateUrl: './account-type-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatetimePipe],
})
export class AccountTypeDetailComponent {
  accountType = input<IAccountType | null>(null);

  previousState(): void {
    window.history.back();
  }
}
