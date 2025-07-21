import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from "@angular/material/core";
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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "@angular/material/timepicker";
import {
  IGatePass,
  NewGatePass,
} from "app/entities/operationsModuleCooperation/gate-pass/gate-pass.model";
import { GatePassService } from "app/entities/operationsModuleCooperation/gate-pass/service/gate-pass.service";

@Component({
  selector: "app-gatepass-add-wizard",
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

    MatCheckboxModule,

    MatTimepickerModule,
    MatDatepickerModule,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./gatepass-add-wizard.component.html",
  styleUrl: "./gatepass-add-wizard.component.scss",
})
export class GatepassAddWizardComponent implements OnInit {
  gatePassForm: UntypedFormGroup;
  value: Date;
  // startDate: any;
  // jobCompleteDate: any;
  // boothDate: any;

  constructor(
    public dialogRef: MatDialogRef<GatepassAddWizardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      gatePass: IGatePass;
    },
    private _fb: FormBuilder,
    private _gatePassRegistryService: GatePassService
  ) {}
  ngOnInit(): void {
    this.gatePassForm = this._fb.group({
      id: [null],
      vehicleID: [null],
      vehicleBrand: [null],
      vehicleModel: [null],
      vehicleLicenseNumber: [null],
      vehicleOwnerID: [null],
      vehicleOwnerName: [null],
      vehicleOwnerContactNumber1: [null],
      vehicleOwnerContactNumber2: [null],
      fuelLevel: [null],
      meterReading: [null],
      frontView1: [null],
      sideRView1: [null],
      sideLView1: [null],
      rearView1: [null],
      jobCardNumber: [null],
      receiptValue: [null],
      entryDateTime: [null],
      opsUnitID: [null],
      createdBy: [null],
      createdDate: [null], // You can initialize with a date if needed
      lastModifiedBy: [null],
      lastModifiedDate: [null], // You can initialize with a date if needed
    });

    if (this.data?.gatePass) {
      this.gatePassForm.patchValue(this.data.gatePass);
    }
  }

  submitGatePass() {
    const gatePassData = this.gatePassForm.value;

    const newGatePass: NewGatePass = {
      id: null,
      vehicleID: this.gatePassForm.get("vehicleID").value,
      vehicleBrand: this.gatePassForm.get("vehicleBrand").value,
      vehicleModel: this.gatePassForm.get("vehicleModel").value,
      vehicleLicenseNumber: this.gatePassForm.get("vehicleLicenseNumber").value,
      vehicleOwnerID: this.gatePassForm.get("vehicleOwnerID").value,
      vehicleOwnerName: this.gatePassForm.get("vehicleOwnerName").value,
      vehicleOwnerContactNumber1: this.gatePassForm.get(
        "vehicleOwnerContactNumber1"
      ).value,
      vehicleOwnerContactNumber2: this.gatePassForm.get(
        "vehicleOwnerContactNumber2"
      ).value,
      fuelLevel: this.gatePassForm.get("fuelLevel").value,
      meterReading: this.gatePassForm.get("meterReading").value,
      frontView1: this.gatePassForm.get("frontView1").value,
      sideRView1: this.gatePassForm.get("sideRView1").value,
      sideLView1: this.gatePassForm.get("sideLView1").value,
      rearView1: this.gatePassForm.get("rearView1").value,
      jobCardNumber: this.gatePassForm.get("jobCardNumber").value,
      receiptValue: this.gatePassForm.get("receiptValue").value,
      entryDateTime: this.gatePassForm.get("entryDateTime").value,
      // opsUnitID: this.gatePassForm.get('opsUnitID').value,
    };

    if (this.data?.gatePass?.id) {
      const updatedData = { ...this.data.gatePass, ...gatePassData };

      this._gatePassRegistryService
        .update(updatedData)
        .subscribe((response) => {
          console.log("GatePass Updated Successfully", response);
          this.dialogRef.close(true);
        });
    } else {
      this._gatePassRegistryService
        .create(gatePassData)
        .subscribe((response) => {
          console.log("GatePass Created Successfully", response);
          this.dialogRef.close(true);
        });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
