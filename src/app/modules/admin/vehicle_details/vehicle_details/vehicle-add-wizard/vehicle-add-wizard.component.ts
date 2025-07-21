import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from "@angular/forms";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
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
import { IBrand } from "app/entities/operationsModuleCooperation/brand/brand.model";
import { BrandService } from "app/entities/operationsModuleCooperation/brand/service/brand.service";
import {
  IClientRegistry,
  NewClientRegistry,
} from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { ClientRegistryService } from "app/entities/operationsModuleCooperation/client-registry/service/client-registry.service";
import { VehicleModelService } from "app/entities/operationsModuleCooperation/vehicle-model/service/vehicle-model.service";
import { IVehicleModel } from "app/entities/operationsModuleCooperation/vehicle-model/vehicle-model.model";
import { VehicleRegistryService } from "app/entities/operationsModuleCooperation/vehicle-registry/service/vehicle-registry.service";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { IUser } from "app/entities/user/user.model";
import _ from "lodash";
import { map, startWith } from "rxjs";
import { Observable } from "rxjs/internal/Observable";

@Component({
  selector: "app-vehicle-add-wizard",
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
    MatInputModule,
    MatOptionModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
  ],
  standalone: true,
  templateUrl: "./vehicle-add-wizard.component.html",
  styleUrl: "./vehicle-add-wizard.component.scss",
})
export class VehicleAddWizardComponent implements OnInit {
  vehicleForm: UntypedFormGroup;

  brandControl = new FormControl();
  filteredBrands$: Observable<IBrand[]>;
  allBrands: IBrand[] = [];

  modelControl = new FormControl();
  filterdModels$: Observable<IVehicleModel[]>;
  allModels: IVehicleModel[] = [];

  clientControl = new FormControl();
  filterdClients$: Observable<IClientRegistry[]>;
  allClients: IClientRegistry[] = [];

  selectedBrandId: number;

