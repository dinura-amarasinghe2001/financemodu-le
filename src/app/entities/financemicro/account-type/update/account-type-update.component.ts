import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IAccountType } from '../account-type.model';
import { AccountTypeService } from '../service/account-type.service';
import { AccountTypeFormGroup, AccountTypeFormService } from './account-type-form.service';

@Component({
  selector: 'jhi-account-type-update',
  templateUrl: './account-type-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AccountTypeUpdateComponent implements OnInit {
  isSaving = false;
  accountType: IAccountType | null = null;

  protected accountTypeService = inject(AccountTypeService);
  protected accountTypeFormService = inject(AccountTypeFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AccountTypeFormGroup = this.accountTypeFormService.createAccountTypeFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accountType }) => {
      this.accountType = accountType;
      if (accountType) {
        this.updateForm(accountType);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accountType = this.accountTypeFormService.getAccountType(this.editForm);
    if (accountType.id !== null) {
      this.subscribeToSaveResponse(this.accountTypeService.update(accountType));
    } else {
      this.subscribeToSaveResponse(this.accountTypeService.create(accountType));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccountType>>): void {
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

  protected updateForm(accountType: IAccountType): void {
    this.accountType = accountType;
    this.accountTypeFormService.resetForm(this.editForm, accountType);
  }
}
