import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IVehicleRegistry } from 'app/entities/operationsModule/vehicle-registry/vehicle-registry.model';
import { VehicleRegistryService } from 'app/entities/operationsModule/vehicle-registry/service/vehicle-registry.service';
import { IClientRegistry } from 'app/entities/operationsModule/client-registry/client-registry.model';
import { ClientRegistryService } from 'app/entities/operationsModule/client-registry/service/client-registry.service';
import { AppointmentType } from 'app/entities/enumerations/appointment-type.model';
import { AppointmentService } from '../service/appointment.service';
import { IAppointment } from '../appointment.model';
import { AppointmentFormGroup, AppointmentFormService } from './appointment-form.service';

@Component({
  selector: 'jhi-appointment-update',
  templateUrl: './appointment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AppointmentUpdateComponent implements OnInit {
  isSaving = false;
  appointment: IAppointment | null = null;
  appointmentTypeValues = Object.keys(AppointmentType);

  vehicleRegistriesCollection: IVehicleRegistry[] = [];
  clientRegistriesCollection: IClientRegistry[] = [];

  protected appointmentService = inject(AppointmentService);
  protected appointmentFormService = inject(AppointmentFormService);
  protected vehicleRegistryService = inject(VehicleRegistryService);
  protected clientRegistryService = inject(ClientRegistryService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: AppointmentFormGroup = this.appointmentFormService.createAppointmentFormGroup();

  compareVehicleRegistry = (o1: IVehicleRegistry | null, o2: IVehicleRegistry | null): boolean =>
    this.vehicleRegistryService.compareVehicleRegistry(o1, o2);

  compareClientRegistry = (o1: IClientRegistry | null, o2: IClientRegistry | null): boolean =>
    this.clientRegistryService.compareClientRegistry(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ appointment }) => {
      this.appointment = appointment;
      if (appointment) {
        this.updateForm(appointment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const appointment = this.appointmentFormService.getAppointment(this.editForm);
    if (appointment.id !== null) {
      this.subscribeToSaveResponse(this.appointmentService.update(appointment));
    } else {
      this.subscribeToSaveResponse(this.appointmentService.create(appointment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAppointment>>): void {
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

  protected updateForm(appointment: IAppointment): void {
    this.appointment = appointment;
    this.appointmentFormService.resetForm(this.editForm, appointment);

    this.vehicleRegistriesCollection = this.vehicleRegistryService.addVehicleRegistryToCollectionIfMissing<IVehicleRegistry>(
      this.vehicleRegistriesCollection,
      appointment.vehicleRegistry,
    );
    this.clientRegistriesCollection = this.clientRegistryService.addClientRegistryToCollectionIfMissing<IClientRegistry>(
      this.clientRegistriesCollection,
      appointment.clientRegistry,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vehicleRegistryService
      .query({ 'appointmentId.specified': 'false' })
      .pipe(map((res: HttpResponse<IVehicleRegistry[]>) => res.body ?? []))
      .pipe(
        map((vehicleRegistries: IVehicleRegistry[]) =>
          this.vehicleRegistryService.addVehicleRegistryToCollectionIfMissing<IVehicleRegistry>(
            vehicleRegistries,
            this.appointment?.vehicleRegistry,
          ),
        ),
      )
      .subscribe((vehicleRegistries: IVehicleRegistry[]) => (this.vehicleRegistriesCollection = vehicleRegistries));

    this.clientRegistryService
      .query({ 'appointmentId.specified': 'false' })
      .pipe(map((res: HttpResponse<IClientRegistry[]>) => res.body ?? []))
      .pipe(
        map((clientRegistries: IClientRegistry[]) =>
          this.clientRegistryService.addClientRegistryToCollectionIfMissing<IClientRegistry>(
            clientRegistries,
            this.appointment?.clientRegistry,
          ),
        ),
      )
      .subscribe((clientRegistries: IClientRegistry[]) => (this.clientRegistriesCollection = clientRegistries));
  }
}
