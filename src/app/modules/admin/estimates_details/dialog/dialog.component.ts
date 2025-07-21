import { Component, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";

@Component({
  selector: "app-dialog",
  imports: [MatDialogModule],
  templateUrl: "./dialog.component.html",
  styleUrl: "./dialog.component.scss",
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _router: Router,
    private _snackBarService: MatSnackBar
  ) {}

  confirm(): void {
    // this._router.navigate(["/job-cards-create"]);

    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
    this._router.navigate(["/job-cards-create"]);

    // this._snackBarService.open("Estimate created successfully!", "Close", {
    //   duration: 3000,
    // });
  }
}
