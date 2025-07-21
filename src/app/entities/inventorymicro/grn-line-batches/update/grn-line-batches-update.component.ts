import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGRNLineBatches } from '../grn-line-batches.model';
import { GRNLineBatchesService } from '../service/grn-line-batches.service';
import { GRNLineBatchesFormGroup, GRNLineBatchesFormService } from './grn-line-batches-form.service';

@Component({
  selector: 'jhi-grn-line-batches-update',
  templateUrl: './grn-line-batches-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GRNLineBatchesUpdateComponent implements OnInit {
  isSaving = false;
  gRNLineBatches: IGRNLineBatches | null = null;

  protected gRNLineBatchesService = inject(GRNLineBatchesService);
  protected gRNLineBatchesFormService = inject(GRNLineBatchesFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GRNLineBatchesFormGroup = this.gRNLineBatchesFormService.createGRNLineBatchesFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gRNLineBatches }) => {
      this.gRNLineBatches = gRNLineBatches;
      if (gRNLineBatches) {
        this.updateForm(gRNLineBatches);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gRNLineBatches = this.gRNLineBatchesFormService.getGRNLineBatches(this.editForm);
    if (gRNLineBatches.id !== null) {
      this.subscribeToSaveResponse(this.gRNLineBatchesService.update(gRNLineBatches));
    } else {
      this.subscribeToSaveResponse(this.gRNLineBatchesService.create(gRNLineBatches));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGRNLineBatches>>): void {
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

  protected updateForm(gRNLineBatches: IGRNLineBatches): void {
    this.gRNLineBatches = gRNLineBatches;
    this.gRNLineBatchesFormService.resetForm(this.editForm, gRNLineBatches);
  }
}
