import { I18nPluralPipe } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { timer, finalize, takeWhile, takeUntil, tap, Subject } from "rxjs";

@Component({
  selector: "active-confirmation-wizard",
  standalone: true,
  imports: [I18nPluralPipe],
  templateUrl: "./active-confirmation-wizard.component.html",
})
export class ActiveConfirmationWizardComponent {
  countdown: number = 5;
  countdownMapping: any = {
    "=1": "# second",
    other: "# seconds",
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    public dialogRef: MatDialogRef<ActiveConfirmationWizardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    timer(1000, 1000)
      .pipe(
        finalize(() => {
          this.confirm();
          // this._router.navigate(["sign-in"]);
        }),
        takeWhile(() => this.countdown > 0),
        takeUntil(this._unsubscribeAll),
        tap(() => this.countdown--)
      )
      .subscribe();
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
