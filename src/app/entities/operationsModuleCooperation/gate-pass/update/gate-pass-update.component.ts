import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IJobCard } from 'app/entities/operationsModule/job-card/job-card.model';
import { JobCardService } from 'app/entities/operationsModule/job-card/service/job-card.service';
import { GatePassState } from 'app/entities/enumerations/gate-pass-state.model';
import { GatePassService } from '../service/gate-pass.service';
import { IGatePass } from '../gate-pass.model';
import { GatePassFormGroup, GatePassFormService } from './gate-pass-form.service';

@Component({
  selector: 'jhi-gate-pass-update',
  templateUrl: './gate-pass-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GatePassUpdateComponent implements OnInit {
  isSaving = false;
  gatePass: IGatePass | null = null;
  gatePassStateValues = Object.keys(GatePassState);

  jobCardsCollection: IJobCard[] = [];

  protected gatePassService = inject(GatePassService);
  protected gatePassFormService = inject(GatePassFormService);
  protected jobCardService = inject(JobCardService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GatePassFormGroup = this.gatePassFormService.createGatePassFormGroup();

  compareJobCard = (o1: IJobCard | null, o2: IJobCard | null): boolean => this.jobCardService.compareJobCard(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gatePass }) => {
      this.gatePass = gatePass;
      if (gatePass) {
        this.updateForm(gatePass);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gatePass = this.gatePassFormService.getGatePass(this.editForm);
    if (gatePass.id !== null) {
      this.subscribeToSaveResponse(this.gatePassService.update(gatePass));
    } else {
      this.subscribeToSaveResponse(this.gatePassService.create(gatePass));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGatePass>>): void {
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

  protected updateForm(gatePass: IGatePass): void {
    this.gatePass = gatePass;
    this.gatePassFormService.resetForm(this.editForm, gatePass);

    this.jobCardsCollection = this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(this.jobCardsCollection, gatePass.jobCard);
  }

  protected loadRelationshipsOptions(): void {
    this.jobCardService
      .query({ 'gatePassId.specified': 'false' })
      .pipe(map((res: HttpResponse<IJobCard[]>) => res.body ?? []))
      .pipe(map((jobCards: IJobCard[]) => this.jobCardService.addJobCardToCollectionIfMissing<IJobCard>(jobCards, this.gatePass?.jobCard)))
      .subscribe((jobCards: IJobCard[]) => (this.jobCardsCollection = jobCards));
  }
}
