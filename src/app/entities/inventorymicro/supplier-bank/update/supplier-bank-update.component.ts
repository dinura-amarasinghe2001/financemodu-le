import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISupplierBank } from '../supplier-bank.model';
import { SupplierBankService } from '../service/supplier-bank.service';
import { SupplierBankFormGroup, SupplierBankFormService } from './supplier-bank-form.service';

@Component({
  selector: 'jhi-supplier-bank-update',
  templateUrl: './supplier-bank-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SupplierBankUpdateComponent implements OnInit {
  isSaving = false;
  supplierBank: ISupplierBank | null = null;

  protected supplierBankService = inject(SupplierBankService);
  protected supplierBankFormService = inject(SupplierBankFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SupplierBankFormGroup = this.supplierBankFormService.createSupplierBankFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supplierBank }) => {
      this.supplierBank = supplierBank;
      if (supplierBank) {
        this.updateForm(supplierBank);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const supplierBank = this.supplierBankFormService.getSupplierBank(this.editForm);
    if (supplierBank.id !== null) {
      this.subscribeToSaveResponse(this.supplierBankService.update(supplierBank));
    } else {
      this.subscribeToSaveResponse(this.supplierBankService.create(supplierBank));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISupplierBank>>): void {
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

  protected updateForm(supplierBank: ISupplierBank): void {
    this.supplierBank = supplierBank;
    this.supplierBankFormService.resetForm(this.editForm, supplierBank);
  }
}
