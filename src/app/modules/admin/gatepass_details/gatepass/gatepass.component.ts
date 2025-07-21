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
import { RouterLink, RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { FuseAlertComponent } from "@fuse/components/alert";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { GatepassAddWizardComponent } from "../gatepass-add-wizard/gatepass-add-wizard.component";
import { GatePassService } from "app/entities/operationsModuleCooperation/gate-pass/service/gate-pass.service";
import { IGatePass } from "app/entities/operationsModuleCooperation/gate-pass/gate-pass.model";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
  selector: "app-gatepass",
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
    RouterModule,
  ],
  templateUrl: "./gatepass.component.html",
  styleUrl: "./gatepass.component.scss",
})
export class GatepassComponent implements OnInit {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  searchInputControl = new FormControl();
  allGatePassDetails: any[] = [];
  noRecord: boolean = false;

  displayedColumns: string[] = [
    "id",
    "vehicleLicenseNumber",
    "vehicleOwnerName",
    "vehicleBrand",
    "vehicleModel",
    "fuelLevel",
    "meterReading",
    "entryDateTime",
    "action",
  ];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;
  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _gatePassService: GatePassService,
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      this.page = 0;
      this.searchGatePass();
    });
  }
  ngOnInit(): void {
    this.getallGatePassDetails();
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getallGatePassDetails();
    });
  }

  //Get all GatePass details
  getallGatePassDetails() {
    const queryParams = {
      page: this.page - 1,
      size:   2000,
      sort: "createdDate,desc",
    };

    this._gatePassService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  //search gatePass Details
  searchGatePass() {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getallGatePassDetails();
      return;
    }

    // const queryString = `((id:"${searchTerm}"*) OR (licenseNo:"${searchTerm}"*))`;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      "vehicleOwnerName.contains": searchTerm,
    };

    this._gatePassService
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
   * Open gatePass edit dialog
   */
  openGatePassEditDialog(gatePass: any): void {
    const dialogRef = this._dialogService.open(GatepassAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        gatePass,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("GatePass Updated Successfully!", "Close", {
          duration: 3000,
        });
        this.getallGatePassDetails();
      }
    });
  }

  /**
   * Delete
   */

  // deleteGatePass(gatePass: IGatePass): void {
  //   this._gatePassService.delete(gatePass.id).subscribe(() => {
  //     this._snackBarService.open("GatePass Deleted Successfully!", "Close", {
  //       duration: 3000,
  //     });
  //     this.getallGatePassDetails();
  //   });
  // }

  deleteGatePass(gatePass: IGatePass): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete GatePass",
      message:
        "Are you sure you want to delete this gatePass? This action cannot be undone!",
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
        this._gatePassService.delete(gatePass.id).subscribe(() => {
          this.getallGatePassDetails();
        });
      }
    });
  }

  /**
   * Open GatePass creation dialog
   */
  openGatePassCreateDialog(): void {
    const dialogRef = this._dialogService.open(GatepassAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("GatePass Created Successfully!", "Close", {
          duration: 3000,
        });
        this.getallGatePassDetails();
      }
    });
  }
}
