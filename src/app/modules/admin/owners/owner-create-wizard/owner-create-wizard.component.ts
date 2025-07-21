import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { ClientRegistryService } from "app/entities/operationsModuleCooperation/client-registry/service/client-registry.service";
import { IVehicleModel } from "app/entities/operationsModuleCooperation/vehicle-model/vehicle-model.model";
import { VehicleRegistryService } from "app/entities/operationsModuleCooperation/vehicle-registry/service/vehicle-registry.service";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { map, Observable, startWith } from "rxjs";

@Component({
  selector: "app-owner-create-wizard",
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
  ],
  templateUrl: "./owner-create-wizard.component.html",
  styleUrl: "./owner-create-wizard.component.scss",
})
export class OwnerCreateWizardComponent implements OnInit {
  clientForm: FormGroup;
  allClientDetails: IClientRegistry[] = [];

  isFromDashboard: boolean = false;
  selectClient: boolean = false;

  clientControl = new FormControl();
  filterdClients$: Observable<IClientRegistry[]>;
  allClients: IClientRegistry[] = [];

  newClient: boolean = false;
  newClientID: string = "";

  constructor(
    public dialogRef: MatDialogRef<OwnerCreateWizardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      owner: IClientRegistry;
      vehicle: IVehicleRegistry;
      owners: IClientRegistry[];
      isFromDashboard: boolean;
    },
    private _fb: FormBuilder,
    private _clientRegistryService: ClientRegistryService,
    private _clientService: ClientRegistryService,
    private _vehicleService: VehicleRegistryService
  ) {}

  ngOnInit(): void {
    this.clientForm = this._fb.group({
      id: [null], // Optional, useful for edit scenarios
      name: ["", Validators.required],
      lastVehicleID: [""],
      lastReceiptID: [""],
      address: [""],
      city: [""],
      contactNumber1: ["", Validators.required],
      contactNumber2: [""],
      email: ["", [Validators.email]],
      opsUnitID: [""],
      createdBy: [""],
      createdDate: [null],
      lastModifiedBy: [""],
      lastModifiedDate: [null],
    });

    if (this.data?.owner) {
      // alert(this.data.owners);
      this.clientForm.patchValue(this.data.owner);
      this.allClientDetails = this.data.owners;
      console.log("Client details", this.data.owners);
      this.isFromDashboard = this.data.isFromDashboard;
    }

    // alert(this.data?.vehicle.id);

    this._clientService.query().subscribe((response) => {
      this.allClients = response.body || [];

      // Now that allBrands is loaded, initialize filteredBrands$
      this.filterdClients$ = this.clientControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          const input =
            typeof value === "string"
              ? value.toLowerCase()
              : value?.name?.toLowerCase() || "";
          if (!input) {
            return this.allClients.slice(0, 5);
          }
          return this.filterdClient(input);
        })
      );
    });
  }

  filterdClient(name: string): IClientRegistry[] {
    if (!name) return this.allClients;
    const filterValue = name.toLowerCase();
    return this.allClients.filter(
      (client) =>
        client.name?.toLowerCase().includes(filterValue) ||
        client.address?.toLowerCase().includes(filterValue) ||
        client.city?.toLowerCase().includes(filterValue) ||
        client.contactNumber1?.toString().toLowerCase().includes(filterValue) ||
        client.contactNumber2?.toString().toLowerCase().includes(filterValue) ||
        client.id?.toString().toLowerCase().includes(filterValue)
    );
  }

  onSelectClient(event: MatAutocompleteSelectedEvent): void {
    const selectedClient: IClientRegistry = event.option.value;
    console.log("Selected Client:", selectedClient);

    if (selectedClient) {
      this.newClientID = selectedClient.id.toString();
      this.clientForm.patchValue({
        id: selectedClient.id,
        name: selectedClient.name,
        lastVehicleID: selectedClient.lastVehicleID,
        lastReceiptID: selectedClient.lastReceiptID,
        address: selectedClient.address,
        city: selectedClient.city,
        contactNumber1: selectedClient.contactNumber1,
        contactNumber2: selectedClient.contactNumber2,
        email: selectedClient.email,
        opsUnitID: selectedClient.opsUnitID,
      });
    }

    console.log("Client Form Value:", this.clientForm.value);
  }

  displayClient(client: IClientRegistry): string {
    return client?.name || "";
  }

  submitClient(): void {
    const clientData = this.clientForm.value;

    if (this.data?.owner?.id) {
      const updatedData = { ...this.data.owner, ...clientData };
      this._clientRegistryService.update(updatedData).subscribe((response) => {
        console.log("Client Updated Successfully", response);
        this.dialogRef.close(response);
      });
    } else {
      this._clientRegistryService.create(clientData).subscribe((response) => {
        console.log("Client Created Successfully", response);
        this._vehicleService.find(this.data?.vehicle.id).subscribe((res) => {
          if (res.body) {
            const vehicle = res.body;

            const updatedVehicle: IVehicleRegistry = {
              ...vehicle,

              clientRegistry: {
                id: response.body.id,
              },
            };

            this._vehicleService
              .update(updatedVehicle)
              .subscribe((response) => {
                console.log("Vehicle Updated Successfully", response);
                this.dialogRef.close(response);
              });
          }
        });
        this.dialogRef.close(response);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  toggleCLient(): void {
    this.selectClient = !this.selectClient;
    // this.data = null;
    // this.clientForm.get("id")?.reset("");
    // this.clientForm.get("name")?.reset("");
    // this.clientForm.get("lastReceiptID")?.reset("");
    // this.clientForm.get("address")?.reset("");
    // this.clientForm.get("city")?.reset("");
    // this.clientForm.get("contactNumber1")?.reset("");
    // this.clientForm.get("contactNumber2")?.reset("");
    // this.clientForm.get("email")?.reset("");
  }

  toggleForm(): void {
    this.newClient = !this.newClient;
    if (this.data?.owner) {
      this.data.owner.id = null;
    }
    this.clientForm.reset();
  }

  changeOwner(): void {
    this._vehicleService.find(this.data?.vehicle.id).subscribe((res) => {
      if (res.body) {
        const vehicle = res.body;

        const updatedVehicle: IVehicleRegistry = {
          ...vehicle,
          clientRegistry: {
            id: this.clientForm.value.id,
          },
        };

        this._vehicleService.update(updatedVehicle).subscribe((response) => {
          console.log("Vehicle Updated Successfully", response);
          this.dialogRef.close(response);
        });
      }
    });
  }
}
