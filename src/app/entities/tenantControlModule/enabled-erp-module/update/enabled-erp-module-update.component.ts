import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IOperationalUnit } from 'app/entities/tenantControlModule/operational-unit/operational-unit.model';
import { OperationalUnitService } from 'app/entities/tenantControlModule/operational-unit/service/operational-unit.service';
import { IEnabledERPModule } from '../enabled-erp-module.model';
import { EnabledERPModuleService } from '../service/enabled-erp-module.service';
import { EnabledERPModuleFormGroup, EnabledERPModuleFormService } from './enabled-erp-module-form.service';

@Component({
  selector: 'jhi-enabled-erp-module-update',
  templateUrl: './enabled-erp-module-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EnabledERPModuleUpdateComponent implements OnInit {
  isSaving = false;
  enabledERPModule: IEnabledERPModule | null = null;

  operationalUnitsSharedCollection: IOperationalUnit[] = [];

  protected enabledERPModuleService = inject(EnabledERPModuleService);
  protected enabledERPModuleFormService = inject(EnabledERPModuleFormService);
  protected operationalUnitService = inject(OperationalUnitService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EnabledERPModuleFormGroup = this.enabledERPModuleFormService.createEnabledERPModuleFormGroup();

  compareOperationalUnit = (o1: IOperationalUnit | null, o2: IOperationalUnit | null): boolean =>
    this.operationalUnitService.compareOperationalUnit(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ enabledERPModule }) => {
      this.enabledERPModule = enabledERPModule;
      if (enabledERPModule) {
        this.updateForm(enabledERPModule);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const enabledERPModule = this.enabledERPModuleFormService.getEnabledERPModule(this.editForm);
    if (enabledERPModule.id !== null) {
      this.subscribeToSaveResponse(this.enabledERPModuleService.update(enabledERPModule));
    } else {
      this.subscribeToSaveResponse(this.enabledERPModuleService.create(enabledERPModule));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnabledERPModule>>): void {
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

  protected updateForm(enabledERPModule: IEnabledERPModule): void {
    this.enabledERPModule = enabledERPModule;
    this.enabledERPModuleFormService.resetForm(this.editForm, enabledERPModule);

    this.operationalUnitsSharedCollection = this.operationalUnitService.addOperationalUnitToCollectionIfMissing<IOperationalUnit>(
      this.operationalUnitsSharedCollection,
      enabledERPModule.operationalUnit,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.operationalUnitService
      .query()
      .pipe(map((res: HttpResponse<IOperationalUnit[]>) => res.body ?? []))
      .pipe(
        map((operationalUnits: IOperationalUnit[]) =>
          this.operationalUnitService.addOperationalUnitToCollectionIfMissing<IOperationalUnit>(
            operationalUnits,
            this.enabledERPModule?.operationalUnit,
          ),
        ),
      )
      .subscribe((operationalUnits: IOperationalUnit[]) => (this.operationalUnitsSharedCollection = operationalUnits));
  }
}
