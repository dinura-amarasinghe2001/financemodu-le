import { TextFieldModule } from "@angular/cdk/text-field";
import { CommonModule, NgClass } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseAlertComponent } from "@fuse/components/alert";
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from "@fuse/components/navigation";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { IEstimateTreatment } from "app/entities/operationsModuleCooperation/estimate-treatment/estimate-treatment.model";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { IEstimate } from "app/entities/operationsModuleCooperation/estimate/estimate.model";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import { IGatePass } from "app/entities/operationsModuleCooperation/gate-pass/gate-pass.model";
import { GatePassService } from "app/entities/operationsModuleCooperation/gate-pass/service/gate-pass.service";
import {
  IInvoiceItem,
  NewInvoiceItem,
} from "app/entities/operationsModuleCooperation/invoice-item/invoice-item.model";
import { InvoiceItemService } from "app/entities/operationsModuleCooperation/invoice-item/service/invoice-item.service";
import {
  IInvoicePayments,
  NewInvoicePayments,
} from "app/entities/operationsModuleCooperation/invoice-payments/invoice-payments.model";
import { InvoicePaymentsService } from "app/entities/operationsModuleCooperation/invoice-payments/service/invoice-payments.service";
import {
  IInvoice,
  NewInvoice,
} from "app/entities/operationsModuleCooperation/invoice/invoice.model";
import { InvoiceService } from "app/entities/operationsModuleCooperation/invoice/service/invoice.service";
import { JobCardService } from "app/entities/operationsModuleCooperation/job-card/service/job-card.service";
import { IJobEstimate } from "app/entities/operationsModuleCooperation/job-estimate/job-estimate.model";
import { VatService } from "app/entities/operationsModuleCooperation/vat/service/vat.service";
import { IVat } from "app/entities/operationsModuleCooperation/vat/vat.model";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import dayjs from "dayjs/esm";
import { size } from "lodash";
// import { console } from "inspector";
import { forkJoin, Subject, takeUntil, tap } from "rxjs";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";

@Component({
  selector: "app-invoice-create",
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
    MatOptionModule,
    FuseAlertComponent,
    MatButtonToggleModule,
    MatSelectModule,
    MatChipsModule,
    MatButtonToggleModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    NgClass,
    MatInputModule,
    TextFieldModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    MatDatepickerModule,
  ],
  templateUrl: "./invoice-create.component.html",
  styleUrl: "./invoice-create.component.scss",
})
export class InvoiceCreateComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isUpdating: boolean = false;
  showDetails: boolean = false;
  invoiceDetails: IInvoice;
  vehicleEstimateTreatments: IInvoiceItem[] = [];
  private _fuseConfirmationService = inject(FuseConfirmationService);
  invoiceNumber: string;
  // _snackBarService = inject(MatSnackBar);

  invoiceID: number;
