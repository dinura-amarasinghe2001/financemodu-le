import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITenant } from 'app/entities/tenantControlModule/tenant/tenant.model';
import { TenantService } from 'app/entities/tenantControlModule/tenant/service/tenant.service';
import { IFlag } from '../flag.model';
import { FlagService } from '../service/flag.service';
import { FlagFormGroup, FlagFormService } from './flag-form.service';

@Component({
  selector: 'jhi-flag-update',
  templateUrl: './flag-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class FlagUpdateComponent implements OnInit {
  isSaving = false;
  flag: IFlag | null = null;

  tenantsSharedCollection: ITenant[] = [];

  protected flagService = inject(FlagService);
  protected flagFormService = inject(FlagFormService);
  protected tenantService = inject(TenantService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: FlagFormGroup = this.flagFormService.createFlagFormGroup();

  compareTenant = (o1: ITenant | null, o2: ITenant | null): boolean => this.tenantService.compareTenant(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ flag }) => {
      this.flag = flag;
      if (flag) {
        this.updateForm(flag);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const flag = this.flagFormService.getFlag(this.editForm);
    if (flag.id !== null) {
      this.subscribeToSaveResponse(this.flagService.update(flag));
    } else {
      this.subscribeToSaveResponse(this.flagService.create(flag));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFlag>>): void {
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

  protected updateForm(flag: IFlag): void {
    this.flag = flag;
    this.flagFormService.resetForm(this.editForm, flag);

    this.tenantsSharedCollection = this.tenantService.addTenantToCollectionIfMissing<ITenant>(this.tenantsSharedCollection, flag.tenant);
  }

  protected loadRelationshipsOptions(): void {
    this.tenantService
      .query()
      .pipe(map((res: HttpResponse<ITenant[]>) => res.body ?? []))
      .pipe(map((tenants: ITenant[]) => this.tenantService.addTenantToCollectionIfMissing<ITenant>(tenants, this.flag?.tenant)))
      .subscribe((tenants: ITenant[]) => (this.tenantsSharedCollection = tenants));
  }
}
