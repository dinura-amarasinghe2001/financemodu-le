import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITheInventoryBatches } from '../the-inventory-batches.model';
import { TheInventoryBatchesService } from '../service/the-inventory-batches.service';
import { TheInventoryBatchesFormGroup, TheInventoryBatchesFormService } from './the-inventory-batches-form.service';

@Component({
  selector: 'jhi-the-inventory-batches-update',
  templateUrl: './the-inventory-batches-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TheInventoryBatchesUpdateComponent implements OnInit {
  isSaving = false;
  theInventoryBatches: ITheInventoryBatches | null = null;

  protected theInventoryBatchesService = inject(TheInventoryBatchesService);
  protected theInventoryBatchesFormService = inject(TheInventoryBatchesFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TheInventoryBatchesFormGroup = this.theInventoryBatchesFormService.createTheInventoryBatchesFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ theInventoryBatches }) => {
      this.theInventoryBatches = theInventoryBatches;
      if (theInventoryBatches) {
        this.updateForm(theInventoryBatches);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const theInventoryBatches = this.theInventoryBatchesFormService.getTheInventoryBatches(this.editForm);
    if (theInventoryBatches.id !== null) {
      this.subscribeToSaveResponse(this.theInventoryBatchesService.update(theInventoryBatches));
    } else {
      this.subscribeToSaveResponse(this.theInventoryBatchesService.create(theInventoryBatches));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITheInventoryBatches>>): void {
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

  protected updateForm(theInventoryBatches: ITheInventoryBatches): void {
    this.theInventoryBatches = theInventoryBatches;
    this.theInventoryBatchesFormService.resetForm(this.editForm, theInventoryBatches);
  }
}
