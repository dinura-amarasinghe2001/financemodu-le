import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDatepicker,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatFormField } from "@angular/material/form-field";
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTimepickerModule } from "@angular/material/timepicker";
import {
  IGatePass,
  NewGatePass,
} from "app/entities/operationsModuleCooperation/gate-pass/gate-pass.model";
import { GatePassService } from "app/entities/operationsModuleCooperation/gate-pass/service/gate-pass.service";
import { GatePassFormService } from "app/entities/operationsModuleCooperation/gate-pass/update/gate-pass-form.service";

import { FileDetails, GatePassImgService } from "./gate-pass-img.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import {
  FuseAlertComponent,
  FuseAlertService,
  FuseAlertType,
} from "@fuse/components/alert";
import { MatButtonModule } from "@angular/material/button";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { environment } from "environments/environment";

@Component({
  selector: "app-gatepass-create",
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    CommonModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FuseAlertComponent,
    MatButtonModule,
  ],
  templateUrl: "./gatepass-create.component.html",
  styleUrl: "./gatepass-create.component.scss",
})
export class GatepassCreateComponent implements OnInit {
  gatePassFormService = inject(GatePassFormService);
  gatePassService = inject(GatePassService);
  gatePassImgService = inject(GatePassImgService);
  activatedRoute = inject(ActivatedRoute);
  _selectedCardService = inject(SelectedCardService);
  private _fuseAlertService = inject(FuseAlertService);
  _snackBarService = inject(MatSnackBar);
  _router = inject(Router);

  isUpdating: boolean = false;

