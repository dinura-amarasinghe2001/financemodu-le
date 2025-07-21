import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBinCard } from '../bin-card.model';
import { BinCardService } from '../service/bin-card.service';
import { BinCardFormGroup, BinCardFormService } from './bin-card-form.service';

@Component({
  selector: 'jhi-bin-card-update',
  templateUrl: './bin-card-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BinCardUpdateComponent implements OnInit {
  isSaving = false;
  binCard: IBinCard | null = null;

  protected binCardService = inject(BinCardService);
  protected binCardFormService = inject(BinCardFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: BinCardFormGroup = this.binCardFormService.createBinCardFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ binCard }) => {
      this.binCard = binCard;
      if (binCard) {
        this.updateForm(binCard);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const binCard = this.binCardFormService.getBinCard(this.editForm);
    if (binCard.id !== null) {
      this.subscribeToSaveResponse(this.binCardService.update(binCard));
    } else {
      this.subscribeToSaveResponse(this.binCardService.create(binCard));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBinCard>>): void {
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

  protected updateForm(binCard: IBinCard): void {
    this.binCard = binCard;
    this.binCardFormService.resetForm(this.editForm, binCard);
  }
}
