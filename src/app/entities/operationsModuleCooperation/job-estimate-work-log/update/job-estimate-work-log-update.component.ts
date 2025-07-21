import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJobEstimate } from 'app/entities/operationsModule/job-estimate/job-estimate.model';
import { JobEstimateService } from 'app/entities/operationsModule/job-estimate/service/job-estimate.service';
import { IJobEstimateWorkLog } from '../job-estimate-work-log.model';
import { JobEstimateWorkLogService } from '../service/job-estimate-work-log.service';
import { JobEstimateWorkLogFormGroup, JobEstimateWorkLogFormService } from './job-estimate-work-log-form.service';

@Component({
  selector: 'jhi-job-estimate-work-log-update',
  templateUrl: './job-estimate-work-log-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobEstimateWorkLogUpdateComponent implements OnInit {
  isSaving = false;
  jobEstimateWorkLog: IJobEstimateWorkLog | null = null;

  jobEstimatesSharedCollection: IJobEstimate[] = [];

  protected jobEstimateWorkLogService = inject(JobEstimateWorkLogService);
  protected jobEstimateWorkLogFormService = inject(JobEstimateWorkLogFormService);
  protected jobEstimateService = inject(JobEstimateService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobEstimateWorkLogFormGroup = this.jobEstimateWorkLogFormService.createJobEstimateWorkLogFormGroup();

  compareJobEstimate = (o1: IJobEstimate | null, o2: IJobEstimate | null): boolean => this.jobEstimateService.compareJobEstimate(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobEstimateWorkLog }) => {
      this.jobEstimateWorkLog = jobEstimateWorkLog;
      if (jobEstimateWorkLog) {
        this.updateForm(jobEstimateWorkLog);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobEstimateWorkLog = this.jobEstimateWorkLogFormService.getJobEstimateWorkLog(this.editForm);
    if (jobEstimateWorkLog.id !== null) {
      this.subscribeToSaveResponse(this.jobEstimateWorkLogService.update(jobEstimateWorkLog));
    } else {
      this.subscribeToSaveResponse(this.jobEstimateWorkLogService.create(jobEstimateWorkLog));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobEstimateWorkLog>>): void {
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

  protected updateForm(jobEstimateWorkLog: IJobEstimateWorkLog): void {
    this.jobEstimateWorkLog = jobEstimateWorkLog;
    this.jobEstimateWorkLogFormService.resetForm(this.editForm, jobEstimateWorkLog);

    this.jobEstimatesSharedCollection = this.jobEstimateService.addJobEstimateToCollectionIfMissing<IJobEstimate>(
      this.jobEstimatesSharedCollection,
      jobEstimateWorkLog.jobEstimate,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.jobEstimateService
      .query()
      .pipe(map((res: HttpResponse<IJobEstimate[]>) => res.body ?? []))
      .pipe(
        map((jobEstimates: IJobEstimate[]) =>
          this.jobEstimateService.addJobEstimateToCollectionIfMissing<IJobEstimate>(jobEstimates, this.jobEstimateWorkLog?.jobEstimate),
        ),
      )
      .subscribe((jobEstimates: IJobEstimate[]) => (this.jobEstimatesSharedCollection = jobEstimates));
  }
}
