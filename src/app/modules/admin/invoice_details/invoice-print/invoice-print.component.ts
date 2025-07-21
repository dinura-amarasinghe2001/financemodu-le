import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute } from "@angular/router";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import { IInvoiceItem } from "app/entities/operationsModuleCooperation/invoice-item/invoice-item.model";
import { InvoiceItemService } from "app/entities/operationsModuleCooperation/invoice-item/service/invoice-item.service";
import { IInvoice } from "app/entities/operationsModuleCooperation/invoice/invoice.model";
import { InvoiceService } from "app/entities/operationsModuleCooperation/invoice/service/invoice.service";
import { VatService } from "app/entities/operationsModuleCooperation/vat/service/vat.service";
import { Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: "app-invoice-print",
  imports: [CommonModule, MatIconModule],
  templateUrl: "./invoice-print.component.html",
  styleUrl: "./invoice-print.component.scss",
})
export class InvoicePrintComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private _route = inject(ActivatedRoute);

  invoiceDetails: IInvoice;
  vehicleEstimateTreatments: IInvoiceItem[] = [];
  totalAmount: number = 0;
  netTotalAmount: number = 0;

  vehicleLicenseNumber: string;
  customerVATNumber: string;

  constructor(
    private _estimateService: EstimateService,
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
              this.invoiceDetails = res.body;

              this.customerVATNumber = res.body.customerVATNumber;
              this.vehicleLicenseNumber = res.body.vehicleLicenseNumber;

              this.totalAmount = res.body.totalAmount;
              this.netTotalAmount = res.body.netTotalAmount;

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

  print(): void {
    window.print();
  }

  goBack(): void {
    window.history.back();
  }
}
