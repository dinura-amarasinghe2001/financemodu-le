import { CdkScrollable } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { Component, inject, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterLink } from "@angular/router";
import { FuseAlertComponent } from "@fuse/components/alert";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { ClientRegistryService } from "app/entities/operationsModuleCooperation/client-registry/service/client-registry.service";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { VehicleAddWizardComponent } from "../../vehicle_details/vehicle_details/vehicle-add-wizard/vehicle-add-wizard.component";
import { OwnerCreateWizardComponent } from "../owner-create-wizard/owner-create-wizard.component";
import { FuseConfirmationService } from "@fuse/services/confirmation";
@Component({
  selector: "app-owners",
  standalone: true,
  imports: [
    MatIconModule,
    MatExpansionModule,
    RouterLink,

    MatButtonModule,
    MatButtonToggleModule,
    MatSortModule,
    MatDialogModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatTableModule,
    FuseAlertComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
    MatSelectModule,
    MatTooltipModule,
    MatTabsModule,
    MatSidenavModule,
  ],
  templateUrl: "./owners.component.html",
  styleUrl: "./owners.component.scss",
})
export class OwnersComponent {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource: MatTableDataSource<IClientRegistry> =
    new MatTableDataSource<IClientRegistry>([]);
  displayedColumns: string[] = ["id", "name", "contactNumber1", "action"];
  searchInputControl: FormControl = new FormControl("");
  noRecord: boolean = false;

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar,
    private _clientRegistryService: ClientRegistryService
  ) {}

  ngOnInit(): void {
    this.getAllClientDetails();
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getAllClientDetails();
    });
  }

  getAllClientDetails() {
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
    };
    this._clientRegistryService.query(queryParams).subscribe((response) => {
      if (response.body) {
        this.dataSource.data = response.body || [];
        this.totalItems = Number(response.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
        this.totalItems = 0;
      }

      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  registerNewClient() {}

  /**
   * Open client creation dialog
   */
  openClientreateDialog(): void {
    const dialogRef = this._dialogService.open(OwnerCreateWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        this._snackBarService.open("Client Created Successfully!", "Close", {
          duration: 3000,
        });
        this.getAllClientDetails();
      }
    });
  }

  /**
   * Open Client edit dialog
   */
  openClientEditDialog(owner: IClientRegistry): void {
    const dialogRef = this._dialogService.open(OwnerCreateWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        owner,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("Client Updated Successfully!", "Close", {
          duration: 3000,
        });
        this.getAllClientDetails();
      }
    });
  }

  // Delete Client
  deleteOwner(owner: IClientRegistry): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Owner",
      message:
        "Are you sure you want to delete this owner? This action cannot be undone!",
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
        this._clientRegistryService.delete(owner.id).subscribe(() => {
          this.getAllClientDetails();
        });
      }
    });
  }
}
