import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IPreEstimate } from 'app/entities/operationsModule/pre-estimate/pre-estimate.model';
import { PreEstimateService } from 'app/entities/operationsModule/pre-estimate/service/pre-estimate.service';
import { Sh } from 'app/entities/enumerations/sh.model';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { TreatmentType } from 'app/entities/enumerations/treatment-type.model';
import { PreEstimateTreatmentService } from '../service/pre-estimate-treatment.service';
import { IPreEstimateTreatment } from '../pre-estimate-treatment.model';
import { PreEstimateTreatmentFormGroup, PreEstimateTreatmentFormService } from './pre-estimate-treatment-form.service';

@Component({
  selector: 'jhi-pre-estimate-treatment-update',
  templateUrl: './pre-estimate-treatment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PreEstimateTreatmentUpdateComponent implements OnInit {
  isSaving = false;
  preEstimateTreatment: IPreEstimateTreatment | null = null;
  shValues = Object.keys(Sh);
  priceTypeValues = Object.keys(PriceType);
  treatmentTypeValues = Object.keys(TreatmentType);

  preEstimatesSharedCollection: IPreEstimate[] = [];

  protected preEstimateTreatmentService = inject(PreEstimateTreatmentService);
  protected preEstimateTreatmentFormService = inject(PreEstimateTreatmentFormService);
  protected preEstimateService = inject(PreEstimateService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: PreEstimateTreatmentFormGroup = this.preEstimateTreatmentFormService.createPreEstimateTreatmentFormGroup();

  comparePreEstimate = (o1: IPreEstimate | null, o2: IPreEstimate | null): boolean => this.preEstimateService.comparePreEstimate(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ preEstimateTreatment }) => {
      this.preEstimateTreatment = preEstimateTreatment;
      if (preEstimateTreatment) {
        this.updateForm(preEstimateTreatment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const preEstimateTreatment = this.preEstimateTreatmentFormService.getPreEstimateTreatment(this.editForm);
    if (preEstimateTreatment.id !== null) {
      this.subscribeToSaveResponse(this.preEstimateTreatmentService.update(preEstimateTreatment));
    } else {
      this.subscribeToSaveResponse(this.preEstimateTreatmentService.create(preEstimateTreatment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPreEstimateTreatment>>): void {
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

  protected updateForm(preEstimateTreatment: IPreEstimateTreatment): void {
    this.preEstimateTreatment = preEstimateTreatment;
    this.preEstimateTreatmentFormService.resetForm(this.editForm, preEstimateTreatment);

    this.preEstimatesSharedCollection = this.preEstimateService.addPreEstimateToCollectionIfMissing<IPreEstimate>(
      this.preEstimatesSharedCollection,
      preEstimateTreatment.preEstimate,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.preEstimateService
      .query()
      .pipe(map((res: HttpResponse<IPreEstimate[]>) => res.body ?? []))
      .pipe(
        map((preEstimates: IPreEstimate[]) =>
          this.preEstimateService.addPreEstimateToCollectionIfMissing<IPreEstimate>(preEstimates, this.preEstimateTreatment?.preEstimate),
        ),
      )
      .subscribe((preEstimates: IPreEstimate[]) => (this.preEstimatesSharedCollection = preEstimates));
  }
}
