import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IBrand } from 'app/entities/operationsModuleCooperation/brand/brand.model';
import { BrandService } from 'app/entities/operationsModuleCooperation/brand/service/brand.service';
import { IVehicleModel } from '../vehicle-model.model';
import { VehicleModelService } from '../service/vehicle-model.service';
import { VehicleModelFormGroup, VehicleModelFormService } from './vehicle-model-form.service';

@Component({
  selector: 'jhi-vehicle-model-update',
  templateUrl: './vehicle-model-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class VehicleModelUpdateComponent implements OnInit {
  isSaving = false;
  vehicleModel: IVehicleModel | null = null;

  brandsSharedCollection: IBrand[] = [];

  protected vehicleModelService = inject(VehicleModelService);
  protected vehicleModelFormService = inject(VehicleModelFormService);
  protected brandService = inject(BrandService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: VehicleModelFormGroup = this.vehicleModelFormService.createVehicleModelFormGroup();

  compareBrand = (o1: IBrand | null, o2: IBrand | null): boolean => this.brandService.compareBrand(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehicleModel }) => {
      this.vehicleModel = vehicleModel;
      if (vehicleModel) {
        this.updateForm(vehicleModel);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehicleModel = this.vehicleModelFormService.getVehicleModel(this.editForm);
    if (vehicleModel.id !== null) {
      this.subscribeToSaveResponse(this.vehicleModelService.update(vehicleModel));
    } else {
      this.subscribeToSaveResponse(this.vehicleModelService.create(vehicleModel));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehicleModel>>): void {
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

  protected updateForm(vehicleModel: IVehicleModel): void {
    this.vehicleModel = vehicleModel;
    this.vehicleModelFormService.resetForm(this.editForm, vehicleModel);

    this.brandsSharedCollection = this.brandService.addBrandToCollectionIfMissing<IBrand>(this.brandsSharedCollection, vehicleModel.brand);
  }

  protected loadRelationshipsOptions(): void {
    this.brandService
      .query()
      .pipe(map((res: HttpResponse<IBrand[]>) => res.body ?? []))
      .pipe(map((brands: IBrand[]) => this.brandService.addBrandToCollectionIfMissing<IBrand>(brands, this.vehicleModel?.brand)))
      .subscribe((brands: IBrand[]) => (this.brandsSharedCollection = brands));
  }
}
