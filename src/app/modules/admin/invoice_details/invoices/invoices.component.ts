// import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Router, RouterLink } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { FuseAlertComponent } from "@fuse/components/alert";
// import { IInvoiceModel } from "app/entities/operationsModuleCooperation/invoice-model/invoice-model.model";
// import { invoiceRegistryService } from "app/entities/operationsModuleCooperation/invoice-registry/service/invoice-registry.service";
// import { IInvoiceRegistry } from "app/entities/operationsModuleCooperation/invoice-registry/invoice-registry.model";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import {
  MatDatepicker,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
// import { InvoiceAddWizardComponent } from "../invoice-add-wizard/invoice-add-wizard.component";
// import { InvoiceService } from "app/entities/operationsModuleCooperation/invoice/service/invoice.service";
import { IInvoice } from "app/entities/operationsModuleCooperation/invoice/invoice.model";
// import { MatAutocomplete } from "@angular/material/autocomplete";
import { InvoiceService } from "app/entities/operationsModuleCooperation/invoice/service/invoice.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { sortBy } from "lodash";
import invoiceItemResolve from "app/entities/operationsModuleCooperation/invoice-item/route/invoice-item-routing-resolve.service";
import { InvoiceItemService } from "app/entities/operationsModuleCooperation/invoice-item/service/invoice-item.service";
import { forkJoin } from "rxjs";
import { InvoicePaymentsService } from "app/entities/operationsModuleCooperation/invoice-payments/service/invoice-payments.service";
import * as _moment from "moment";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { default as _rollupMoment, Moment } from "moment";
const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YYYY",
  },
  display: {
    dateInput: "MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
@Component({
  selector: "app-invoices",
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    RouterLink,
  ],
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ],
  templateUrl: "./invoices.component.html",
  styleUrl: "./invoices.component.scss",
})
export class InvoicesComponent implements OnInit {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  searchInputControl = new FormControl();
  allInvoiceDetails: any[] = [];
  noRecord: boolean = false;
  showClear: boolean = false;
InvoicePaymentsService = inject(InvoicePaymentsService);
  private router = inject(Router);

  displayedColumns: string[] = [
    "id",
    "invoiceNumber",
    "vehicleLicenseNumber",
    "totalNetAmount",
    "invoiceDate",
    "totalNetAmount1",
    "action",
  ];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _invoiceService: InvoiceService,
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar,
    private _invoicePaymentsService: InvoicePaymentsService,
    private _invoiceItemService: InvoiceItemService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      this.page = 0;
      this.searchInvoice();
    });
  }
  ngOnInit(): void {
    this.getallInvoiceDetails();
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getallInvoiceDetails();
    });
  }

  //Get all invoice details
  getallInvoiceDetails() {
    this.showClear = false;
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: "createdDate,desc",
    };

    this._invoiceService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  //search invoice Details
  searchInvoice() {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getallInvoiceDetails();
      return;
    }

    // const queryString = `((id:"${searchTerm}"*) OR (licenseNo:"${searchTerm}"*))`;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      "invoiceNumber.contains": searchTerm,
    };

    this._invoiceService
      // .search({
      //   query: queryString,
      //   size: 5,
      //   sort: ["desc"],
      // })
      .query(params)
      .subscribe((res) => {
        this.totalItems = Number(res.headers.get("X-Total-Count"));
        this.dataSource.data = res.body || [];
        this.noRecord = this.dataSource.data.length === 0;
      });
  }
  date = new FormControl();

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = this.date.value ?? _moment.default();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.filterByStsAndDate();
    this.showClear = true;
    datepicker.close();
  }

  filterByStsAndDate(): void {
    if (!this.date.value) return;

    const selected = new Date(this.date.value);
    const year = selected.getFullYear();
    const month = selected.getMonth() + 1;

    const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
      "invoiceDate.greaterThanOrEqual": startOfMonth.toISOString(),
      "invoiceDate.lessThanOrEqual": endOfMonth.toISOString(),
      "invoiceStatus.equals": "UNPAID",
      sort: "createdDate,desc",
    };

    this._invoiceService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  resetFilter(): void {
    this.getallInvoiceDetails();
    this.date.reset();
  }

  // filterByStsAndDate(): void {
  //   const year = 2025;
  //   const month = 5;
  //   const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0)); // 1st of month
  //   const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)); // last day of month

  //   const queryParams = {
  //     page: this.page - 1,
  //     size: this.itemsPerPage,
  //     "invoiceDate.greaterThanOrEqual": startOfMonth.toISOString(),
  //     "invoiceDate.lessThanOrEqual": endOfMonth.toISOString(),
  //     sort: "createdDate,desc",
  //   };

  //   this._invoiceService.query(queryParams).subscribe((res) => {
  //     if (res.body) {
  //       this.dataSource.data = res.body;
  //       this.totalItems = Number(res.headers.get("X-Total-Count"));
  //     } else {
  //       this.dataSource.data = [];
  //     }
  //     this.noRecord = this.dataSource.data.length === 0;
  //   });
  // }
