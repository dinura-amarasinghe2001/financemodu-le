import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from "@angular/material/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {
  IAppointment,
  NewAppointment,
} from "app/entities/operationsModuleCooperation/appointment/appointment.model";
import { AppointmentService } from "app/entities/operationsModuleCooperation/appointment/service/appointment.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";
import { MatSelectModule } from "@angular/material/select";
import {
  AppointmentFormGroup,
  AppointmentFormService,
} from "app/entities/operationsModuleCooperation/appointment/update/appointment-form.service";
import dayjs from "dayjs/esm";
import { Router, RouterLink } from "@angular/router";
import { VehicleRegistryService } from "app/entities/operationsModuleCooperation/vehicle-registry/service/vehicle-registry.service";
import { ClientRegistryService } from "app/entities/operationsModuleCooperation/client-registry/service/client-registry.service";
import { debounceTime, distinctUntilChanged, filter } from "rxjs/operators";

@Component({
  selector: "app-create-appointment",
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatSelectModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./create-appointment.component.html",
  styleUrl: "./create-appointment.component.scss",
})
export class CreateAppointmentComponent implements OnInit {
  appointmentFormService = inject(AppointmentFormService);
  appointmentForm: AppointmentFormGroup =
    this.appointmentFormService.createAppointmentFormGroup();

  value: Date;
  appointmentDateTime: any;

  appDate = new FormControl();
  appTime = new FormControl();
  searchInputControl = new FormControl();
  vehicleDetails: any = null;
  clientDetails: any = null;

  constructor(
    public dialogRef: MatDialogRef<CreateAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      appointment: IAppointment;
    },
    private _fb: FormBuilder,
    private _appointmentRegistryService: AppointmentService,
    private _selectedCardService: SelectedCardService,
    private _vehicleRegistryService: VehicleRegistryService,
    private _clientRegistryService: ClientRegistryService
  ) {}

  ngOnInit(): void {
    if (this.data?.appointment?.appointmentDateTime) {
      const dateTime = dayjs(this.data.appointment.appointmentDateTime);

      // Set date and time form controls
      this.appDate.setValue(dateTime.toDate());
      this.appTime.setValue(dateTime.toDate());
    }

    // Populate form with existing appointment data if available
    if (this.data?.appointment) {
      this.appointmentFormService.resetForm(
        this.appointmentForm,
        this.data.appointment
      );
    }

    // Listen for search input changes with debounce and validation
    this.searchInputControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms after the last keystroke
        distinctUntilChanged(), // Only proceed if the value has changed
        filter((licenseNo) => licenseNo && licenseNo.trim().length >= 6) // Proceed only if input is valid
      )
      .subscribe((licenseNo) => {
        this.searchVehicleAndClient(licenseNo.trim());
      });

    // Fetch selected vehicle and client details from the dashboard and populate the form
    this._selectedCardService.selectedCard$.subscribe((selectedCard) => {
      if (selectedCard) {
        this.vehicleDetails = selectedCard.vehicle;
        this.clientDetails = selectedCard.client;
        this.populateFormWithVehicleAndClient();
      }
    });
  }

  searchVehicleAndClient(licenseNo: string): void {
    const params = {
      page: "0",
      size: "5",
      "licenseNo.contains": licenseNo,
    };

    this._vehicleRegistryService.query(params).subscribe({
      next: (vehicleRes) => {
        this.vehicleDetails = vehicleRes.body?.[0] || null;
        if (this.vehicleDetails?.id) {
          const clientParams = {
            page: "0",
            size: "5",
            "id.equals": this.vehicleDetails.clientRegistry?.id,
          };

          this._clientRegistryService.query(clientParams).subscribe({
            next: (clientRes) => {
              this.clientDetails = clientRes.body?.[0] || null;
              this.populateFormWithVehicleAndClient();
            },
            error: () => {
              this.clientDetails = null;
            },
          });
        } else {
          this.vehicleDetails = null;
          this.clientDetails = null;
        }
      },
      error: () => {
        this.vehicleDetails = null;
        this.clientDetails = null;
      },
    });
  }

  populateFormWithVehicleAndClient(): void {
    if (this.vehicleDetails) {
      this.appointmentForm.patchValue({
        vehicleID: this.vehicleDetails.id,
        vehicleBrand: this.vehicleDetails.brand,
        vehicleModel: this.vehicleDetails.model,
        // licenseNo: this.vehicleDetails.licenseNo,
      });
    }

    if (this.clientDetails) {
      this.appointmentForm.patchValue({
        clientID: this.clientDetails.id,
        clientName: this.clientDetails.name,
        clientContactNumber1: this.clientDetails.contactNumber1,
        clientContactNumber2: this.clientDetails.contactNumber2,
        clientAddress: this.clientDetails.address,
        clientCity: this.clientDetails.city,
      });
    }
  }

  // Submit Appointment

  submitAppointment() {
    const appointmentData = this.appointmentFormService.getAppointment(
      this.appointmentForm
    );

    var date = new Date(
      dayjs(this.appDate.value).year(),
      dayjs(this.appDate.value).month(),
      dayjs(this.appDate.value).date(),
      dayjs(this.appTime.value).hour(),
      dayjs(this.appTime.value).minute()
    );
    //  alert(dayjs(dayjs( date).format('YYYY-MM-DDTHH:mm:ssZ'))) // show alert msg
    if (this.data?.appointment?.id) {
      const updatedData: IAppointment = {
        ...this.data.appointment,
        ...appointmentData,
        appointmentDateTime: dayjs(dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ")), // Format the date and time as needed
      };

      this._appointmentRegistryService
        .update(updatedData as IAppointment)
        .subscribe((response) => {
          console.log("Appointment Updated Successfully", response);
          this.dialogRef.close(true);
        }); // Update Appointment
    } else {
      this._appointmentRegistryService
        .create({
          ...appointmentData,
          appointmentDateTime: dayjs(
            dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ")
          ),
        } as unknown as NewAppointment)
        .subscribe((response) => {
          console.log("Appointment Created Successfully", response);
          this.dialogRef.close(true);
        }); // Create Appointment
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // Disable the previous datesin the Calender
  dateFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight
    return date ? date >= today : false; // Allow only today
  };
}
