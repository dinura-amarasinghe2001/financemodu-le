import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJobCard } from 'app/entities/operationsModule/job-card/job-card.model';
import { JobCardService } from 'app/entities/operationsModule/job-card/service/job-card.service';
import { JobCurrentState } from 'app/entities/enumerations/job-current-state.model';
import { JobEstimateService } from '../service/job-estimate.service';
import { IJobEstimate } from '../job-estimate.model';
import { JobEstimateFormGroup, JobEstimateFormService } from './job-estimate-form.service';

@Component({
  selector: 'jhi-job-estimate-update',
  templateUrl: './job-estimate-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobEstimateUpdateComponent implements OnInit {
  isSaving = false;
  jobEstimate: IJobEstimate | null = null;
  jobCurrentStateValues = Object.keys(JobCurrentState);

  jobCardsSharedCollection: IJobCard[] = [];

  protected jobEstimateService = inject(JobEstimateService);
  protected jobEstimateFormService = inject(JobEstimateFormService);
  protected jobCardService = inject(JobCardService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobEstimateFormGroup = this.jobEstimateFormService.createJobEstimateFormGroup();

  compareJobCard = (o1: IJobCard | null, o2: IJobCard | null): boolean => this.jobCardService.compareJobCard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobEstimate }) => {
      this.jobEstimate = jobEstimate;
      if (jobEstimate) {
        this.updateForm(jobEstimate);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobEstimate = this.jobEstimateFormService.getJobEstimate(this.editForm);
    if (jobEstimate.id !== null) {
      this.subscribeToSaveResponse(this.jobEstimateService.update(jobEstimate));
    } else {
      this.subscribeToSaveResponse(this.jobEstimateService.create(jobEstimate));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobEstimate>>): void {
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

  protected updateForm(jobEstimate: IJobEstimate): void {
    this.jobEstimate = jobEstimate;
    this.jobEstimateFormService.resetForm(this.editForm, jobEstimate);

    this.jobCardsSharedCollection = this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(
      this.jobCardsSharedCollection,
      jobEstimate.jobCard,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobCardService
      .query()
      .pipe(map((res: HttpResponse<IJobCard[]>) => res.body ?? []))
      .pipe(
        map((jobCards: IJobCard[]) => this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(jobCards, this.jobEstimate?.jobCard)),
      )
      .subscribe((jobCards: IJobCard[]) => (this.jobCardsSharedCollection = jobCards));
  }
}
