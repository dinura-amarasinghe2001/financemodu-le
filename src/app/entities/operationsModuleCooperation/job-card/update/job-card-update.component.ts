import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJobCard } from '../job-card.model';
import { JobCardService } from '../service/job-card.service';
import { JobCardFormGroup, JobCardFormService } from './job-card-form.service';

@Component({
  selector: 'jhi-job-card-update',
  templateUrl: './job-card-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class JobCardUpdateComponent implements OnInit {
  isSaving = false;
  jobCard: IJobCard | null = null;

  protected jobCardService = inject(JobCardService);
  protected jobCardFormService = inject(JobCardFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: JobCardFormGroup = this.jobCardFormService.createJobCardFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ jobCard }) => {
      this.jobCard = jobCard;
      if (jobCard) {
        this.updateForm(jobCard);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const jobCard = this.jobCardFormService.getJobCard(this.editForm);
    if (jobCard.id !== null) {
      this.subscribeToSaveResponse(this.jobCardService.update(jobCard));
    } else {
      this.subscribeToSaveResponse(this.jobCardService.create(jobCard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJobCard>>): void {
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

  protected updateForm(jobCard: IJobCard): void {
    this.jobCard = jobCard;
    this.jobCardFormService.resetForm(this.editForm, jobCard);
  }
}
