import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicleRegistry } from '../vehicle-registry.model';
import { VehicleRegistryService } from '../service/vehicle-registry.service';
import { VehicleRegistryFormGroup, VehicleRegistryFormService } from './vehicle-registry-form.service';

@Component({
  selector: 'jhi-vehicle-registry-update',
  templateUrl: './vehicle-registry-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VehicleRegistryUpdateComponent implements OnInit {
  isSaving = false;
  vehicleRegistry: IVehicleRegistry | null = null;

  protected vehicleRegistryService = inject(VehicleRegistryService);
  protected vehicleRegistryFormService = inject(VehicleRegistryFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VehicleRegistryFormGroup = this.vehicleRegistryFormService.createVehicleRegistryFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicleRegistry }) => {
      this.vehicleRegistry = vehicleRegistry;
      if (vehicleRegistry) {
        this.updateForm(vehicleRegistry);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicleRegistry = this.vehicleRegistryFormService.getVehicleRegistry(this.editForm);
    if (vehicleRegistry.id !== null) {
      this.subscribeToSaveResponse(this.vehicleRegistryService.update(vehicleRegistry));
    } else {
      this.subscribeToSaveResponse(this.vehicleRegistryService.create(vehicleRegistry));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicleRegistry>>): void {
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

  protected updateForm(vehicleRegistry: IVehicleRegistry): void {
    this.vehicleRegistry = vehicleRegistry;
    this.vehicleRegistryFormService.resetForm(this.editForm, vehicleRegistry);
  }
}