checkInvoice(invoice: IInvoice): void {
  console.log("checkInvoice", invoice);
  this.InvoicePaymentsService.find(1).subscribe((res) => {
    console.log("Invoice Payments", res.body);
  });
}


  /**
   * Open invoice edit dialog
   */
  openInvoiceEditDialog(invoiceID: any): void {
    this.router.navigate(["/invoices-view/", invoiceID]);

    // const dialogRef = this._dialogService.open(InvoiceAddWizardComponent, {
    //   width: "80vh",
    //   maxHeight: "90vh",
    //   data: {
    //     invoice,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this._snackBarService.open("Invoice updated successfully!", "Close", {
    //       duration: 3000,
    //     });
    //     this.getallInvoiceDetails();
    //   }
    // });
  }

  /**
   * Open invoice edit dialog
   */

  /**
   * Delete
   */

  // deleteInvoice(invoice: IInvoice): void {
  //   this._invoiceService.delete(invoice.id).subscribe(() => {
  //     this._snackBarService.open("Invoice deleted successfully!", "Close", {
  //       duration: 3000,
  //     });
  //     this.getallInvoiceDetails();
  //   });
  // }

  deleteInvoice(invoice: IInvoice): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Invoice",
      message:
        "Are you sure you want to delete this invoice? This action cannot be undone!",
      icon: {
        name: "heroicons_outline:exclamation-triangle",
        color: "warn",
      },
      actions: {
        confirm: {
          label: "Delete",
          color: "warn",
        },
      },
    });

    confirmation.afterClosed().subscribe((result) => {
      if (result === "confirmed") {
        // Step 1: Query Payments
        this._invoicePaymentsService
          .query({ "invoiceId.equals": invoice.id })
          .subscribe((paymentRes) => {
            const payments = paymentRes.body || [];
            const deletePayments = payments.map((p) =>
              this._invoicePaymentsService.delete(p.id)
            );

            const afterPaymentsDeleted = () => {
              // Step 2: Query Items
              this._invoiceItemService
                .query({ "invoiceId.equals": invoice.id })
                .subscribe((itemRes) => {
                  const items = itemRes.body || [];
                  const deleteItems = items.map((i) =>
                    this._invoiceItemService.delete(i.id)
                  );

                  const afterItemsDeleted = () => {
                    // Step 3: Delete the Invoice
                    this._invoiceService.delete(invoice.id).subscribe(() => {
                      this._snackBarService.open(
                        "Invoice deleted successfully!",
                        "Close",
                        { duration: 3000 }
                      );
                      this.getallInvoiceDetails();
                    });
                  };

                  // Delete items if any
                  if (deleteItems.length > 0) {
                    forkJoin(deleteItems).subscribe(afterItemsDeleted);
                  } else {
                    afterItemsDeleted();
                  }
                });
            };

            // Delete payments if any
            if (deletePayments.length > 0) {
              forkJoin(deletePayments).subscribe(afterPaymentsDeleted);
            } else {
              afterPaymentsDeleted();
            }
          });
      }
    });
  }

  /**
   * Open invoice creation dialog
   */
  openInvoiceCreateDialog(): void {
    // const dialogRef = this._dialogService.open(InvoiceAddWizardComponent, {
    //   width: "80vh",
    //   maxHeight: "90vh",
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this._snackBarService.open("Invoice created successfully!", "Close", {
    //       duration: 3000,
    //     });
    //     this.getallInvoiceDetails();
    //   }
    // });
  }
}
