import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBankBranch } from '../bank-branch.model';
import { BankBranchService } from '../service/bank-branch.service';
import { BankBranchFormGroup, BankBranchFormService } from './bank-branch-form.service';

@Component({
  selector: 'jhi-bank-branch-update',
  templateUrl: './bank-branch-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BankBranchUpdateComponent implements OnInit {
  isSaving = false;
  bankBranch: IBankBranch | null = null;

  protected bankBranchService = inject(BankBranchService);
  protected bankBranchFormService = inject(BankBranchFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BankBranchFormGroup = this.bankBranchFormService.createBankBranchFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bankBranch }) => {
      this.bankBranch = bankBranch;
      if (bankBranch) {
        this.updateForm(bankBranch);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bankBranch = this.bankBranchFormService.getBankBranch(this.editForm);
    if (bankBranch.id !== null) {
      this.subscribeToSaveResponse(this.bankBranchService.update(bankBranch));
    } else {
      this.subscribeToSaveResponse(this.bankBranchService.create(bankBranch));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBankBranch>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bankBranch: IBankBranch): void {
    this.bankBranch = bankBranch;
    this.bankBranchFormService.resetForm(this.editForm, bankBranch);
  }
}
