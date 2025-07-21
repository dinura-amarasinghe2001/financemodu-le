import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import {
  IVehicleTreatmentRegistry,
  NewVehicleTreatmentRegistry,
} from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/vehicle-treatment-registry.model";
import { VehicleTreatmentRegistryService } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/service/vehicle-treatment-registry.service";
import { IVehicleModel } from "app/entities/operationsModuleCooperation/vehicle-model/vehicle-model.model";
import { TreatmentType } from "app/entities/enumerations/treatment-type.model";
import { VehicleModelService } from "app/entities/operationsModuleCooperation/vehicle-model/service/vehicle-model.service";

@Component({
  selector: "app-treatment-registry-add-wizard",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./treatment-registry-add-wizard.component.html",
  styleUrls: ["./treatment-registry-add-wizard.component.scss"],
})
export class TreatmentRegistryAddWizardComponent implements OnInit {
  @ViewChild(MatAutocompleteTrigger) autoTrigger: MatAutocompleteTrigger;
  treatmentForm: FormGroup;
  treatmentTypes = Object.keys(TreatmentType); // TreatmentType is an enum
  vehicleModelControl = new FormControl();
  filteredVehicleModels$: Observable<IVehicleModel[]>;
  allVehicleModels: IVehicleModel[] = [];

  constructor(
    public dialogRef: MatDialogRef<TreatmentRegistryAddWizardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { treatment: IVehicleTreatmentRegistry },
    private fb: FormBuilder,
    private vehicleTreatmentRegistryService: VehicleTreatmentRegistryService,
    private _modelService: VehicleModelService
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.treatmentForm = this.fb.group({
      id: [null],
      fittingChargeName: [null, Validators.required],
      partName: [null],
      paintName: [null],
      repairName: [null],
      partNumber: [null],
      availableQuantity: [null, [Validators.required, Validators.min(0)]],
      price: [null, [Validators.required, Validators.min(0)]],
      treatmentType: [null, Validators.required],
      vehicleModel: [null, Validators.required],
    });

    this._modelService.query().subscribe((response) => {
      this.allVehicleModels = response.body || [];

      const modelId = this.data.treatment.vehicleModel?.id;

      if (modelId && this.allVehicleModels.length) {
        const matchedModel = this.allVehicleModels.find(
          (m) => m.id === +modelId
        );
        if (matchedModel) {
          this.vehicleModelControl.setValue(matchedModel);
        }
      }
    });

    this.filteredVehicleModels$ = this.vehicleModelControl.valueChanges.pipe(
      startWith(""),
      map((value) =>
        typeof value === "string"
          ? value.toLowerCase()
          : value?.modelName?.toLowerCase() || ""
      ),
      map((model) => this.filterVehicleModels(model))
    );

    // Patch form values if editing an existing treatment
    if (this.data?.treatment) {
      this.treatmentForm.patchValue(this.data.treatment);
    }
  }

  onModelFocus(): void {
    if (!this.vehicleModelControl.value) {
      this.vehicleModelControl.setValue("");
    }
    this.autoTrigger.openPanel();
  }

  /**
   * Submit the treatment form
   */
  submitTreatment(): void {
    const treatmentData = this.treatmentForm.value;

    if (this.data?.treatment?.id) {
      // Update existing treatment
      const updatedData = { ...this.data.treatment, ...treatmentData };
      this.vehicleTreatmentRegistryService.update(updatedData).subscribe(() => {
        console.log("Treatment Updated Successfully");
        this.dialogRef.close(true);
      });
    } else {
      // Create new treatment
      const newTreatment: NewVehicleTreatmentRegistry = {
        ...treatmentData,
        id: null,
      };
      this.vehicleTreatmentRegistryService
        .create(newTreatment)
        .subscribe(() => {
          console.log("Treatment Created Successfully");
          this.dialogRef.close(true);
        });
    }
  }

  /**
   * Cancel the dialog
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Display vehicle model in autocomplete
   */
  displayVehicleModel(model: IVehicleModel): string {
    return model ? model.modelName : "";
  }

  /**
   * Handle vehicle model selection
   */
  onSelectVehicleModel(event: MatAutocompleteSelectedEvent): void {
    const selectedModel = event.option.value;
    this.treatmentForm.get("vehicleModel")?.setValue(selectedModel);
  }

  /**
   * Filter vehicle models for autocomplete
   */
  private filterVehicleModels(input: string): IVehicleModel[] {
    if (!input || input.trim() === "") {
      return this.allVehicleModels.slice(0, 4);
    }

    return this.allVehicleModels
      .filter(
        (model) =>
          model.modelName?.toLowerCase().includes(input) ||
          model.description?.toLowerCase().includes(input)
      )
      .slice(0, 10);
  }

  get selectedType(): TreatmentType {
    return this.treatmentForm.get("treatmentType")?.value;
  }

  get isOther(): boolean {
    return this.selectedType === TreatmentType.OTHER;
  }

  get isPart(): boolean {
    return this.selectedType === TreatmentType.PART || this.isOther;
  }

  get isPaint(): boolean {
    return this.selectedType === TreatmentType.PAINT || this.isOther;
  }

  get isFittingCharge(): boolean {
    return this.selectedType === TreatmentType.FITTING_CHARGE || this.isOther;
  }

  get isRepair(): boolean {
    return this.selectedType === TreatmentType.REPAIR || this.isOther;
  }
  
}
