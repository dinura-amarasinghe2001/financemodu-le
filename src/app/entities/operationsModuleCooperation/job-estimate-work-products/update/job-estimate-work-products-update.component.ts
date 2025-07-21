import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJobEstimateWorkLog } from 'app/entities/operationsModule/job-estimate-work-log/job-estimate-work-log.model';
import { JobEstimateWorkLogService } from 'app/entities/operationsModule/job-estimate-work-log/service/job-estimate-work-log.service';
import { IJobEstimateWorkProducts } from '../job-estimate-work-products.model';
import { JobEstimateWorkProductsService } from '../service/job-estimate-work-products.service';
import { JobEstimateWorkProductsFormGroup, JobEstimateWorkProductsFormService } from './job-estimate-work-products-form.service';

@Component({
  selector: 'jhi-job-estimate-work-products-update',
  templateUrl: './job-estimate-work-products-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobEstimateWorkProductsUpdateComponent implements OnInit {
  isSaving = false;
  jobEstimateWorkProducts: IJobEstimateWorkProducts | null = null;

  jobEstimateWorkLogsSharedCollection: IJobEstimateWorkLog[] = [];

  protected jobEstimateWorkProductsService = inject(JobEstimateWorkProductsService);
  protected jobEstimateWorkProductsFormService = inject(JobEstimateWorkProductsFormService);
  protected jobEstimateWorkLogService = inject(JobEstimateWorkLogService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobEstimateWorkProductsFormGroup = this.jobEstimateWorkProductsFormService.createJobEstimateWorkProductsFormGroup();

  compareJobEstimateWorkLog = (o1: IJobEstimateWorkLog | null, o2: IJobEstimateWorkLog | null): boolean =>
    this.jobEstimateWorkLogService.compareJobEstimateWorkLog(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobEstimateWorkProducts }) => {
      this.jobEstimateWorkProducts = jobEstimateWorkProducts;
      if (jobEstimateWorkProducts) {
        this.updateForm(jobEstimateWorkProducts);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobEstimateWorkProducts = this.jobEstimateWorkProductsFormService.getJobEstimateWorkProducts(this.editForm);
    if (jobEstimateWorkProducts.id !== null) {
      this.subscribeToSaveResponse(this.jobEstimateWorkProductsService.update(jobEstimateWorkProducts));
    } else {
      this.subscribeToSaveResponse(this.jobEstimateWorkProductsService.create(jobEstimateWorkProducts));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobEstimateWorkProducts>>): void {
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

  protected updateForm(jobEstimateWorkProducts: IJobEstimateWorkProducts): void {
    this.jobEstimateWorkProducts = jobEstimateWorkProducts;
    this.jobEstimateWorkProductsFormService.resetForm(this.editForm, jobEstimateWorkProducts);

    this.jobEstimateWorkLogsSharedCollection =
      this.jobEstimateWorkLogService.addJobEstimateWorkLogToCollectionIfMissing<IJobEstimateWorkLog>(
        this.jobEstimateWorkLogsSharedCollection,
        jobEstimateWorkProducts.jobEstimateWorkLog,
      );
  }

  protected loadRelationshipsOptions(): void {
    this.jobEstimateWorkLogService
      .query()
      .pipe(map((res: HttpResponse<IJobEstimateWorkLog[]>) => res.body ?? []))
      .pipe(
        map((jobEstimateWorkLogs: IJobEstimateWorkLog[]) =>
          this.jobEstimateWorkLogService.addJobEstimateWorkLogToCollectionIfMissing<IJobEstimateWorkLog>(
            jobEstimateWorkLogs,
            this.jobEstimateWorkProducts?.jobEstimateWorkLog,
          ),
        ),
      )
      .subscribe((jobEstimateWorkLogs: IJobEstimateWorkLog[]) => (this.jobEstimateWorkLogsSharedCollection = jobEstimateWorkLogs));
  }
}
