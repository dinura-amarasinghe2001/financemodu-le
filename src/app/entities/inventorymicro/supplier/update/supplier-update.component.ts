import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ISupplier } from '../supplier.model';
import { SupplierService } from '../service/supplier.service';
import { SupplierFormGroup, SupplierFormService } from './supplier-form.service';

@Component({
  selector: 'jhi-supplier-update',
  templateUrl: './supplier-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class SupplierUpdateComponent implements OnInit {
  isSaving = false;
  supplier: ISupplier | null = null;

  protected supplierService = inject(SupplierService);
  protected supplierFormService = inject(SupplierFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: SupplierFormGroup = this.supplierFormService.createSupplierFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ supplier }) => {
      this.supplier = supplier;
      if (supplier) {
        this.updateForm(supplier);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const supplier = this.supplierFormService.getSupplier(this.editForm);
    if (supplier.id !== null) {
      this.subscribeToSaveResponse(this.supplierService.update(supplier));
    } else {
      this.subscribeToSaveResponse(this.supplierService.create(supplier));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISupplier>>): void {
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

  protected updateForm(supplier: ISupplier): void {
    this.supplier = supplier;
    this.supplierFormService.resetForm(this.editForm, supplier);
  }
}
