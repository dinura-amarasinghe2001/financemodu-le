import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJobCard } from 'app/entities/operationsModuleCooperation/job-card/job-card.model';
import { JobCardService } from 'app/entities/operationsModuleCooperation/job-card/service/job-card.service';
import { JobItemType } from 'app/entities/enumerations/job-item-type.model';
import { JobItemTimeEstimationService } from '../service/job-item-time-estimation.service';
import { IJobItemTimeEstimation } from '../job-item-time-estimation.model';
import { JobItemTimeEstimationFormGroup, JobItemTimeEstimationFormService } from './job-item-time-estimation-form.service';

@Component({
  selector: 'jhi-job-item-time-estimation-update',
  templateUrl: './job-item-time-estimation-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobItemTimeEstimationUpdateComponent implements OnInit {
  isSaving = false;
  jobItemTimeEstimation: IJobItemTimeEstimation | null = null;
  jobItemTypeValues = Object.keys(JobItemType);

  jobCardsSharedCollection: IJobCard[] = [];

  protected jobItemTimeEstimationService = inject(JobItemTimeEstimationService);
  protected jobItemTimeEstimationFormService = inject(JobItemTimeEstimationFormService);
  protected jobCardService = inject(JobCardService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobItemTimeEstimationFormGroup = this.jobItemTimeEstimationFormService.createJobItemTimeEstimationFormGroup();

  compareJobCard = (o1: IJobCard | null, o2: IJobCard | null): boolean => this.jobCardService.compareJobCard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobItemTimeEstimation }) => {
      this.jobItemTimeEstimation = jobItemTimeEstimation;
      if (jobItemTimeEstimation) {
        this.updateForm(jobItemTimeEstimation);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobItemTimeEstimation = this.jobItemTimeEstimationFormService.getJobItemTimeEstimation(this.editForm);
    if (jobItemTimeEstimation.id !== null) {
      this.subscribeToSaveResponse(this.jobItemTimeEstimationService.update(jobItemTimeEstimation));
    } else {
      this.subscribeToSaveResponse(this.jobItemTimeEstimationService.create(jobItemTimeEstimation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobItemTimeEstimation>>): void {
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

  protected updateForm(jobItemTimeEstimation: IJobItemTimeEstimation): void {
    this.jobItemTimeEstimation = jobItemTimeEstimation;
    this.jobItemTimeEstimationFormService.resetForm(this.editForm, jobItemTimeEstimation);

    this.jobCardsSharedCollection = this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(
      this.jobCardsSharedCollection,
      jobItemTimeEstimation.jobCard,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobCardService
      .query()
      .pipe(map((res: HttpResponse<IJobCard[]>) => res.body ?? []))
      .pipe(
        map((jobCards: IJobCard[]) =>
          this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(jobCards, this.jobItemTimeEstimation?.jobCard),
        ),
      )
      .subscribe((jobCards: IJobCard[]) => (this.jobCardsSharedCollection = jobCards));
  }
}
