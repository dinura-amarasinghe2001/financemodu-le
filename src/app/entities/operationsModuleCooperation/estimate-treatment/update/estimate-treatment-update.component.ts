import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEstimate } from 'app/entities/operationsModule/estimate/estimate.model';
import { EstimateService } from 'app/entities/operationsModule/estimate/service/estimate.service';
import { PriceType } from 'app/entities/enumerations/price-type.model';
import { Sh } from 'app/entities/enumerations/sh.model';
import { TreatmentType } from 'app/entities/enumerations/treatment-type.model';
import { EstimateTreatmentReason } from 'app/entities/enumerations/estimate-treatment-reason.model';
import { EstimateTreatmentService } from '../service/estimate-treatment.service';
import { IEstimateTreatment } from '../estimate-treatment.model';
import { EstimateTreatmentFormGroup, EstimateTreatmentFormService } from './estimate-treatment-form.service';

@Component({
  selector: 'jhi-estimate-treatment-update',
  templateUrl: './estimate-treatment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EstimateTreatmentUpdateComponent implements OnInit {
  isSaving = false;
  estimateTreatment: IEstimateTreatment | null = null;
  priceTypeValues = Object.keys(PriceType);
  shValues = Object.keys(Sh);
  treatmentTypeValues = Object.keys(TreatmentType);
  estimateTreatmentReasonValues = Object.keys(EstimateTreatmentReason);

  estimatesSharedCollection: IEstimate[] = [];

  protected estimateTreatmentService = inject(EstimateTreatmentService);
  protected estimateTreatmentFormService = inject(EstimateTreatmentFormService);
  protected estimateService = inject(EstimateService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EstimateTreatmentFormGroup = this.estimateTreatmentFormService.createEstimateTreatmentFormGroup();

  compareEstimate = (o1: IEstimate | null, o2: IEstimate | null): boolean => this.estimateService.compareEstimate(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estimateTreatment }) => {
      this.estimateTreatment = estimateTreatment;
      if (estimateTreatment) {
        this.updateForm(estimateTreatment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estimateTreatment = this.estimateTreatmentFormService.getEstimateTreatment(this.editForm);
    if (estimateTreatment.id !== null) {
      this.subscribeToSaveResponse(this.estimateTreatmentService.update(estimateTreatment));
    } else {
      this.subscribeToSaveResponse(this.estimateTreatmentService.create(estimateTreatment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstimateTreatment>>): void {
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

  protected updateForm(estimateTreatment: IEstimateTreatment): void {
    this.estimateTreatment = estimateTreatment;
    this.estimateTreatmentFormService.resetForm(this.editForm, estimateTreatment);

    this.estimatesSharedCollection = this.estimateService.addEstimateToCollectionIfMissing<IEstimate>(
      this.estimatesSharedCollection,
      estimateTreatment.estimate,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.estimateService
      .query()
      .pipe(map((res: HttpResponse<IEstimate[]>) => res.body ?? []))
      .pipe(
        map((estimates: IEstimate[]) =>
          this.estimateService.addEstimateToCollectionIfMissing<IEstimate>(estimates, this.estimateTreatment?.estimate),
        ),
      )
      .subscribe((estimates: IEstimate[]) => (this.estimatesSharedCollection = estimates));
  }
}
