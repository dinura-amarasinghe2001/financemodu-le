import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
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

@Component({
  selector: "app-brand-add-wizard",
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
  templateUrl: "./brand-add-wizard.component.html",
  styleUrl: "./brand-add-wizard.component.scss",
})
export class BrandAddWizardComponent implements OnInit {
  brandForm: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<BrandAddWizardComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      brand: IBrand;
    },
    private _fb: FormBuilder,
    private _brandRegistryService: BrandService
  ) {}
  ngOnInit(): void {
    this.brandForm = this._fb.group({
      brandName: [""],
      description: [""],
      opsUnitID: [""],
      emblem: [""],
      createdBy: [""],
      createdDate: [null],
      lastModifiedBy: [""],
      lastModifiedDate: [null],
    });

    if (this.data?.brand) {
      this.brandForm.patchValue(this.data.brand);
    }
  }

  submitbrand() {
    const brandData = this.brandForm.value;
    if (this.data?.brand?.id) {
      const updatedData = { ...this.data.brand, ...brandData };

      this._brandRegistryService.update(updatedData).subscribe((response) => {
        console.log("Brand Updated Successfully", response);
        this.dialogRef.close(true);
      });
    } else {
      this._brandRegistryService.create(brandData).subscribe((response) => {
        console.log("Brand Created Successfully", response);
        this.dialogRef.close(response);
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
