import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
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
import { VehicleModelService } from "app/entities/operationsModuleCooperation/vehicle-model/service/vehicle-model.service";
import { map, Observable, startWith } from "rxjs";

@Component({
  selector: "app-model-add-wizard",
  standalone: true,
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
  templateUrl: "./model-add-wizard.component.html",
  styleUrl: "./model-add-wizard.component.scss",
})
export class ModelAddWizardComponent implements OnInit {
  modelForm: UntypedFormGroup;
  brandControl = new FormControl();
  filteredBrands$: Observable<IBrand[]>;
  allBrands: IBrand[] = [];
  setSelectedBrandId: IBrand;

  constructor(
    public dialogRef: MatDialogRef<ModelAddWizardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      model: any;
      brands: IBrand[];
      selectedBrandId?: number;
    },
    private _fb: FormBuilder,
    private _modelService: VehicleModelService,
    private _brandService: BrandService
  ) {}
  ngOnInit(): void {
    this.modelForm = this._fb.group({
      modelName: [""],
      description: [""],
      opsUnitID: [""],
      createdBy: [""],
      brand: {},
      createdDate: [null],
      lastModifiedBy: [""],
      lastModifiedDate: [null],
    });

    this._brandService.query({ size: 1000 }).subscribe((response) => {
      this.allBrands = response.body || [];
      // this.brandControl.setValue(this.allBrands[0]);

      // this.brandControl.setValue(this.data?.vehicle?.brand);

      if (this.data?.model) {
        const brand = this.data.model.brand?.id;

        // alert("Brand ID: " + brand);

        if (brand && this.allBrands.length) {
          const matchedBrand = this.allBrands.find((m) => m.id === brand);
          // alert("Matched Brand: " + matchedBrand?.brandName);
          if (matchedBrand) {
            this.brandControl.setValue(matchedBrand.brandName);
          }
        }
      }
    });

    this.filteredBrands$ = this.brandControl.valueChanges.pipe(
      startWith(""),
      map((value) =>
        typeof value === "string"
          ? value.toLowerCase()
          : value?.brandName?.toLowerCase() || ""
      ),
      map((brand) => this.filterBrand(brand))
    );
    if (this.data?.model) {
      this.modelForm.patchValue(this.data.model);
      console.log("Model Data:", this.data.model);
    }
  }

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

  onSelectBrand(event: MatAutocompleteSelectedEvent): void {
    const selectedBrand: IBrand = event.option.value;
    console.log("Selected Brand:", selectedBrand);

    if (selectedBrand) {
      // this.setSelectedBrandId = selectedBrand;
      // alert("Selected Brand: " + selectedBrand.id);
      this.modelForm.patchValue({
        brand: {
          id: selectedBrand.id,
        },
      });
    }
  }

  submitModel() {
    const vehicleData = this.modelForm.value;
    if (this.data?.model?.id) {
      const updatedData = { ...this.data.model, ...vehicleData };

      this._modelService.update(updatedData).subscribe((response) => {
        console.log("Model Updated Successfully", response);
        this.dialogRef.close(true);
      });
    } else {
      // const modelData = {
      //   ...vehicleData,
      //   brand: {
      //     id: this.setSelectedBrandId,
      //   },
      // };
      console.log("modelData", vehicleData);
      this._modelService.create(vehicleData).subscribe((response) => {
        console.log("Model Created Successfully", response);
        this.dialogRef.close(response);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  displayBrand(brand: IBrand): string {
    return brand?.brandName || "";
  }
}
