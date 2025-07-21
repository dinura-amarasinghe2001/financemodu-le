import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router } from "@angular/router";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import { IInvoiceItem } from "app/entities/operationsModuleCooperation/invoice-item/invoice-item.model";
import { InvoiceItemService } from "app/entities/operationsModuleCooperation/invoice-item/service/invoice-item.service";
import { IInvoicePayments } from "app/entities/operationsModuleCooperation/invoice-payments/invoice-payments.model";
import { InvoicePaymentsService } from "app/entities/operationsModuleCooperation/invoice-payments/service/invoice-payments.service";
import { IInvoice } from "app/entities/operationsModuleCooperation/invoice/invoice.model";
import { InvoiceService } from "app/entities/operationsModuleCooperation/invoice/service/invoice.service";
import { VatService } from "app/entities/operationsModuleCooperation/vat/service/vat.service";
import { Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: "app-final-bill",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./final-bill.component.html",
  styleUrl: "./final-bill.component.scss",
})
export class FinalBillComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _route = inject(ActivatedRoute);

  invoiceDetails: IInvoice;
  vehicleEstimateTreatments: IInvoiceItem[] = [];
  totalAmount: number = 0;
  netTotalAmount: number = 0;
  invoiceDate: string = "";
  insurance: string = "";
  invNo: string = "";
  vehicleLicenseNumber: string;
  vehicleModel: string = "";
  customerVATNumber: string;

  private router = inject(Router);

  constructor(
    private _estimateService: EstimateService,
    private _invoicePaymentsService: InvoicePaymentsService,
    private _estimateTreatmentService: EstimateTreatmentService,
    private _vatService: VatService,
    private _invoiceService: InvoiceService,
    private _invoiceItemService: InvoiceItemService
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");

    if (id) {
      this._invoiceService
        .find(Number(id))
        .pipe(
          takeUntil(this._unsubscribeAll),
          tap((res) => {
            if (res.body) {
              this.getAllPayments((Number(id)))
              this.invoiceDetails = res.body;
              this.invNo = res.body.invoiceNumber;
              this.customerVATNumber = res.body.customerVATNumber;
              this.vehicleLicenseNumber = res.body.vehicleLicenseNumber;
              this.vehicleModel = res.body.vehicleModel;
              this.insurance = res.body.insuranceName;
              this.totalAmount = res.body.totalAmount;
              this.netTotalAmount = res.body.netTotalAmount;
              this.invoiceDate = res.body.invoiceDate.format("YYYY-MM-DD");

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
  }

  invoicePayments: IInvoicePayments[] = [];
  totalPaidAmount: number = 0;
  dueAmount: number = null;

  getAllPayments(id: number): void {
    const modelQueryParams = {
      size: 1000,
      "invoiceId.equals": id,
    };

    this._invoicePaymentsService.query(modelQueryParams).subscribe((res) => {
      this.invoicePayments = res.body || [];
      // this.getAllPayments(id);
console.log("Invoice Paymentxxxxxxxxxs", this.invoicePayments);
      // Calculate sum of 'amount'
      this.totalPaidAmount = this.invoicePayments.reduce(
        (sum, payment) => sum + (payment.amount || 0),
        0
      );

      this.dueAmount = Math.max(this.totalAmount - this.totalPaidAmount, 0);
    });
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    const invoiceID = this.invoiceDetails.id;
    this.router.navigate(["/invoices-view/", invoiceID]);
    // window.history.back();
  }
}
