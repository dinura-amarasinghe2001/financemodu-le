import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IGRN } from '../grn.model';
import { GRNService } from '../service/grn.service';
import { GRNFormGroup, GRNFormService } from './grn-form.service';

@Component({
  selector: 'jhi-grn-update',
  templateUrl: './grn-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GRNUpdateComponent implements OnInit {
  isSaving = false;
  gRN: IGRN | null = null;

  protected gRNService = inject(GRNService);
  protected gRNFormService = inject(GRNFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: GRNFormGroup = this.gRNFormService.createGRNFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gRN }) => {
      this.gRN = gRN;
      if (gRN) {
        this.updateForm(gRN);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gRN = this.gRNFormService.getGRN(this.editForm);
    if (gRN.id !== null) {
      this.subscribeToSaveResponse(this.gRNService.update(gRN));
    } else {
      this.subscribeToSaveResponse(this.gRNService.create(gRN));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGRN>>): void {
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

  protected updateForm(gRN: IGRN): void {
    this.gRN = gRN;
    this.gRNFormService.resetForm(this.editForm, gRN);
  }
}