  selectedCard: {
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null = null;
  gatePassId: string = "";
  gatePassIdForPrint: number = 0;
  editForm = this.gatePassFormService.createGatePassFormGroup();
  gatePass = this.gatePassFormService.getGatePass(this.editForm);

  horizontalPosition: MatSnackBarHorizontalPosition = "end";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  alert: { type: FuseAlertType; message: string } = {
    type: "success",
    message: "",
  };
  showAlert: boolean = true;

  imageSlots = [
    { preview: "", file: null as File | null, name: "", label: "Front View" },
    {
      preview: "",
      file: null as File | null,
      name: "",
      label: "Side Right View",
    },
    {
      preview: "",
      file: null as File | null,
      name: "",
      label: "Side Left View",
    },
    { preview: "", file: null as File | null, name: "", label: "Rear View" },
  ];

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this._selectedCardService.selectedCard$.subscribe((selected) => {
      // alert(
      //   "Selected Vehicle: " +
      //     JSON.stringify(selected?.vehicle) +
      //     "\nSelected Client: " +
      //     JSON.stringify(selected?.client)
      // );
      this.selectedCard = selected;
      if (selected) {
        if (selected.vehicle.licenseNo) {
          this.showAlert = false;
        }
        this.editForm.patchValue({
          vehicleID: selected.vehicle?.id ? String(selected.vehicle?.id) : "",
          vehicleBrand: selected.vehicle?.brand ?? "",
          vehicleModel: selected.vehicle?.model ?? "",
          vehicleLicenseNumber: selected.vehicle?.licenseNo ?? "",
          vehicleOwnerID: selected.client?.id
            ? String(selected.client?.id)
            : "",
          vehicleOwnerName: selected.client?.name ?? "",
          vehicleOwnerContactNumber1: selected.client?.contactNumber1 ?? "",
          vehicleOwnerContactNumber2: selected.client?.contactNumber2 ?? "",
        });
      }
    });
    // this.gatePassFormService.resetForm(this.editForm, this.gatePass);
    // this.gatePassFormService.getGatePass(this.editForm);
    // this.editForm.get("vehicleID")?.addValidators([Validators.required]);

    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.gatePassIdForPrint = Number(id);
      this.isUpdating = true;
      this.gatePassId = id;
      this.gatePassService.find(Number(id)).subscribe((response) => {
        const gatePass = response.body;
        // this.editForm.patchValue({
        //   invoiceNumber: response.body?.invoiceNumber,
        // });
        console.log("Front View Image:", gatePass.frontView1);
        // this.gatePassImgService.getImageWithAuth(gatePass.frontView1).subscribe((url: string) => {
        //   this.imageSlots[0].preview = url;
        // });
        this.imageSlots[0].name = gatePass.frontView1;
        this.imageSlots[0].name = gatePass.frontView1;

        if (gatePass) {
          this.gatePassFormService.resetForm(this.editForm, gatePass);
          this.gatePass = gatePass;

          if (gatePass) {
            this.gatePassFormService.resetForm(this.editForm, gatePass);
            this.gatePass = gatePass;

            if (gatePass.frontView1) {
              this.gatePassImgService
                .getImageWithAuth(`${environment.imgUrl}${gatePass.frontView1}`)
                .subscribe((url: string) => {
                  this.imageSlots[0].preview = url;
                });

              // const url = this.gatePassImgService.getImageWithAuth(
              //   gatePass.frontView1
              // );

              // console.log(
              //   this.gatePassImgService.getImageWithAuth(gatePass.frontView1)
              // );

              // console.log("Front View Image URL:", this.imageSlots[0].preview);
              // this.gatePassImgService.getImageWithAuth(gatePass.frontView1).subscribe((url: string) => {
              //   this.imageSlots[0].preview = url;
              // });
              this.imageSlots[0].name = gatePass.frontView1;
            }
            if (gatePass.sideRView1) {
              this.gatePassImgService
                .getImageWithAuth(`${environment.imgUrl}${gatePass.sideRView1}`)
                .subscribe((url: string) => {
                  this.imageSlots[1].preview = url;
                });
              this.imageSlots[1].name = gatePass.sideRView1;
            }
            if (gatePass.sideLView1) {
              this.gatePassImgService
                .getImageWithAuth(`${environment.imgUrl}${gatePass.sideLView1}`)
                .subscribe((url: string) => {
                  this.imageSlots[2].preview = url;
                });
              this.imageSlots[2].name = gatePass.sideLView1;
            }
            if (gatePass.rearView1) {
              this.gatePassImgService
                .getImageWithAuth(`${environment.imgUrl}${gatePass.rearView1}`)
                .subscribe((url: string) => {
                  this.imageSlots[3].preview = url;
                });
              this.imageSlots[3].name = gatePass.rearView1;
            }
          }
        }
      });
    }
  }

  onImageSelected(event: Event, index: number): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSlots[index].preview = reader.result as string;
      };
      reader.readAsDataURL(file);
      this.imageSlots[index].file = file;
    }
  }

  createGatePass(): void {
    const vehicleID = this.editForm.get("vehicleID")?.value;

    if (!vehicleID || vehicleID.trim() === "") {
      this.show("alertBox4"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox4"), 4000);
      return;
    }

    this.dismiss("alertBox4");

    const gatePassData = this.gatePassFormService.getGatePass(this.editForm);

    if (
      this.imageSlots[0].file === null ||
      this.imageSlots[1].file === null ||
      this.imageSlots[2].file === null ||
      this.imageSlots[3].file === null
    ) {
      // console.error("Image upload failed or incomplete response.");
      this.show("alertBox5"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox5"), 4000);
      return;
    }

    this.dismiss("alertBox5");

    const filesToUpload: File[] = this.imageSlots
      .map((slot) => slot.file)
      .filter((file): file is File => !!file);

    this.gatePassImgService.uploadImages(filesToUpload).subscribe({
      next: (res) => {
        const uploaded = res?.filePaths;

        // Map filenames back to image slots
        uploaded.forEach((fileInfo: FileDetails, i: number) => {
          if (this.imageSlots[i]) {
            this.imageSlots[i].name = fileInfo.fileName;
          }
        });

        const newGatePass: NewGatePass = {
          ...gatePassData,
          id: null,
          frontView1: this.imageSlots[0]?.name || null,
          sideRView1: this.imageSlots[1]?.name || null,
          sideLView1: this.imageSlots[2]?.name || null,
          rearView1: this.imageSlots[3]?.name || null,
        };

        console.log("New Gate Pass Data:", newGatePass);

        this.gatePassService.create(newGatePass).subscribe({
          next: (response) => {
            console.log(" Gate Pass Created Successfully:", response);
            this.editForm.reset();
            this.imageSlots.forEach((slot) => {
              slot.preview = "";
              slot.file = null;
              slot.name = "";
            });
            // this._snackBarService.open(
            //   "GatePass Created Successfully!",
            //   "Close",
            //   {
            //     duration: 3000,
            //   }
            // );

            this._snackBar.open("GatePass Created Successfully!", "Close", {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.gatePassIdForPrint = response.body.id;
          },
          error: (error) => {
            console.error(" Error Creating Gate Pass:", error);
            this._snackBarService.open("Error on Creating!", "Close", {
              duration: 3000,
            });
          },
        });
      },
      error: (err) => {
        console.error("Image upload failed:", err);
      },
    });
  }

  updateGatePass(): void {
    const vehicleID = this.editForm.get("vehicleID")?.value;

    if (!vehicleID || vehicleID.trim() === "") {
      this.show("alertBox4"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox4"), 4000);
      return;
    }

    this.dismiss("alertBox4");

    const gatePassData = this.gatePassFormService.getGatePass(this.editForm);

    const filesToUpload: File[] = this.imageSlots
      .map((slot) => slot.file)
      .filter((file): file is File => !!file);

    if (filesToUpload.length === 0) {
      // No new files selected → just use existing image names and submit directly
      const updatedGatePass: IGatePass = {
        ...gatePassData,
        id: Number(this.gatePassId),
        frontView1: this.imageSlots[0]?.name || null,
        sideRView1: this.imageSlots[1]?.name || null,
        sideLView1: this.imageSlots[2]?.name || null,
        rearView1: this.imageSlots[3]?.name || null,
      };

      this.gatePassService.update(updatedGatePass).subscribe({
        next: (response) => {
          console.log("✅ Gate Pass Updated Successfully:", response);
          // this._snackBarService.open(
          //   "GatePass Updated Successfully!",
          //   "Close",
          //   {
          //     duration: 3000,
          //   }
          // );

          this._snackBar.open("GatePass Updated Successfully!", "Close", {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
        },
        error: (error) => {
          this._snackBarService.open("Error on Updating", "Close", {
            duration: 3000,
          });

          console.error("❌ Error Updating Gate Pass:", error);
        },
      });

      return; // stop here
    }

    // Otherwise → upload images first
    this.gatePassImgService.uploadImages(filesToUpload).subscribe({
      next: (res) => {
        const uploaded = res?.filePaths;
        if (!uploaded) {
          console.error("Image upload failed or returned empty.");
          return;
        }

        // Assign only uploaded filenames
        let uploadIndex = 0;
        this.imageSlots.forEach((slot, i) => {
          if (slot.file) {
            slot.name = uploaded[uploadIndex]?.fileName || "";
            uploadIndex++;
          }
        });

        const updatedGatePass: IGatePass = {
          ...gatePassData,
          id: Number(this.gatePassId),
          frontView1: this.imageSlots[0]?.name || null,
          sideRView1: this.imageSlots[1]?.name || null,
          sideLView1: this.imageSlots[2]?.name || null,
          rearView1: this.imageSlots[3]?.name || null,
        };

        this.gatePassService.update(updatedGatePass).subscribe({
          next: (response) => {
            console.log("✅ Gate Pass Updated Successfully:", response);
          },
          error: (error) => {
            console.error("❌ Error Updating Gate Pass:", error);
          },
        });
      },
      error: (err) => {
        console.error("❌ Image Upload Failed:", err);
      },
    });
  }

  gatePassPrint(): void {
    const gatePassId = this.gatePassIdForPrint;
    this._router.navigate(["/gatepass-print", gatePassId], {
      queryParams: { gatePassId: gatePassId },
    });
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }
}
