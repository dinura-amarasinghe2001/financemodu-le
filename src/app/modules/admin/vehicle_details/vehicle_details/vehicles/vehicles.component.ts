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
import { IVehicleModel } from "app/entities/operationsModuleCooperation/vehicle-model/vehicle-model.model";
import { VehicleRegistryService } from "app/entities/operationsModuleCooperation/vehicle-registry/service/vehicle-registry.service";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VehicleAddWizardComponent } from "../vehicle-add-wizard/vehicle-add-wizard.component";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
  selector: "app-vehicles",
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
  ],
  standalone: true,
  templateUrl: "./vehicles.component.html",
  styleUrl: "./vehicles.component.scss",
})
export class VehiclesComponent implements OnInit {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource = new MatTableDataSource<IVehicleRegistry>();
  searchInputControl = new FormControl();
  allVehicleDetails: IVehicleRegistry[] = [];
  noRecord: boolean = false;

  displayedColumns: string[] = ["id", "model", "brand", "licenseNo", "action"];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _vehicleRegistryService: VehicleRegistryService,
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      this.page = 0;
      this.searchVehicle();
    });
  }
  ngOnInit(): void {
    this.getAllVehicleDetails();
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getAllVehicleDetails();
    });
  }

  //Get all vehicle details
  getAllVehicleDetails() {
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
    };

    this._vehicleRegistryService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  //search Vehicle Details
  searchVehicle() {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getAllVehicleDetails();
      return;
    }

    // const queryString = `((id:"${searchTerm}"*) OR (licenseNo:"${searchTerm}"*))`;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      "licenseNo.contains": searchTerm,
    };

    this._vehicleRegistryService
      // .search({
      //   query: queryString,
      //   size: 5,
      //   sort: ["desc"],
      // })
      .query(params)
      .subscribe((res) => {
        this.totalItems = Number(res.headers.get("X-Total-Count"));
        this.dataSource.data = res.body || [];
        this.noRecord = this.dataSource.data.length === 0;
      });
  }

  /**
   * Open vehicle edit dialog
   */
  openVehicleEditDialog(vehicle: IVehicleRegistry): void {
    const dialogRef = this._dialogService.open(VehicleAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        vehicle,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("Vehicle Updated Successfully!", "Close", {
          duration: 3000,
        });
        this.getAllVehicleDetails();
      }
    });
  }

  /**
   * Delete
   */

  // deleteVehicle(vehicle: IVehicleRegistry) {
  //   this._vehicleRegistryService.delete(vehicle.id).subscribe(() => {
  //     this._snackBarService.open("Vehicle Deleted Successfully!", "Close", {
  //       duration: 3000,
  //     });
  //     this.getAllVehicleDetails();
  //   });
  // }

  deleteVehicle(vehicle: IVehicleRegistry): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Vehicle",
      message:
        "Are you sure you want to delete this vehicle? This action cannot be undone!",
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
        this._vehicleRegistryService.delete(vehicle.id).subscribe(() => {
          this.getAllVehicleDetails();
        });
      }
    });
  }

  /**
   * Open vehicle creation dialog
   */
  openVehicleCreateDialog(): void {
    const dialogRef = this._dialogService.open(VehicleAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this._snackBarService.open("Vehicle Created Successfully!", "Close", {
          duration: 3000,
        });
        this.getAllVehicleDetails();
      }
    });
  }
}
