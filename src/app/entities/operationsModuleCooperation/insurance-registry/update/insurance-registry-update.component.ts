import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInsuranceRegistry } from '../insurance-registry.model';
import { InsuranceRegistryService } from '../service/insurance-registry.service';
import { InsuranceRegistryFormGroup, InsuranceRegistryFormService } from './insurance-registry-form.service';

@Component({
  selector: 'jhi-insurance-registry-update',
  templateUrl: './insurance-registry-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InsuranceRegistryUpdateComponent implements OnInit {
  isSaving = false;
  insuranceRegistry: IInsuranceRegistry | null = null;

  protected insuranceRegistryService = inject(InsuranceRegistryService);
  protected insuranceRegistryFormService = inject(InsuranceRegistryFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InsuranceRegistryFormGroup = this.insuranceRegistryFormService.createInsuranceRegistryFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ insuranceRegistry }) => {
      this.insuranceRegistry = insuranceRegistry;
      if (insuranceRegistry) {
        this.updateForm(insuranceRegistry);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const insuranceRegistry = this.insuranceRegistryFormService.getInsuranceRegistry(this.editForm);
    if (insuranceRegistry.id !== null) {
      this.subscribeToSaveResponse(this.insuranceRegistryService.update(insuranceRegistry));
    } else {
      this.subscribeToSaveResponse(this.insuranceRegistryService.create(insuranceRegistry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInsuranceRegistry>>): void {
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

  protected updateForm(insuranceRegistry: IInsuranceRegistry): void {
    this.insuranceRegistry = insuranceRegistry;
    this.insuranceRegistryFormService.resetForm(this.editForm, insuranceRegistry);
  }
}
