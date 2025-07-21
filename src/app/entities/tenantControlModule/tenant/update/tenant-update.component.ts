import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TenantBusinessType } from 'app/entities/enumerations/tenant-business-type.model';
import { LevelType } from 'app/entities/enumerations/level-type.model';
import { LevelStatus } from 'app/entities/enumerations/level-status.model';
import { TenantService } from '../service/tenant.service';
import { ITenant } from '../tenant.model';
import { TenantFormGroup, TenantFormService } from './tenant-form.service';

@Component({
  selector: 'jhi-tenant-update',
  templateUrl: './tenant-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class TenantUpdateComponent implements OnInit {
  isSaving = false;
  tenant: ITenant | null = null;
  tenantBusinessTypeValues = Object.keys(TenantBusinessType);
  levelTypeValues = Object.keys(LevelType);
  levelStatusValues = Object.keys(LevelStatus);

  protected tenantService = inject(TenantService);
  protected tenantFormService = inject(TenantFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: TenantFormGroup = this.tenantFormService.createTenantFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tenant }) => {
      this.tenant = tenant;
      if (tenant) {
        this.updateForm(tenant);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tenant = this.tenantFormService.getTenant(this.editForm);
    if (tenant.id !== null) {
      this.subscribeToSaveResponse(this.tenantService.update(tenant));
    } else {
      this.subscribeToSaveResponse(this.tenantService.create(tenant));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITenant>>): void {
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

  protected updateForm(tenant: ITenant): void {
    this.tenant = tenant;
    this.tenantFormService.resetForm(this.editForm, tenant);
  }
}
