import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicleModel } from 'app/entities/operationsModule/vehicle-model/vehicle-model.model';
import { VehicleModelService } from 'app/entities/operationsModule/vehicle-model/service/vehicle-model.service';
import { TreatmentType } from 'app/entities/enumerations/treatment-type.model';
import { VehicleTreatmentRegistryService } from '../service/vehicle-treatment-registry.service';
import { IVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';
import { VehicleTreatmentRegistryFormGroup, VehicleTreatmentRegistryFormService } from './vehicle-treatment-registry-form.service';

@Component({
  selector: 'jhi-vehicle-treatment-registry-update',
  templateUrl: './vehicle-treatment-registry-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VehicleTreatmentRegistryUpdateComponent implements OnInit {
  isSaving = false;
  vehicleTreatmentRegistry: IVehicleTreatmentRegistry | null = null;
  treatmentTypeValues = Object.keys(TreatmentType);

  vehicleModelsSharedCollection: IVehicleModel[] = [];

  protected vehicleTreatmentRegistryService = inject(VehicleTreatmentRegistryService);
  protected vehicleTreatmentRegistryFormService = inject(VehicleTreatmentRegistryFormService);
  protected vehicleModelService = inject(VehicleModelService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VehicleTreatmentRegistryFormGroup = this.vehicleTreatmentRegistryFormService.createVehicleTreatmentRegistryFormGroup();

  compareVehicleModel = (o1: IVehicleModel | null, o2: IVehicleModel | null): boolean =>
    this.vehicleModelService.compareVehicleModel(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicleTreatmentRegistry }) => {
      this.vehicleTreatmentRegistry = vehicleTreatmentRegistry;
      if (vehicleTreatmentRegistry) {
        this.updateForm(vehicleTreatmentRegistry);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicleTreatmentRegistry = this.vehicleTreatmentRegistryFormService.getVehicleTreatmentRegistry(this.editForm);
    if (vehicleTreatmentRegistry.id !== null) {
      this.subscribeToSaveResponse(this.vehicleTreatmentRegistryService.update(vehicleTreatmentRegistry));
    } else {
      this.subscribeToSaveResponse(this.vehicleTreatmentRegistryService.create(vehicleTreatmentRegistry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicleTreatmentRegistry>>): void {
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

  protected updateForm(vehicleTreatmentRegistry: IVehicleTreatmentRegistry): void {
    this.vehicleTreatmentRegistry = vehicleTreatmentRegistry;
    this.vehicleTreatmentRegistryFormService.resetForm(this.editForm, vehicleTreatmentRegistry);

    this.vehicleModelsSharedCollection = this.vehicleModelService.addVehicleModelToCollectionIfMissing<IVehicleModel>(
      this.vehicleModelsSharedCollection,
      vehicleTreatmentRegistry.vehicleModel,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleModelService
      .query()
      .pipe(map((res: HttpResponse<IVehicleModel[]>) => res.body ?? []))
      .pipe(
        map((vehicleModels: IVehicleModel[]) =>
          this.vehicleModelService.addVehicleModelToCollectionIfMissing<IVehicleModel>(
            vehicleModels,
            this.vehicleTreatmentRegistry?.vehicleModel,
          ),
        ),
      )
      .subscribe((vehicleModels: IVehicleModel[]) => (this.vehicleModelsSharedCollection = vehicleModels));
  }
}
