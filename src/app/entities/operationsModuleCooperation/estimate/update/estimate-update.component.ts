import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEstimate } from '../estimate.model';
import { EstimateService } from '../service/estimate.service';
import { EstimateFormGroup, EstimateFormService } from './estimate-form.service';

@Component({
  selector: 'jhi-estimate-update',
  templateUrl: './estimate-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EstimateUpdateComponent implements OnInit {
  isSaving = false;
  estimate: IEstimate | null = null;

  protected estimateService = inject(EstimateService);
  protected estimateFormService = inject(EstimateFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EstimateFormGroup = this.estimateFormService.createEstimateFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estimate }) => {
      this.estimate = estimate;
      if (estimate) {
        this.updateForm(estimate);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estimate = this.estimateFormService.getEstimate(this.editForm);
    if (estimate.id !== null) {
      this.subscribeToSaveResponse(this.estimateService.update(estimate));
    } else {
      this.subscribeToSaveResponse(this.estimateService.create(estimate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstimate>>): void {
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

  protected updateForm(estimate: IEstimate): void {
    this.estimate = estimate;
    this.estimateFormService.resetForm(this.editForm, estimate);
  }
}
