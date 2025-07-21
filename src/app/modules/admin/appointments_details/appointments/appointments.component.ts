import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { RouterLink } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { FuseAlertComponent } from "@fuse/components/alert";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { CreateAppointmentComponent } from "../create-appointment/create-appointment.component";
import { AppointmentService } from "app/entities/operationsModuleCooperation/appointment/service/appointment.service";
import { IAppointment } from "app/entities/operationsModuleCooperation/appointment/appointment.model";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
  selector: "app-appointments",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocomplete,
  ],
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.scss",
})
export class AppointmentsComponent implements OnInit {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  searchInputControl = new FormControl();
  allAppointmentDetails: any[] = [];
  noRecord: boolean = false;

  displayedColumns: string[] = [
    "id",
    "appointmentDateTime",
    "clientName",
    "vehicleID",
    "appointmentType",
    "action",
  ];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;
  router: any;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _appointmentService: AppointmentService,
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      this.page = 0;
      this.searchAppointment();
    });
  }
  ngOnInit(): void {
    this.getallAppointmentDetails();
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getallAppointmentDetails();
    });
  }

  //Get all appointment details
  getallAppointmentDetails() {
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
    };

    this._appointmentService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  //search appointment Details
  searchAppointment() {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getallAppointmentDetails();
      return;
    }

    // const queryString = `((id:"${searchTerm}"*) OR (licenseNo:"${searchTerm}"*))`;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      "vehicleID.contains": searchTerm,
    };

    this._appointmentService
      // .search({
      //   query: queryString,
      //   size: 5,
      // sort: ["desc"],
      // })
      .query(params)
      .subscribe((res) => {
        this.totalItems = Number(res.headers.get("X-Total-Count"));
        this.dataSource.data = res.body || [];
        this.noRecord = this.dataSource.data.length === 0;
      });
  }

  /**
   * Open appointment edit dialog
   */
  openAppointmentEditDialog(appointment: any): void {
    const dialogRef = this._dialogService.open(CreateAppointmentComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        appointment,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open(
          "Appointment Updated Successfully!",
          "Close",
          {
            duration: 3000,
          }
        );
        this.getallAppointmentDetails();
      }
    });
  }

  /**
   * Delete
   */

  // deleteAppointment(appointment: IAppointment): void {
  //   this._appointmentService.delete(appointment.id).subscribe(() => {
  //     this._snackBarService.open('Appointment Deleted Successfully!', 'Close', {
  //       duration: 3000,
  //     });
  //     this.getallAppointmentDetails();
  //   });
  // }

  deleteAppointment(appointment: IAppointment): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Appointment",
      message:
        "Are you sure you want to delete this appointment? This action cannot be undone!",
      icon: {
        name: "heroicons_outline:exclamation-triangle",
        color: "warn",
      },
      actions: {
        confirm: {
          label: "Delete",
          color: "warn",
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === "confirmed") {
        this._appointmentService.delete(appointment.id).subscribe(() => {
          this.getallAppointmentDetails();
        });
      }
    });
  }

  /**
   * Open Appointment creation dialog
   */
  openAppointmentCreateDialog(): void {
    const dialogRef = this._dialogService.open(CreateAppointmentComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open(
          "Appointment Created Successfully!",
          "Close",
          {
            duration: 3000,
          }
        );
        this.getallAppointmentDetails();
      }
    });
  }
}
