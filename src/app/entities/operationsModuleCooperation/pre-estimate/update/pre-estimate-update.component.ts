import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPreEstimate } from '../pre-estimate.model';
import { PreEstimateService } from '../service/pre-estimate.service';
import { PreEstimateFormGroup, PreEstimateFormService } from './pre-estimate-form.service';

@Component({
  selector: 'jhi-pre-estimate-update',
  templateUrl: './pre-estimate-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PreEstimateUpdateComponent implements OnInit {
  isSaving = false;
  preEstimate: IPreEstimate | null = null;

  protected preEstimateService = inject(PreEstimateService);
  protected preEstimateFormService = inject(PreEstimateFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PreEstimateFormGroup = this.preEstimateFormService.createPreEstimateFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ preEstimate }) => {
      this.preEstimate = preEstimate;
      if (preEstimate) {
        this.updateForm(preEstimate);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const preEstimate = this.preEstimateFormService.getPreEstimate(this.editForm);
    if (preEstimate.id !== null) {
      this.subscribeToSaveResponse(this.preEstimateService.update(preEstimate));
    } else {
      this.subscribeToSaveResponse(this.preEstimateService.create(preEstimate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPreEstimate>>): void {
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

  protected updateForm(preEstimate: IPreEstimate): void {
    this.preEstimate = preEstimate;
    this.preEstimateFormService.resetForm(this.editForm, preEstimate);
  }
}
