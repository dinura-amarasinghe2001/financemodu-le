import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISupplierBankAccounts } from '../supplier-bank-accounts.model';
import { SupplierBankAccountsService } from '../service/supplier-bank-accounts.service';
import { SupplierBankAccountsFormGroup, SupplierBankAccountsFormService } from './supplier-bank-accounts-form.service';

@Component({
  selector: 'jhi-supplier-bank-accounts-update',
  templateUrl: './supplier-bank-accounts-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SupplierBankAccountsUpdateComponent implements OnInit {
  isSaving = false;
  supplierBankAccounts: ISupplierBankAccounts | null = null;

  protected supplierBankAccountsService = inject(SupplierBankAccountsService);
  protected supplierBankAccountsFormService = inject(SupplierBankAccountsFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SupplierBankAccountsFormGroup = this.supplierBankAccountsFormService.createSupplierBankAccountsFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supplierBankAccounts }) => {
      this.supplierBankAccounts = supplierBankAccounts;
      if (supplierBankAccounts) {
        this.updateForm(supplierBankAccounts);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const supplierBankAccounts = this.supplierBankAccountsFormService.getSupplierBankAccounts(this.editForm);
    if (supplierBankAccounts.id !== null) {
      this.subscribeToSaveResponse(this.supplierBankAccountsService.update(supplierBankAccounts));
    } else {
      this.subscribeToSaveResponse(this.supplierBankAccountsService.create(supplierBankAccounts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISupplierBankAccounts>>): void {
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

  protected updateForm(supplierBankAccounts: ISupplierBankAccounts): void {
    this.supplierBankAccounts = supplierBankAccounts;
    this.supplierBankAccountsFormService.resetForm(this.editForm, supplierBankAccounts);
  }
}
