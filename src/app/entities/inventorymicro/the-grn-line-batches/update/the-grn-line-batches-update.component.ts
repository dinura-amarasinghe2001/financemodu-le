import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITheGRNLineBatches } from '../the-grn-line-batches.model';
import { TheGRNLineBatchesService } from '../service/the-grn-line-batches.service';
import { TheGRNLineBatchesFormGroup, TheGRNLineBatchesFormService } from './the-grn-line-batches-form.service';

@Component({
  selector: 'jhi-the-grn-line-batches-update',
  templateUrl: './the-grn-line-batches-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TheGRNLineBatchesUpdateComponent implements OnInit {
  isSaving = false;
  theGRNLineBatches: ITheGRNLineBatches | null = null;

  protected theGRNLineBatchesService = inject(TheGRNLineBatchesService);
  protected theGRNLineBatchesFormService = inject(TheGRNLineBatchesFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TheGRNLineBatchesFormGroup = this.theGRNLineBatchesFormService.createTheGRNLineBatchesFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ theGRNLineBatches }) => {
      this.theGRNLineBatches = theGRNLineBatches;
      if (theGRNLineBatches) {
        this.updateForm(theGRNLineBatches);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const theGRNLineBatches = this.theGRNLineBatchesFormService.getTheGRNLineBatches(this.editForm);
    if (theGRNLineBatches.id !== null) {
      this.subscribeToSaveResponse(this.theGRNLineBatchesService.update(theGRNLineBatches));
    } else {
      this.subscribeToSaveResponse(this.theGRNLineBatchesService.create(theGRNLineBatches));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITheGRNLineBatches>>): void {
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

  protected updateForm(theGRNLineBatches: ITheGRNLineBatches): void {
    this.theGRNLineBatches = theGRNLineBatches;
    this.theGRNLineBatchesFormService.resetForm(this.editForm, theGRNLineBatches);
  }
}
