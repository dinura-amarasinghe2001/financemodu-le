import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITenant } from 'app/entities/tenantControlModule/tenant/tenant.model';
import { TenantService } from 'app/entities/tenantControlModule/tenant/service/tenant.service';
import { LevelBusinessType } from 'app/entities/enumerations/level-business-type.model';
import { LevelType } from 'app/entities/enumerations/level-type.model';
import { OperationalUnitService } from '../service/operational-unit.service';
import { IOperationalUnit } from '../operational-unit.model';
import { OperationalUnitFormGroup, OperationalUnitFormService } from './operational-unit-form.service';

@Component({
  selector: 'jhi-operational-unit-update',
  templateUrl: './operational-unit-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class OperationalUnitUpdateComponent implements OnInit {
  isSaving = false;
  operationalUnit: IOperationalUnit | null = null;
  levelBusinessTypeValues = Object.keys(LevelBusinessType);
  levelTypeValues = Object.keys(LevelType);

  tenantsSharedCollection: ITenant[] = [];

  protected operationalUnitService = inject(OperationalUnitService);
  protected operationalUnitFormService = inject(OperationalUnitFormService);
  protected tenantService = inject(TenantService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: OperationalUnitFormGroup = this.operationalUnitFormService.createOperationalUnitFormGroup();

  compareTenant = (o1: ITenant | null, o2: ITenant | null): boolean => this.tenantService.compareTenant(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ operationalUnit }) => {
      this.operationalUnit = operationalUnit;
      if (operationalUnit) {
        this.updateForm(operationalUnit);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const operationalUnit = this.operationalUnitFormService.getOperationalUnit(this.editForm);
    if (operationalUnit.id !== null) {
      this.subscribeToSaveResponse(this.operationalUnitService.update(operationalUnit));
    } else {
      this.subscribeToSaveResponse(this.operationalUnitService.create(operationalUnit));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOperationalUnit>>): void {
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

  protected updateForm(operationalUnit: IOperationalUnit): void {
    this.operationalUnit = operationalUnit;
    this.operationalUnitFormService.resetForm(this.editForm, operationalUnit);

    this.tenantsSharedCollection = this.tenantService.addTenantToCollectionIfMissing<ITenant>(
      this.tenantsSharedCollection,
      operationalUnit.tenant,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.tenantService
      .query()
      .pipe(map((res: HttpResponse<ITenant[]>) => res.body ?? []))
      .pipe(map((tenants: ITenant[]) => this.tenantService.addTenantToCollectionIfMissing<ITenant>(tenants, this.operationalUnit?.tenant)))
      .subscribe((tenants: ITenant[]) => (this.tenantsSharedCollection = tenants));
  }
}
