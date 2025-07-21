import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGRNLines } from '../grn-lines.model';
import { GRNLinesService } from '../service/grn-lines.service';
import { GRNLinesFormGroup, GRNLinesFormService } from './grn-lines-form.service';

@Component({
  selector: 'jhi-grn-lines-update',
  templateUrl: './grn-lines-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GRNLinesUpdateComponent implements OnInit {
  isSaving = false;
  gRNLines: IGRNLines | null = null;

  protected gRNLinesService = inject(GRNLinesService);
  protected gRNLinesFormService = inject(GRNLinesFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GRNLinesFormGroup = this.gRNLinesFormService.createGRNLinesFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gRNLines }) => {
      this.gRNLines = gRNLines;
      if (gRNLines) {
        this.updateForm(gRNLines);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gRNLines = this.gRNLinesFormService.getGRNLines(this.editForm);
    if (gRNLines.id !== null) {
      this.subscribeToSaveResponse(this.gRNLinesService.update(gRNLines));
    } else {
      this.subscribeToSaveResponse(this.gRNLinesService.create(gRNLines));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGRNLines>>): void {
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

  protected updateForm(gRNLines: IGRNLines): void {
    this.gRNLines = gRNLines;
    this.gRNLinesFormService.resetForm(this.editForm, gRNLines);
  }
}
