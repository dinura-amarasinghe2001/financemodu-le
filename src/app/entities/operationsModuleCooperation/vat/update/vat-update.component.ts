import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVat } from '../vat.model';
import { VatService } from '../service/vat.service';
import { VatFormGroup, VatFormService } from './vat-form.service';

@Component({
  selector: 'jhi-vat-update',
  templateUrl: './vat-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VatUpdateComponent implements OnInit {
  isSaving = false;
  vat: IVat | null = null;

  protected vatService = inject(VatService);
  protected vatFormService = inject(VatFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VatFormGroup = this.vatFormService.createVatFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vat }) => {
      this.vat = vat;
      if (vat) {
        this.updateForm(vat);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vat = this.vatFormService.getVat(this.editForm);
    if (vat.id !== null) {
      this.subscribeToSaveResponse(this.vatService.update(vat));
    } else {
      this.subscribeToSaveResponse(this.vatService.create(vat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVat>>): void {
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

  protected updateForm(vat: IVat): void {
    this.vat = vat;
    this.vatFormService.resetForm(this.editForm, vat);
  }
}