  constructor(
    public dialogRef: MatDialogRef<VehicleAddWizardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      vehicle: IVehicleRegistry;
    },
    private _fb: FormBuilder,
    private _vehicleRegistryService: VehicleRegistryService,
    private _brandService: BrandService,
    private _modelService: VehicleModelService,
    private _cd: ChangeDetectorRef,
    private _clientService: ClientRegistryService
  ) {}
  ngOnInit(): void {
    this.vehicleForm = this._fb.group({
      licenseNo: [""],
      yom: [""],
      brand: [""],
      brandID: [""],
      modelID: [""],
      model: [""],
      modelNumber: [""],
      opsUnitID: [""],
      createdBy: [""],
      createdDate: [null],
      lastModifiedBy: [""],
      lastModifiedDate: [null],
      clientRegistry: [{} as IClientRegistry],
    });

    if (this.data?.vehicle) {
      this.vehicleForm.patchValue(this.data.vehicle);
      console.log("Vehicle Data", this.data.vehicle);

      this._modelService
        .query({ page: 0, size: 2000 })
        .subscribe((response) => {
          this.allModels = response.body || [];

          const model = this.data.vehicle.model;

          console.log("Vehicle Model", model);

          if (model && this.allModels.length) {
            const matchModel = this.allModels.find(
              (m) => m.modelName === model.toString()
            );
            if (matchModel) {
              this.modelControl.setValue(matchModel);
            }
          }
        });
    }

    this._brandService.query({ page: 0, size: 2000 }).subscribe((response) => {
      this.allBrands = response.body || [];
      if (this.data?.vehicle?.brand) {
        const brand = this.data.vehicle.brand;

        if (brand && this.allBrands.length) {
          const matchedBrand = this.allBrands.find(
            (m) => m.brandName === brand.toString()
          );
          if (matchedBrand) {
            this.brandControl.setValue(matchedBrand);
          }
        }
      }

      // Now that allBrands is loaded, initialize filteredBrands$
      this.filteredBrands$ = this.brandControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          const input =
            typeof value === "string"
              ? value.toLowerCase()
              : value?.brandName?.toLowerCase() || "";
          if (!input) {
            return this.allBrands.slice(0, 5);
          }
          return this.filterBrand(input);
        })
      );
    });

    this._clientService.query().subscribe((response) => {
      this.allClients = response.body || [];

      if (this.data?.vehicle?.clientRegistry) {
        const client = this.data.vehicle.clientRegistry?.id;

        if (client && this.allClients.length) {
          const matchedClient = this.allClients.find((m) => m.id === client);
          if (matchedClient) {
            this.clientControl.setValue(matchedClient);
          }
        }
      }

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

    this.filterdModels$ = this.modelControl.valueChanges.pipe(
      startWith(""),
      map((value) =>
        typeof value === "string"
          ? value.toLowerCase()
          : value?.modelName?.toLowerCase() || ""
      ),
      map((model) => this.filterModelName(model))
    );
  }

  submitVehicle() {
    const vehicleData = this.vehicleForm.value;
    if (this.data?.vehicle?.id) {
      const updatedData = { ...this.data.vehicle, ...vehicleData };

      this._vehicleRegistryService.update(updatedData).subscribe((response) => {
        console.log("Vehicle Updated Successfully", response);
        this.dialogRef.close(true);
      });
    } else {
      this._vehicleRegistryService.create(vehicleData).subscribe((response) => {
        console.log("Vehicle Created Successfully", response);
        this.dialogRef.close(response);
      });
    }
  }

  // filterModel(name: string): IVehicleModel[] {
  //   if (!name) return this.allModels;
  //   const filterValue = name.toLowerCase();
  //   return this.allModels.filter(
  //     (model) =>
  //       model.modelName?.toLowerCase().includes(filterValue) ||
  //       model.description?.toLowerCase().includes(filterValue) ||
  //       model.id?.toString().toLowerCase().includes(filterValue)
  //   );
  // }

  filterBrand(name: string): IBrand[] {
    if (!name) return this.allBrands;
    const filterValue = name.toLowerCase();
    return this.allBrands.filter(
      (brand) =>
        brand.brandName?.toLowerCase().includes(filterValue) ||
        brand.description?.toLowerCase().includes(filterValue) ||
        brand.emblem?.toLowerCase().includes(filterValue) ||
        brand.id?.toString().toLowerCase().includes(filterValue)
    );
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
      this.vehicleForm.patchValue({
        clientRegistry: { id: selectedClient.id },
      });
    }
  }

  onSelectBrand(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand: IBrand = event.option.value;
    this.selectedBrandId = selectedBrand.id;

    if (selectedBrand) {
      this.vehicleForm.patchValue({
        brand: selectedBrand.brandName,
        brandID: selectedBrand.id,
        model: null, // reset model
      });

      this.modelControl.setValue(""); // clear model field

      const modelQueryParams = {
        page: 0,
        size: 2000,
        "brandId.equals": this.selectedBrandId,
      };

      this._modelService.query(modelQueryParams).subscribe((response) => {
        this.allModels = response.body || [];

        // Setup filteredModels$ with default-5 and dynamic filtering
        this.filterdModels$ = this.modelControl.valueChanges.pipe(
          startWith(""),
          map((value) => {
            const input =
              typeof value === "string"
                ? value.toLowerCase()
                : value?.modelName?.toLowerCase() || "";
            if (!input) {
              return this.allModels.slice(0, 5); // Show default 5 models
            }
            return this.filterModelName(input);
          })
        );

        console.log(
          "Filtered Models for brand",
          this.selectedBrandId,
          this.allModels
        );
      });
    }
  }

  filterModelName(name: string): IVehicleModel[] {
    if (!name) return this.allModels;
    const filterValue = name.toLowerCase();
    return this.allModels.filter(
      (model) =>
        model.modelName?.toLowerCase().includes(filterValue) ||
        model.description?.toLowerCase().includes(filterValue) ||
        model.id?.toString().toLowerCase().includes(filterValue)
    );
  }

  onSelecModel(event: MatAutocompleteSelectedEvent): void {
    const selectedModel: IVehicleModel = event.option.value;
    console.log("Selected Brand:", selectedModel);

    if (selectedModel) {
      this.vehicleForm.patchValue({
        model: selectedModel.modelName,
        modelID: selectedModel.id,
      });
    }
  }

  displayBrand(brand: IBrand): string {
    return brand?.brandName || "";
  }

  displayModel(model: IVehicleModel): string {
    return model?.modelName || "";
  }

  displayClient(client: IClientRegistry): string {
    return client?.name || "";
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
