import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormControl } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterLink, Router } from "@angular/router";
import { FuseAlertComponent } from "@fuse/components/alert";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { AppointmentType } from "app/entities/enumerations/appointment-type.model";
import { IAppointment } from "app/entities/operationsModuleCooperation/appointment/appointment.model";
import { AppointmentService } from "app/entities/operationsModuleCooperation/appointment/service/appointment.service";
import { Subject, takeUntil, tap, merge } from "rxjs";

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
    RouterLink,
    FuseAlertComponent,
    MatTooltipModule,
  ],
  templateUrl: "./appointments.component.html",
  styleUrl: "./appointments.component.scss",
})
export class AppointmentsComponent implements OnInit, AfterViewInit, OnDestroy {
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  dataSource: MatTableDataSource<IAppointment> =
    new MatTableDataSource<IAppointment>([]);
  displayedColumns: string[] = [
    "id",
    "appointmentDateTime",
    "clientName",
    "vehicleLicenseNumber",
    "appointmentType",
    "action",
  ];
  searchInputControl: FormControl = new FormControl("");
  totalItems: number = 0;
  itemsPerPage: number = 10;
  appointmentTypes = Object.keys(AppointmentType);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.loadAppointments();

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadAppointments();
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadAppointments()),
          takeUntil(this._unsubscribeAll)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadAppointments(): void {
    const page = this.paginator?.pageIndex ?? 0;
    const size = this.paginator?.pageSize ?? this.itemsPerPage;
    const sort = this.sort?.active ?? "id";
    const order = this.sort?.direction ?? "asc";
    const search = this.searchInputControl.value ?? "";

    this.appointmentService
      .query({
        page: page,
        size: size,
        sort: [`${sort},${order}`],
        "clientName.contains": search,
      })
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap((res) => {
          this.totalItems = Number(res.headers.get("X-Total-Count"));
          this.dataSource.data = res.body ?? [];
        })
      )
      .subscribe();
  }

  openAppointmentCreateDialog(): void {
    // Implement the logic to open the create dialog
    console.log("Open create dialog");
  }

  openAppointmentEditDialog(appointment: IAppointment): void {
    // Implement the logic to open the edit dialog
    console.log("Open edit dialog", appointment);
  }

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
        this.appointmentService.delete(appointment.id).subscribe(() => {
          this.loadAppointments();
        });
      }
    });
  }
}
