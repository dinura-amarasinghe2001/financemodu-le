import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IBankBranch } from '../bank-branch.model';

@Component({
  selector: 'jhi-bank-branch-detail',
  templateUrl: './bank-branch-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class BankBranchDetailComponent {
  bankBranch = input<IBankBranch | null>(null);

  previousState(): void {
    window.history.back();
  }
}