amount: number = 0;
  selectedVehicleandClientDetails: {
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null = null;

  private router = inject(Router);

  totalAmount: number = 0;
  netTotalAmount: number = 0;

  vatDetails: IVat[] = [];
  selectedVats: IVat[] = [];

  invoicePayments: IInvoicePayments[] = [];
  paymentAmount: number = null;
  totalPaidAmount: number = 0;
  dueAmount: number = null;

  paymentType: string = "";

  vehicleLicenseNumber: string;
  customerVATNumber: string;
  insuranceName: string;

  jobID: string;
payemnttype: string = "";
  resentEsitamte: IEstimate[] = [];

  invSts: string = "";

  // Form controls

  searchInputControl = new FormControl();

  private _route = inject(ActivatedRoute);
  gatePassService = inject(GatePassService);
  _fuseNavigationService = inject(FuseNavigationService);

  constructor(
    private _estimateService: EstimateService,
    private _estimateTreatmentService: EstimateTreatmentService,
    private _vatService: VatService,
    private _invoiceService: InvoiceService,
    private _invoiceItemService: InvoiceItemService,
    private _jobCardRegistryService: JobCardService,
    private _snackBarService: MatSnackBar,
    private _invoicePaymentsService: InvoicePaymentsService,
    private _selectedCardService: SelectedCardService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      // this.page = 0;
      this.loadEstimate();
    });

    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        "mainNavigation"
      );
    navigation.close();
  }
  ngOnInit(): void {
    // alert(this .dueAmount)
    this._selectedCardService.selectedCard$.subscribe((selected) => {
      // alert(
      //   "Selected Vehicle: " +
      //     JSON.stringify(selected?.vehicle) +
      //     "\nSelected Client: " +
      //     JSON.stringify(selected?.client)
      // );
      this.selectedVehicleandClientDetails = selected;
      console.log(
        "Selected Vehicle and Client Details:",
        this.selectedVehicleandClientDetails
      );
    });
    const params = {
      size: 5,
      "licenseNo.contains": `${this.selectedVehicleandClientDetails?.vehicle?.licenseNo}`,
      sort: "createdDate,desc",
    };

    this._estimateService.query(params).subscribe((res) => {
      console.log("Resent Estimatesssssssssssss:", res.body);
      this.resentEsitamte = res.body || [];
      if (res.body.length === 0) {
        this._estimateService.query().subscribe((res) => {
          console.log("Resent Estimatesssssssssssss:", res.body);
          this.resentEsitamte = res.body || [];
        });
      }
    });
    const id = this._route.snapshot.paramMap.get("id");

    if (id) {
      this.invoiceID = Number(id);
      this.isUpdating = true;
      // this.loadEstimate();
      this._invoiceService
        .find(Number(id))
        .pipe(
          takeUntil(this._unsubscribeAll),
          tap((res) => {
            if (res.body) {
              this.invoiceNumber = res.body.invoiceNumber;
              this.invoiceDetails = res.body;

              this.customerVATNumber = res.body.customerVATNumber;
              this.vehicleLicenseNumber = res.body.vehicleLicenseNumber;

              this.totalAmount = res.body.totalAmount;
              this.netTotalAmount = res.body.netTotalAmount;
              this.getAllPayments(Number(id));
              this._invoiceItemService
                .query({
                  "invoiceId.equals": `${res.body.id}`,
                })
                .subscribe((res) => {
                  const invoiceItems: IInvoiceItem[] = res.body || [];

                  // Transform into IJobItemTimeEstimation
                  this.vehicleEstimateTreatments = invoiceItems.map((item) => {
                    const invoice: IInvoiceItem = {
                      id: item.id,
                      descriptions: item.descriptions,
                      amount: item.amount,
                      types: item.types,
                    };

                    return invoice;
                  });

                  console.log(
                    "🛠️ Job Item Time Estimations:",
                    this.vehicleEstimateTreatments
                  );
                });
            }
          })
        )
        .subscribe();
    }

    // this.searchInputControl.setValue("1351");
    this._vatService.query().subscribe((res) => {
      this.vatDetails = res.body || [];
      console.log("VAT Details: ", this.vatDetails);
    });
  }

  loadEstimate(): void {
    const search = this.searchInputControl.value?.trim();

    this._estimateService
      .find(search)
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap((res) => {
          if (res.body) {
          }
          const estimate = { ...res.body };
          this.insuranceName = res.body.insuranceName;
          this.invoiceDetails = res.body;
          this.vehicleLicenseNumber = res.body.licenseNo;
          // delete estimate.id;
          const modelQueryParams = {
            size: 1000,
            "estimateID.equals": search,
          };

          this._jobCardRegistryService
            .query(modelQueryParams)
            .subscribe((res) => {
              this.jobID = res.body[0].jobCardNumber || "";
              // alert(this.jobID);
            });

          if (this.invoiceDetails) {
            this._estimateTreatmentService
              .query({
                "estimateId.equals": `${res.body.id}`,
              })
              .subscribe((res) => {
                const treatments: IEstimateTreatment[] = res.body || [];

                this.vehicleEstimateTreatments = [];
                // Transform into IJobItemTimeEstimation
                this.vehicleEstimateTreatments = treatments.map((treatment) => {
                  const remark =
                    treatment.partName ||
                    treatment.repairName ||
                    treatment.paintName ||
                    treatment.fittingChargeName ||
                    treatment.other ||
                    "";

                  this.totalAmount = treatments.reduce((acc, treatment) => {
                    return (
                      acc + (parseFloat(treatment.approvedPrice as any) || 0)
                    );
                  }, 0);

                  const invoice: IInvoiceItem = {
                    id: treatment.id,
                    descriptions: remark,
                    amount: treatment.approvedPrice,
                    types: treatment.treatmentType,
                    // You can map startDateTime, endDateTime, jobItemType etc. if needed
                    // For example:
                    // startDateTime: treatment.approvedDate,
                    // jobItemType: this.mapTreatmentTypeToJobItemType(treatment.treatmentType),
                    // opsUnitID: treatment.opsUnitID,
                  };

                  return invoice;
                });

                console.log(
                  "🛠️ Job Item Time Estimations:",
                  this.vehicleEstimateTreatments
                );
              });
          }
        })
      )
      .subscribe();
  }

  calculateTotals(): void {
    console.log("Calculating totals...", this.selectedVats);
    // const totalBal = this.selectedVats.reduce((sum, vat) => {
    //   return sum + (vat.vatRate || 0); // Use `vatRate` for percentage
    // }, 0);

    // Step 3: Calculate net total with VATs
    this.netTotalAmount = this.totalAmount - this.paymentAmount;
  }

  async createInvoice(): Promise<void> {
    if (this.paymentType === "") {
      this._snackBarService.open("Please Add Payment!", "Close", {
        duration: 3000,
      });
      return;
    }
    // Step 1: Create the invoice object

    const invNumber = await this.getNexInvID();

    const invoice: NewInvoice = {
      id: null,
      customerVATNumber: this.customerVATNumber,
      vehicleID: this.invoiceDetails.vehicleID,
      vehicleBrand: this.invoiceDetails.vehicleBrand,
      vehicleModel: this.invoiceDetails.vehicleModel,
      vehicleLicenseNumber: this.vehicleLicenseNumber,
      vehicleOwnerID: this.invoiceDetails.vehicleOwnerID,
      vehicleOwnerName: this.invoiceDetails.vehicleOwnerName,
      vehicleOwnerContactNumber1:
        this.invoiceDetails.vehicleOwnerContactNumber1,
      vehicleOwnerContactNumber2:
        this.invoiceDetails.vehicleOwnerContactNumber2,
      jobID: this.jobID ?? null,
      totalNetAmount: this.totalAmount,
      discountRate: this.invoiceDetails.discountRate,
      discountAmount: this.invoiceDetails.discountAmount,
      totalAmount: this.totalAmount,
      netTotalAmount: this.netTotalAmount,
      vatAmount: this.selectedVats.reduce((sum, vat) => {
        return sum + (vat.vatRate || 0); // Use `vatRate` for percentage
      }, 0),
      invoiceDate: dayjs(),
      invoiceNumber: invNumber,
      insuranceName: this.insuranceName,
      invoiceStatus:
        this.paymentAmount === this.totalAmount ? "PAID" : "UNPAID",
    };

    this._invoiceService.create(invoice).subscribe((res) => {
      this.invoiceID = res.body.id;
      this.invoiceNumber = res.body.invoiceNumber;
      this.createPayments(res.body.id);
      this.createInvoiceItem(res.body.id);
    });

    // Step 2: Save the invoice using your service
    // Example:
    // this._invoiceService.create(invoice).subscribe((response) => {
    //   console.log("Invoice created successfully:", response);
    // });
  }

  createPayments(id: number): void {
    const checkID = id || this.invoiceID;
    // const paymentType = `${this.paymentType} - ${this.paymentAmount}`
    const payment: NewInvoicePayments = {
      id: null,
      paymentType: this.paymentType,
      amount: this.paymentAmount,
      invoice: checkID ? { id: checkID } : null,
    };
    this._invoicePaymentsService.create(payment).subscribe((payment) => {
      this.getAllPayments(checkID);
      this.paymentAmount = null;
    });
  }

  clickLog(): void {
    alert("Hellooo");
  }

  getAllPayments(id: number): void {
    const modelQueryParams = {
      size: 1000,
      "invoiceId.equals": id,
    };

    this._invoicePaymentsService.query(modelQueryParams).subscribe((res) => {
      this.invoicePayments = res.body || [];
      // this.getAllPayments(id);
console.log("Invoice Paymentszzzzzzzzzzzzzzzzzz", this.invoicePayments);
      // Calculate sum of 'amount'
      this.totalPaidAmount = this.invoicePayments.reduce(
        (sum, payment) => sum + (payment.amount || 0),
        0
      );

      this.dueAmount = Math.max(this.totalAmount - this.totalPaidAmount, 0);
    });
  }

  deletePayment(payments: IInvoicePayments): void {
    console.log("Deleting payment with ID:", payments.id);
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Vehicle",
      message:
        "Are you sure you want to delete this Payment? This action cannot be undone!",
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
        this._invoicePaymentsService.delete(payments.id).subscribe((res) => {
          this.getAllPayments(payments.invoice.id);
        });
      }
    });
  } 
