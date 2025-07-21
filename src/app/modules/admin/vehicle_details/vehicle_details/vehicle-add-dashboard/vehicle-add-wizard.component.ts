import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from "@angular/core";
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
  MatDialog,
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
import { BrandAddWizardComponent } from "../../brand_details/brand-add-wizard/brand-add-wizard.component";
import { ModelAddWizardComponent } from "../../model_detail/model-add-wizard/model-add-wizard.component";
import { OwnerCreateWizardComponent } from "app/modules/admin/owners/owner-create-wizard/owner-create-wizard.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-vehicle-add-dashboard",
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
  templateUrl: "./vehicle-add-dashboard.component.html",
  styleUrl: "./vehicle-add-dashboard.component.scss",
})
export class VehicleAddComponent implements OnInit {
  @Output() vehicleCreated = new EventEmitter<string>();
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
    private _fb: FormBuilder,
    private _vehicleRegistryService: VehicleRegistryService,
    private _snackBar: MatSnackBar,
    private _brandService: BrandService,
    private _modelService: VehicleModelService,
    private _cd: ChangeDetectorRef,
    private _clientService: ClientRegistryService,
    private _dialogService: MatDialog
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

    const params = {
      page: 0,
      size: 2000,
    };

    this._modelService.query(params).subscribe((response) => {
      this.allModels = response.body || [];
    });

    this._brandService.query(params).subscribe((response) => {
      this.allBrands = response.body || [];

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

    this._vehicleRegistryService.create(vehicleData).subscribe((response) => {
      console.log("Vehicle Created Successfully", response);
      if (response.body) {
        const createdLicense = response.body?.licenseNo;
        this.vehicleCreated.emit(createdLicense);
      }

      this._snackBar.open("Vehicle created successfully!", "Close", {
        duration: 3000,
        panelClass: ["bg-green-500", "text-white"], // Tailwind-style classes if allowed
        verticalPosition: "bottom",
      });
    });
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

  /**
   * Open Brand creation dialog
   */
  openBrandCreateDialog(): void {
    const dialogRef = this._dialogService.open(BrandAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.vehicleForm.patchValue({
          brand: result.body.brandName,
          brandID: result.body.id,
          model: null, // reset model
        });

        this.brandControl.setValue(result.body); // set selected brand
        this.selectedBrandId = result.body.id;

        // Optionally reload models after brand added
        const modelQueryParams = {
          page: 0,
          size: 2000,
          "brandId.equals": this.selectedBrandId,
        };
        this._modelService.query(modelQueryParams).subscribe((res) => {
          this.allModels = res.body || [];
        });

        // Optional: reload brands list
        this.getAllBrands();
      }
    });
  }

  getAllBrands(): void {
    this._brandService.query({ size: 1000 }).subscribe((res) => {
      this.allBrands = res.body || [];
      this.filteredBrands$ = this.brandControl.valueChanges.pipe(
        startWith(""),
        map((value) => {
          const input = typeof value === "string" ? value.toLowerCase() : "";
          return this.allBrands.filter((b) =>
            b.brandName.toLowerCase().includes(input)
          );
        })
      );
    });
  }

  /**
   * Open vehicle creation dialog
   */
  openModelCreateDialog(): void {
    const dialogRef = this._dialogService.open(ModelAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        brands: this.allBrands,
        selectedBrandId: this.selectedBrandId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.modelControl.setValue(result.body);
        this.vehicleForm.patchValue({
          model: result.body.modelName,
          modelID: result.body.id,
        });

        const modelQueryParams = {
          page: 0,
          size: 2000,
          "brandId.equals": this.selectedBrandId,
        };

        this._modelService.query(modelQueryParams).subscribe((response) => {
          this.allModels = response.body || [];
        });

        // this._snackBarService.open("Model Created Successfully!", "Close", {
        //   duration: 3000,
        // });
        // this.getAllModelDetails();
      }
    });
  }

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
        this.clientControl.setValue(response.body);
        this.vehicleForm.patchValue({
          clientRegistry: { id: response.body.id },
        });
        // this._snackBarService.open("Client Created Successfully!", "Close", {
        //   duration: 3000,
        // });
        // this.getAllClientDetails();
      }
    });
  }
}
