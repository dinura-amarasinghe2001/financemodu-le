import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIcon } from "@angular/material/icon";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { ClientRegistryService } from "app/entities/operationsModuleCooperation/client-registry/service/client-registry.service";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import { VehicleRegistryService } from "app/entities/operationsModuleCooperation/vehicle-registry/service/vehicle-registry.service";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { environment } from "environments/environment";
import { SelectedCardService } from "./services/selected-card.service";
import { MatDialog } from "@angular/material/dialog";
import { VehicleAddWizardComponent } from "../vehicle_details/vehicle_details/vehicle-add-wizard/vehicle-add-wizard.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OwnerCreateWizardComponent } from "../owners/owner-create-wizard/owner-create-wizard.component";
import { VehicleAddComponent } from "../vehicle_details/vehicle_details/vehicle-add-dashboard/vehicle-add-wizard.component";
import { PreEstimateService } from "app/entities/operationsModuleCooperation/pre-estimate/service/pre-estimate.service";
import { JobCardService } from "app/entities/operationsModuleCooperation/job-card/service/job-card.service";
import { InvoiceItemService } from "app/entities/operationsModuleCooperation/invoice-item/service/invoice-item.service";
import { InvoiceService } from "app/entities/operationsModuleCooperation/invoice/service/invoice.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    VehicleAddComponent,
  ],

  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  searchInputControl = new FormControl();
  allVehicleDetails: IVehicleRegistry[] = [];
  allClientDetails: IClientRegistry[] = [];
  searchByVehicleNo: boolean = true;
  isVehicleSelected: boolean = false;
  fromDashboard: boolean = false;
  selectedCard: {
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null = null;

  estimateCount: number = 0;
  preEstimateCount: number = 0;
  invoiceCount: number = 0;
  jobCardCount: number = 0;

  showCreateVehicleForm: boolean = false;

  private _router = inject(Router);

  constructor(
    private _estimateService: EstimateService,
    private _preEstimateService: PreEstimateService,
    private _vehicleRegistryService: VehicleRegistryService,
    private _clientRegistryService: ClientRegistryService,
    private _selectedCardService: SelectedCardService,
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar,
    private _jobCardService: JobCardService,
    private _invoiceService: InvoiceService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      // this.page = 0;
      this.searchVehicle();
    });
  }

  ngOnInit(): void {
    this.fromDashboard = true;
    this._selectedCardService.selectedCard$.subscribe((selected) => {
      // alert(
      //   "Selected Vehicle: " +
      //     JSON.stringify(selected?.vehicle) +
      //     "\nSelected Client: " +
      //     JSON.stringify(selected?.client)
      // );
      this.selectedCard = selected;
      this.isVehicleSelected = !!selected;
      const licenseNo = selected.vehicle?.licenseNo;
      this.getDetails(licenseNo);

      if (selected) {
        this.isVehicleSelected = true;
      }
    });

    // Initialization logic here
  }

  searchVehicle(): void {
    const searchTerm = this.searchInputControl.value?.trim();
    if (!searchTerm) {
      this.allVehicleDetails = [];
      return;
    }

    if (this.searchByVehicleNo) {
      // Search by Vehicle License Number
      const params = {
        page: "0",
        size: "1",
        "licenseNo.contains": searchTerm,
      };

      this._vehicleRegistryService.query(params).subscribe({
        next: (res) => {
          this.allVehicleDetails = res.body ?? [];
          const clientParams = {
            page: "0",
            size: "1",
            "id.equals": this.allVehicleDetails[0]?.clientRegistry?.id,
            // sort: "createdDate,desc",
          };
          const licenseNo = this.allVehicleDetails[0]?.licenseNo;
          this.getDetails(licenseNo);
          if (this.allVehicleDetails.length > 0) {
            this.allClientDetails = [];

            this._clientRegistryService.query(clientParams).subscribe((res) => {
              this.allClientDetails = res.body ?? [];
              console.log("Client Details: ", this.allClientDetails);
            });
          }
        },
        error: () => {
          this.allVehicleDetails = [];
        },
      });
    } else {
      // Search by Client Name and then fetch their last registered vehicle
      const params = {
        page: "0",
        size: "5",
        "name.contains": searchTerm,
      };

      this._clientRegistryService.query(params).subscribe({
        next: (res) => {
          this.allClientDetails = res.body ?? [];
          const clients = res.body ?? [];
          if (clients.length > 0) {
            const vehicleID = clients[0].id;

            const params = {
              page: "0",
              size: "5",
              "clientRegistryId.equals": vehicleID,
            };

            this._vehicleRegistryService.query(params).subscribe({
              next: (vehicleRes) => {
                this.allVehicleDetails = vehicleRes.body;
              },
              error: () => {
                this.allVehicleDetails = [];
              },
            });
          } else {
            this.allVehicleDetails = [];
          }
        },
        error: () => {
          this.allVehicleDetails = [];
        },
      });
    }
  }

  set accessVehicle(vehicle: string) {
    localStorage.setItem("accessVehicle", vehicle);
  }

  set accessClient(client: string) {
    localStorage.setItem("accessClient", client);
  }

  selectCard(vehicle: IVehicleRegistry, client: IClientRegistry): void {
    this.searchInputControl.setValue("");
    this.searchByVehicleNo = true;
    this.allVehicleDetails = [];
    // this.allClientDetails = [];
    this._selectedCardService.setSelectedCard(vehicle, client);
    this.isVehicleSelected = true;
    this.selectedCard = {
      vehicle,
      client,
    };
    this._estimateService
      .query({
        size: 1000,
        "licenseNo.contains": `${this.selectedCard?.vehicle?.licenseNo}`,
        sort: "createdDate,desc",
      })
      .subscribe((estimate) => {
        this.estimateCount = estimate.body.length;
        // alert(this.estimateCount);
      });

    this._preEstimateService
      .query({
        size: 1000,
        "licenseNo.contains": `${this.selectedCard?.vehicle?.licenseNo}`,
        sort: "createdDate,desc",
      })
      .subscribe((preEstimate) => {
        this.preEstimateCount = preEstimate.body.length;
        // alert(this.estimateCount);
      });

    this._jobCardService
      .query({
        size: 1000,
        "vehicleLicenseNumber.contains": `${this.selectedCard?.vehicle?.licenseNo}`,
        sort: "createdDate,desc",
      })
      .subscribe((jobCard) => {
        this.jobCardCount = jobCard.body.length;
        // alert(this.estimateCount);
      });

    this._invoiceService
      .query({
        size: 1000,
        "vehicleLicenseNumber.contains": `${this.selectedCard?.vehicle?.licenseNo}`,
        // sort: "createdDate,desc",
      })
      .subscribe((invoice) => {
        this.invoiceCount = invoice.body.length;
        // alert(this.estimateCount);
      });

    this.accessVehicle = JSON.stringify(vehicle);
    this.accessClient = JSON.stringify(client);
  }

  getDetails(licenseNo: string): void {
    this._estimateService
      .query({
        size: 1000,
        "licenseNo.contains": `${licenseNo}`,
        sort: "createdDate,desc",
      })
      .subscribe((estimate) => {
        this.estimateCount = estimate.body.length;
        // alert(this.estimateCount);
      });

    this._preEstimateService
      .query({
        size: 1000,
        "licenseNo.contains": `${licenseNo}`,
        sort: "createdDate,desc",
      })
      .subscribe((preEstimate) => {
        this.preEstimateCount = preEstimate.body.length;
        // alert(this.estimateCount);
      });

    this._jobCardService
      .query({
        size: 1000,
        "vehicleLicenseNumber.contains": `${licenseNo}`,
        sort: "createdDate,desc",
      })
      .subscribe((jobCard) => {
        this.jobCardCount = jobCard.body.length;
        // alert(this.estimateCount);
      });

    this._invoiceService
      .query({
        size: 1000,
        "vehicleLicenseNumber.contains": `${licenseNo}`,
      })
      .subscribe((invoice) => {
        this.invoiceCount = invoice.body.length;
        // alert(this.estimateCount);
      });
  }

  /**
   * Open Client edit dialog
   */
  openClientEditDialog(
    owner: IClientRegistry,
    vehicle: IVehicleRegistry
  ): void {
    console.log("Owner: ", owner);
    console.log("Vehicle: ", vehicle);
    const owners = this.allClientDetails;
    console.log("Owners: ", owners);
    const isFromDashboard = this.fromDashboard;
    const dialogRef = this._dialogService.open(OwnerCreateWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        owner,
        vehicle,
        owners,
        isFromDashboard,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("Client updated successfully!", "Close", {
          duration: 3000,
        });

        if (result.body.clientRegistry.id) {
          this._clientRegistryService
            .find(result.body.clientRegistry.id)
            .subscribe((res) => {
              this._selectedCardService.setSelectedCard(
                this.selectedCard.vehicle,
                res.body
              );
            });
        }

        // ✅ Update selected card
        console.log(result);
        // this._selectedCardService.setSelectedCard(
        //   this.selectedCard.vehicle,
        //   result.body
        // );
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
        console.log("Vehicle created successfully", response);
        this._selectedCardService.setSelectedCard(response.body, null);
        this.allVehicleDetails = [];
        this.allClientDetails = [];
        this.searchInputControl.setValue("");
        this.searchByVehicleNo = true;
        this.allVehicleDetails = response.body;
        // this._snackBarService.open("Vehicle created successfully!", "Close", {
        //   duration: 3000,
        // });
      }
    });
  }

  goToEstimate() {
    this._router.navigate(["/create-estimates"]);
  }

  goToPreEstimate() {
    this._router.navigate(["/pre-estimates-create"]);
  }

  goToJobCard() {
    this._router.navigate(["/job-cards-create"]);
  }

  goToInvoice() {
    this._router.navigate(["/invoices-create"]);
  }

  handleVehicleCreated(licenseNo: string): void {
    this.searchInputControl.setValue(licenseNo); // or however you're handling the form
    this.searchVehicle();
  }
}