confirmPayment(payments: IInvoicePayments, inv: any): void {
  console.log("Confirming payment with ID:", payments);
  console.log("Invoice ID:", inv );

  const confirmation = this._fuseConfirmationService.open({
    title: "Update Payment",
    message: "Are you sure you want to Update this Payment?",
    icon: {
      name: "heroicons_outline:exclamation-triangle",
      color: "primary",
    },
    actions: {
      confirm: {
        label: "Confirm",
        color: "warn",
      },
    },
  });

  confirmation.afterClosed().subscribe((result) => {
    if (result === "confirmed") {
      this._invoicePaymentsService.partialUpdate({
        id: payments.id,
        paymentType: this.payemnttype,
        amount: this.amount,
      }).subscribe({
        next: (response) => {
          console.log("Payment confirmed successfully:", response);


          if(this.payemnttype === "full") {
          this._invoiceService.partialUpdate({
            id: inv.id,
            invoiceStatus: "PAID",
          }).subscribe({
            next: (invoiceRes) => {
              console.log("Invoice status updated successfully:", invoiceRes);
              // Optionally show a success message here

             // setTimeout(() => {
              //  window.location.reload();
             //}, 1000); // 1500ms = 1.5 seconds
            },
            error: (err) => {
              console.error("Error updating invoice status:", err);
            }
          });

        }



 else if(this.payemnttype != "full") {
          this._invoiceService.partialUpdate({
            id: inv.id,
            invoiceStatus: "UNPAID",
          }).subscribe({
            next: (invoiceRes) => {
              console.log("Invoice status updated successfully:", invoiceRes);
              // Optionally show a success message here

             setTimeout(() => {
                 window.location.reload();
              }, 1000); // 1500ms = 1.5 seconds
            },
            error: (err) => {
              console.error("Error updating invoice status:", err);
            }
          });

        }





        },
        error: (err) => {
          console.error("Error confirming payment:", err);
        }
      });
    }
  });
}



  createInvoiceItem(invoiceID: number): void {
    const invoiceItemObservables = this.vehicleEstimateTreatments.map(
      (invoiceItems) => {
        const invoiceItem: NewInvoiceItem = {
          id: null,
          invoiceDate: dayjs(),
          descriptions: invoiceItems.descriptions,
          amount: invoiceItems.amount,
          types: invoiceItems.types,
          invoice: { id: invoiceID },
        };
        return this._invoiceItemService.create(invoiceItem);
      }
    );

    // First create all invoice items
    forkJoin(invoiceItemObservables).subscribe((responses) => {
      console.log("All Invoice Items created successfully:", responses);

      // Now update gate pass only once after all invoice items are created
      const modelQueryParams = {
        "jobCardNumber.equals": this.jobID,
      };
      this.gatePassService.query(modelQueryParams).subscribe((response) => {
        if (response.body && response.body.length > 0) {
          console.log("Gate Pass Found: ", response.body[0]);
          const updatedData: IGatePass = {
            id: response.body[0].id,
            invoiceNumber: invoiceID.toString(),
          };

          console.log("Updated Data: ", updatedData);

          this.gatePassService.partialUpdate(updatedData).subscribe(() => {
            console.log("Gate Pass Updated Successfully");
          });

          this._snackBarService.open("Invoice Created Successfully!", "Close", {
            duration: 3000,
          });

          // setTimeout(() => {
          //   this.router.navigate(["/invoices"]);
          // }, 1000);
        }
      });
      this._snackBarService.open("Invoice Created Successfully!", "Close", {
        duration: 3000,
      });
    });
  }

  // printInvoice(): void {
  //   const invoiceID = this.invoiceID;
  //   this.router.navigate(["/invoices-print/", invoiceID]);
  // }

  // printInvoice(): void {
  //   const invoiceID = this.invoiceID;
  //   this.router.navigate(["/invoices-print/", invoiceID]).then(() => {
  //     // Wait for navigation to complete, then trigger print
  //     // setTimeout(() => {
  //     //   window.print();
  //     // }, 500); // Add a small delay to ensure the page is fully loaded
  //   });
  // }

  selectEsitamte(id: number): void {
    this.searchInputControl.setValue(String(id));
    if (this.searchInputControl.value) {
      this.loadEstimate();
      this.getAllPayments(id);
    }
  }

  printTypes = ["Full Invoice", "Customer"];
  selectedPrintType: string = this.printTypes[0]; // default

  printInvoice(type: string): void {
    const invoiceID = this.invoiceID;
    this.router.navigate(["/invoices-print/", invoiceID]).then(() => {
      // Wait for navigation to complete, then trigger print
      // setTimeout(() => {
      //   window.print();
      // }, 500); // Add a small delay to ensure the page is fully loaded
    });
    switch (type) {
      case "Full Invoice":
        this.router.navigate(["/invoices-print-final/", invoiceID]).then(() => {
          // Wait for navigation to complete, then trigger print
          // setTimeout(() => {
          //   window.print();
          // }, 500); // Add a small delay to ensure the page is fully loaded
        });
        break;
      case "Summary":
        this.router.navigate(["/invoices-print/", invoiceID]).then(() => {
          // Wait for navigation to complete, then trigger print
          // setTimeout(() => {
          //   window.print();
          // }, 500); // Add a small delay to ensure the page is fully loaded
        });
        break;
      case "Customer":
        this.router
          .navigate(["/invoices-print-customer/", invoiceID])
          .then(() => {
            // Wait for navigation to complete, then trigger print
            // setTimeout(() => {
            //   window.print();
            // }, 500); // Add a small delay to ensure the page is fully loaded
          });
        break;
      default:
        console.warn("Unknown print type selected");
    }
  }

  onAmountInput(event: Event, treatment: any): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/,/g, "");
    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue)) {
      treatment.amount = numericValue;
    } else {
      treatment.amount = 0;
    }
  }

  onPaymentAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/,/g, "");
    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue)) {
      this.paymentAmount = numericValue;
    } else {
      this.paymentAmount = 0;
    }
  }

  addFullAmount(paymentType: string): void {
    if (paymentType === "full") {
      // alert("Full Amount");
      this.paymentAmount = this.totalAmount;
      this.payemnttype = "full";
      this.amount = this.paymentAmount;
    }

    if (paymentType === "partial") {
      // alert("Full Amount");
      this.paymentAmount = this.totalAmount / 4;
      this.payemnttype = "partial";
       this.amount = this.paymentAmount;
    }

    if (paymentType === "advance") {
      this.paymentAmount = Math.round(this.totalAmount * 0.1 * 100) / 100;
      this.payemnttype = "advance";
       this.amount = this.paymentAmount;
    }
    console.log("Payment Amount:", this.payemnttype);
    console.log("Payment Amount:",  this.amount  );
  }

  getNexInvID(): Promise<string> {
    const params = {
      page: 0,
      size: 1,
      sort: "id,desc", // safer fallback than string sort
    };

    return new Promise((resolve) => {
      this._invoiceService.query(params).subscribe((res) => {
        const latest = res.body?.[0];
        let nextID = "INV-000001";

        if (latest?.invoiceNumber) {
          const lastNumber = parseInt(
            latest.invoiceNumber.replace("INV-", ""),
            10
          );
          const newNumber = lastNumber + 1;
          nextID = "INV-" + newNumber.toString().padStart(6, "0");
        }

        resolve(nextID);
      });
    });
  }
}
