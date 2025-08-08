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
import { FuseAlertComponent, FuseAlertService } from "@fuse/components/alert";
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
import {
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  Observable,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";
import { VehicleTreatmentRegistryService } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/service/vehicle-treatment-registry.service";
import { IVehicleTreatmentRegistry } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/vehicle-treatment-registry.model";
import { InventoryService } from "app/entities/inventorymicro/inventory/service/inventory.service";
import { TheInventoryBatchesService } from "app/entities/inventorymicro/the-inventory-batches/service/the-inventory-batches.service";
import { BinCardService } from "app/entities/inventorymicro/bin-card/service/bin-card.service";
import { AccountsService } from "app/entities/financemicro/accounts/service/accounts.service";
import { AccountTypeService } from "app/entities/financemicro/account-type/service/account-type.service";
import { TransactionService } from "app/entities/financemicro/transaction/service/transaction.service";

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
  templateUrl: "./quick-invoice-create.component.html",
  styleUrl: "./quick-invoice-create.component.scss",
})
export class QuickInvoiceCreateComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isUpdating: boolean = false;
  showDetails: boolean = false;
  invoiceDetails: IInvoice;
  bincardsave = inject(BinCardService);
  vehicleEstimateTreatments: any[] = [];
  private _fuseConfirmationService = inject(FuseConfirmationService);
  invoiceNumber: string;
  // _snackBarService = inject(MatSnackBar);
  private _fuseAlertService = inject(FuseAlertService);

  invoiceID: number;

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
  treatmentControl = new FormControl();
  treatmentControls: { [index: number]: FormControl } = {};
  filteredTreatments$: Observable<IVehicleTreatmentRegistry[]>[] = [];

  treatments: IVehicleTreatmentRegistry[] = [];

  resentEsitamte: IEstimate[] = [];
  showAlert: boolean = false;
  invSts: string = "";

  // Form controls
TransactionService=inject(TransactionService)
  searchInputControl = new FormControl();
categoryService1 = inject(AccountTypeService);
    AccountsService = inject(AccountsService);
  private _route = inject(ActivatedRoute);
  inventoryService = inject(InventoryService);
  gatePassService = inject(GatePassService);
  _fuseNavigationService = inject(FuseNavigationService);
  inventorybatch = inject(TheInventoryBatchesService);
  isCreating: boolean = false;

  constructor(
    private _estimateService: EstimateService,
    private _estimateTreatmentService: EstimateTreatmentService,
    private _vatService: VatService,
    private _invoiceService: InvoiceService,
    private _invoiceItemService: InvoiceItemService,
    private _jobCardRegistryService: JobCardService,
    private _snackBarService: MatSnackBar,
    private _invoicePaymentsService: InvoicePaymentsService,
    private _selectedCardService: SelectedCardService,
    private _vehicleTreatmentRegistryService: VehicleTreatmentRegistryService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      // this.page = 0;
    });

    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        "mainNavigation"
      );
    navigation.close();
  }
  ngOnInit(): void {
    // alert(this .dueAmount)
    
    this.invoiceDetails = createEmptyInvoice();

    this._selectedCardService.selectedCard$.subscribe((selected) => {
      if (!selected) {
        this.showAlert = true;
        this.show("alertBox4"); // Vehicle not selected
        // setTimeout(() => this.dismiss("alertBox4"), 4000);
        return;
      }

      this.vehicleLicenseNumber = selected?.vehicle?.licenseNo ?? "";

      this.invoiceDetails.vehicleLicenseNumber =
        selected?.vehicle?.licenseNo ?? "";
      this.invoiceDetails.vehicleBrand = selected?.vehicle?.brand ?? "";
      this.invoiceDetails.vehicleModel = selected?.vehicle?.model ?? "";
      this.invoiceDetails.vehicleOwnerName = selected?.client?.name ?? "";
      this.invoiceDetails.vehicleOwnerContactNumber1 =
        selected?.client?.contactNumber1 ?? "";
      this.invoiceDetails.vehicleOwnerContactNumber2 =
        selected?.client?.contactNumber2 ?? "";
    });
  }

  getWorkLabel(work: any | null): string {
    if (!work) return "";
    return (
      work.description ||
      work.repairName ||
      (work.name && work.code ? `${work.name} - ${work.code}` : null) ||
      work.paintName ||
      work.fittingChargeName ||
      work.otherName ||
      ""
    );
  }

  filterTreatments(query: string): IVehicleTreatmentRegistry[] {
    return this.treatments.filter((treatment) =>
      this.getWorkLabel(treatment).toLowerCase().includes(query)
    );
  }
  onQtyChange(index: number): void {
    const treatment = this.vehicleEstimateTreatments[index];
    const qty = Number(treatment.qty) || 0;
    const price = Number(treatment.lastSellingPrice) || 0;
    treatment.amount = qty * price;
    this.calculateTotals();
  }
 onWorkSelected(work: any, currentIndex: number): void {
  const selectedType = work.treatmentType || "PARTS";

  // Get the selected treatment
  const treatment = this.vehicleEstimateTreatments[currentIndex];
  const qty = Number(treatment.qty) || 1;

  // Prepare updated treatment item
  const updatedTreatment = {
    ...treatment,
    id: work.id || 0,
    descriptions: this.getWorkLabel(work),
    lastSellingPrice: work.price || work.lastSellingPrice || 0,
    amount: qty * (work.price || work.lastSellingPrice || 0),
    types: selectedType,
  };

  // Remove the old entry from arrays
  this.vehicleEstimateTreatments.splice(currentIndex, 1);
  const oldControl = this.treatmentControls[currentIndex];
  delete this.treatmentControls[currentIndex];
  this.filteredTreatments$.splice(currentIndex, 1);

  // Reindex controls after removal
  const updatedControls: { [index: number]: FormControl } = {};
  this.vehicleEstimateTreatments.forEach((_, i) => {
    updatedControls[i] = this.treatmentControls[i] || new FormControl("");
  });
  this.treatmentControls = updatedControls;

  // Find the insert index (after last item of the same type)
  const sameTypeIndices = this.vehicleEstimateTreatments
    .map((t, i) => ({ type: t.types, index: i }))
    .filter((t) => t.type === selectedType)
    .map((t) => t.index);

  let insertIndex = sameTypeIndices.length
    ? sameTypeIndices[sameTypeIndices.length - 1] + 1
    : 0;

  // Insert the updated treatment
  this.vehicleEstimateTreatments.splice(insertIndex, 0, updatedTreatment);

  // Insert the form control and observable at the same index
  const control = oldControl || new FormControl(work);
  this.treatmentControls = {
    ...this.treatmentControls,
    [insertIndex]: control,
  };

  this.filteredTreatments$.splice(
    insertIndex,
    0,
    control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const keyword =
          typeof value === "string" ? value : this.getWorkLabel(value);
        return this.inventoryService.query({
          "keyword.contains": keyword,
          "availableQuantity.greaterThan": 0,
        });
      }),
      map((res: any) => res.body || [])
    )
  );

  // Rebuild treatmentControls object with correct keys
  const finalControls: { [index: number]: FormControl } = {};
  this.vehicleEstimateTreatments.forEach((_, i) => {
    finalControls[i] = this.treatmentControls[i];
  });
  this.treatmentControls = finalControls;

  this.calculateTotals();
}


  calculateTotals(): void {
    const total = this.vehicleEstimateTreatments.reduce((sum, treatment) => {
      return sum + (treatment.amount || 0);
    }, 0);

    this.totalAmount = total;

    // Assuming you have this.paymentAmount already defined
    this.netTotalAmount = this.totalAmount - (this.paymentAmount || 0);
  }

  createEmptyLineitem(): void {
   // this.fetchinv()
    this.isCreating = true;
    const index = this.vehicleEstimateTreatments.length;

    this.vehicleEstimateTreatments.push({
      id: 0,
      invoiceDate: null,
      descriptions: "",
      qty: "",
      amount: 0,
      types: "",
      invoice: null,
      sourceType: "item",
    });

    const control = new FormControl("");
    this.treatmentControls[index] = control;

    // Setup live filtering from inventory
    this.filteredTreatments$[index] = control.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const keyword =
          typeof value === "string" ? value : this.getWorkLabel(value);
        return this.inventoryService.query({
          "keyword.contains": keyword,
          "availableQuantity.greaterThan": 0,
        });
      }),
      map((res: any) => res.body || [])
    );
  }

  batchlineedit(): Promise<void> {
    return new Promise((resolve, reject) => {
      const partsItems = this.vehicleEstimateTreatments.filter(
        (invoiceItem) => invoiceItem.types === "PARTS"
      );

      const codeAndQty = partsItems.map((item) => {
        const desc = item.descriptions || "";
        const code = desc.includes("-")
          ? desc.split("-")[1].trim()
          : desc.trim();
        return {
          code,
          qty: item.qty || 0,
          batchid: item.id || 0,
        };
      });

      const filteredCodeAndQty = codeAndQty.filter((item) => item.qty > 0);
      if (filteredCodeAndQty.length === 0) return resolve();

      // Step 1: Check if all available quantities are enough
      const checkAvailability = (): Promise<void> => {
        return new Promise((checkResolve, checkReject) => {
          const checkRequests = filteredCodeAndQty.map((part) =>
            this.inventoryService.query({ "id.equals": part.batchid }).pipe(
              map((res: any) => {
                const availableQty = res.body?.[0]?.availableQuantity || 0;
                return {
                  code: part.code,
                  requestedQty: part.qty,
                  availableQty,
                };
              })
            )
          );

          forkJoin(checkRequests).subscribe({
            next: (results) => {
              const insufficient = results.find(
                (r) => r.requestedQty > r.availableQty
              );
              if (insufficient) {
                alert(
                  `Not enough stock for item ${insufficient.code}. Requested: ${insufficient.requestedQty}, Available: ${insufficient.availableQty}`
                );
                return checkResolve(); // Still resolve to stop further processing
              }
              proceedToUpdate(); // Go to actual batch processing
            },
            error: checkReject,
          });
        });
      };

      // Step 2: Actual inventory batch update
      const updateRequests: any[] = [];

      const processItem = (part, batchOffset = 0): Promise<void> => {
        return new Promise((itemResolve, itemReject) => {
          this.inventorybatch
            .query({
              "itemId.equals": part.batchid,
              "quantity.greaterThan": 0,
              sort: ["id,asc"],
              page: batchOffset,
              size: 1,
            })
            .subscribe({
              next: (res: any) => {
                const batches = res.body || [];
                if (!batches.length) {
                  console.warn(`Not enough stock to fulfill ${part.code}`);
                  return itemResolve();
                }

                const batch = batches[0];
                const deductQty = Math.min(part.qty, batch.quantity);
                const newQuantity = batch.quantity - deductQty;

                updateRequests.push(
                  this.inventorybatch.partialUpdate({
                    id: batch.id,
                    quantity: newQuantity,
                  })
                );

                part.qty -= deductQty;

                if (part.qty > 0) {
                  processItem(part, batchOffset + 1)
                    .then(itemResolve)
                    .catch(itemReject);
                } else {
                  itemResolve();
                }
              },
              error: itemReject,
            });
        });
      };

      const proceedToUpdate = async () => {
        for (const part of filteredCodeAndQty) {
          await processItem(part);
        }

        if (updateRequests.length === 0) return resolve();

        forkJoin(updateRequests).subscribe({
          next: () => resolve(),
          error: reject,
        });
      };

      checkAvailability().catch(reject); // First run the availability check
    });
  }

  inventoryedit(): Promise<void> {
    return new Promise((resolve, reject) => {
      const partsItems = this.vehicleEstimateTreatments.filter(
        (invoiceItem) => invoiceItem.types === "PARTS"
      );

      const codeAndQty = partsItems.map((item) => {
        const desc = item.descriptions || "";
        const code = desc.includes("-")
          ? desc.split("-")[1].trim()
          : desc.trim();
        return {
          code,
          qty: item.qty || 0,
          batchid: item.id || 0,
        };
      });

      const filteredParts = codeAndQty.filter((part) => part.qty > 0);
      if (filteredParts.length === 0) return resolve();

      let completed = 0;
      filteredParts.forEach((part) => {
        this.inventoryService.query({ "id.equals": part.batchid }).subscribe({
          next: (response) => {
            const inventoryBatch = response.body?.[0];
            if (!inventoryBatch) return;

            const newQuantity = inventoryBatch.availableQuantity - part.qty;
            if (newQuantity < 0) return;

            const updatedBatch = {
              ...inventoryBatch,
              availableQuantity: newQuantity,
            };

            this.inventoryService.partialUpdate(updatedBatch).subscribe({
              next: () => {
                completed++;
                if (completed === filteredParts.length) resolve();
              },
              error: reject,
            });
          },
          error: reject,
        });
      });
    });
  }
  bincardadd(): Promise<void> {
    return new Promise((resolve, reject) => {
      const partsItems = this.vehicleEstimateTreatments.filter(
        (invoiceItem) => invoiceItem.types === "PARTS"
      );

      const codeAndQty = partsItems.map((item) => {
        const desc = item.descriptions || "";
        const code = desc.includes("-")
          ? desc.split("-")[1].trim()
          : desc.trim();
        return {
          code,
          qty: item.qty || 0,
          batchid: item.id || 0,
          name: item.descriptions || "",
        };
      });

      const filteredParts = codeAndQty.filter((part) => part.qty > 0);
      if (filteredParts.length === 0) return resolve();

      const reason = "Sold item";

      let completed = 0;
      filteredParts.forEach((part) => {
        this.inventoryService.query({ "id.equals": part.batchid }).subscribe({
          next: (response) => {
            const inventoryBatch = response.body?.[0];
            if (!inventoryBatch) return;

            const originalQty = inventoryBatch.availableQuantity || 0;
            const qtyOut = part.qty;

            const item = {
              id: null,
              qtyOut: qtyOut,
              recordDate: dayjs(),
              lmd: dayjs(),
              itemCode: part.code,
              reference: part.name,
              opening: originalQty,
              closing: originalQty - qtyOut,
              description: reason,
            };

            this.bincardsave.create(item).subscribe({
              next: () => {
                completed++;
                if (completed === filteredParts.length) resolve();
              },
              error: reject,
            });
          },
          error: reject,
        });
      });
    });
  }

  async processInventoryFlow() {
    try {
      await this.batchlineedit();
      await this.inventoryedit();
      await this.bincardadd();
      console.log("All inventory processes completed successfully.");
    } catch (error) {
      console.error("Error during inventory process flow:", error);
    }
  }

  createEmptyLine(): void {
    this.isCreating = true;
    const index = this.vehicleEstimateTreatments.length;
    this.vehicleEstimateTreatments.push({
      id: 0,
      invoiceDate: null,
      descriptions: "",
      qty: "",
      amount: 0,
      types: "",
      invoice: null,
      sourceType: "line",
    });
    this.treatmentControls[index] = new FormControl("");
    const params = {
      page: 0,
      size: 2000,
    };

    this._vehicleTreatmentRegistryService.query(params).subscribe((res) => {
      this.treatments = res.body || [];
      this.filteredTreatments$[index] = this.treatmentControls[
        index
      ].valueChanges.pipe(
        startWith(""),
        map((value) => {
          const input =
            typeof value === "string"
              ? value.toLowerCase()
              : this.getWorkLabel(value).toLowerCase();
          return this.filterTreatments(input);
        })
      );
    });
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

fetchinv() {
  console.log("Fetching treatments...", this.vehicleEstimateTreatments);

  if (this.vehicleEstimateTreatments && this.vehicleEstimateTreatments.length > 0) {
    const combined = this.vehicleEstimateTreatments.flatMap(treatment => {
      const amount = treatment.amount;
      const descriptionsRaw = treatment.descriptions;
      const descriptions = Array.isArray(descriptionsRaw) ? descriptionsRaw : [descriptionsRaw];

      return descriptions.map(desc => {
        if (typeof desc === 'string') {
          const parts = desc.split(' - ');
          const itemCode = parts[1] ? parts[1].trim() : null;

          if (itemCode) {
            return { itemCode, amount };
          }
        }
        return null;
      }).filter(Boolean);
    });

    console.log('Combined:', combined);

    // Loop through each itemCode + amount pair
    combined.forEach(item => {
      this.AccountsService.query({ 'code.equals': item.itemCode }).subscribe({
        next: (res) => {
          const account = res.body?.[0];
          if (account && account.id != null) {
            const updatedAmount = (account.amount ?? 0) - (account.creditAmount ?? 0);
            const updatedCredit = (account.creditAmount ?? 0) + item.amount;

            this.AccountsService.partialUpdate({
              id: account.id,
              amount: updatedAmount,
              creditAmount: updatedCredit
            }).subscribe({
              next: (updateRes) => {
                console.log(`Updated accountttttt ${account.id} with itemCode ${item.itemCode}`);
              },
              error: (err) => {
                console.error(`Error updating account ${account.id}:`, err);
              }
            });
          } else {
            console.warn(`No account found for itemCode ${item.itemCode}`);
          }
        },
        error: (err) => {
          console.error(`Error fetching account for itemCode ${item.itemCode}:`, err);
        }
      });
    });

  } else {
    console.log('No treatments or descriptions found');
  }
}


fetchcus(name: string, amount: number) {







  console.log("Fetching customer account for nameeeeee:", name);

this.AccountsService.query({
    'name.equals': 'Cash'
  }).subscribe({
    next: (res) => {
      const account = res.body?.[0];
      if (account && account.id != null) {
        console.log("Customer:", account);

        this.AccountsService.partialUpdate({
          id: account.id,
          amount: (account.amount ?? 0) + amount,
          debitAmount: (account.debitAmount ?? 0) + amount
        }).subscribe({
          next: (updateRes) => {
            console.log("Account cash updated successfully", updateRes);
          },
          error: (updateErr) => {
            console.error("Error updating account:", updateErr);
          }
        });

      } else {
        console.warn(`No account found for customer name ${name}`);
      }
    },
    error: (err) => {
      console.error("Error fetching customer account:", err);
    }
  });




  this.AccountsService.query({
    'name.equals': name
  }).subscribe({
    next: (res) => {
      const account = res.body?.[0];
      if (account && account.id != null) {
        console.log("Customer:", account);

        this.AccountsService.partialUpdate({
          id: account.id,
          amount: (account.amount ?? 0) + amount,
          debitAmount: (account.debitAmount ?? 0) + amount
        }).subscribe({
          next: (updateRes) => {
            console.log("Account updated successfully", updateRes);
          },
          error: (updateErr) => {
            console.error("Error updating account:", updateErr);
          }
        });

      } else {
        console.warn(`No account found for customer name ${name}`);
      }
    },
    error: (err) => {
      console.error("Error fetching customer account:", err);
    }
  });
}

transaction(name: string, grnvalue: number, invoicecode: string) {
  this.TransactionService.query({
    'refDoc.contains': 'recipt',
    sort: ['id,desc']
  }).subscribe({
    next: (response) => {
      const latestTransaction = response.body?.[0];
      let newRefDoc = 'recipt1';

      if (latestTransaction?.refDoc) {
        const match = latestTransaction.refDoc.match(/^recipt(\d+)$/);
        if (match) {
          const number = parseInt(match[1], 10);
          newRefDoc = `recipt${number + 1}`;
        }
      }

      const relid = Math.floor(1e5 + Math.random() * 9e5); // 15-digit number

      this.AccountsService.query({ 'id.equals': 1124 }).subscribe({
        next: (accountResponse) => {
          const account = accountResponse.body?.[0];

          if (!account?.id) {
            console.warn('Account not found with ID 1124');
            return;
          }

          const payload = {
            id: null,
            debit: grnvalue,
            source: 'receipt',
            refDoc: newRefDoc,
            date: dayjs(),
            subId: account.amount, // <-- double-check this logic
            accountCode: 'cash',
            relid: relid
          };

          this.TransactionService.create(payload).subscribe({
            next: () => console.log('Transaction (receipt) created successfully'),
            error: (err) => console.error('Transaction (receipt) creation failed:', err)
          });

          // Now handle the supplier transaction
          this.AccountsService.query({ 'name.equals': name }).subscribe({
            next: (supplierResponse) => {
              const supplierAccount = supplierResponse.body?.[0];

              if (!supplierAccount?.code) {
                console.warn('Supplier account not found or missing code');
                return;
              }

              const payload2 = {
                id: null,
                credit: grnvalue,
                source: 'Invoice',
                refDoc: invoicecode,
                date: dayjs(),
                subId: account.amount,
                accountCode: supplierAccount.code,
                relid: relid
              };

              console.log('Payload 1 (receipt):', payload);
              console.log('Payload 2 (supplier credit):', payload2);

              this.TransactionService.create(payload2).subscribe({
                next: () => console.log('Transaction (supplier credit) created successfully'),
                error: (err) => console.error('Transaction (supplier credit) creation failed:', err)
              });
            },
            error: (err) => console.error('Failed to fetch supplier account:', err)
          });
        },
        error: (err) => console.error('Failed to fetch cash account:', err)
      });
    },
    error: (err) => console.error('Failed to fetch transactions:', err)
  });
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
    console.log('zzzzzzzzzzz',invoice);
   invoice. invoiceNumber
invoice.vehicleOwnerName
console.log("Creating invoice with detailsssssssvvvvvvvvvvvvvvvs:", invoice);
 this.transaction(invoice.vehicleOwnerName, invoice.totalNetAmount, invoice.invoiceNumber);
this.fetchcus(invoice.vehicleOwnerName, invoice.totalNetAmount);
    this.processInventoryFlow();
   
this.fetchinv()
    this._invoiceService.create(invoice).subscribe((res) => {
      this.invoiceID = res.body.id;
      this.isCreating = false;
      this.invoiceNumber = res.body.invoiceNumber;
      this.createPayments(res.body.id);
      this.createInvoiceItem(res.body.id);
    });
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
console.log("Query Paramszzzzzzzzzzzzzzzzz: ", modelQueryParams);
    this._invoicePaymentsService.query(modelQueryParams).subscribe((res) => {
      this.invoicePayments = res.body || [];
      // this.getAllPayments(id);
console.log("Paymentsssss: ", this.invoicePayments);

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

  createInvoiceItem(invoiceID: number): void {
    const invoiceItemObservables = this.vehicleEstimateTreatments.map(
      (invoiceItems) => {
        const invoiceItem: NewInvoiceItem = {
          id: null,
          invoiceDate: dayjs(),
          descriptions: `${invoiceItems.descriptions || ""} - ${invoiceItems.qty}`,
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
        }
      });
      this._snackBarService.open("Invoice Created Successfully!", "Close", {
        duration: 3000,
      });
    });
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
      this.calculateTotals();
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
    }

    if (paymentType === "partial") {
      // alert("Full Amount");
      this.paymentAmount = this.totalAmount / 4;
    }

    if (paymentType === "advance") {
      this.paymentAmount = Math.round(this.totalAmount * 0.1 * 100) / 100;
    }
    if(paymentType === "pending") {
      this.paymentAmount = this.totalAmount; // Reset to allow custom input
    }
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
export function createEmptyInvoice(): NewInvoice {
  return {
    id: null,
    invoiceNumber: null,
    insuranceName: null,
    vehicleID: null,
    vehicleBrand: null,
    vehicleModel: null,
    vehicleLicenseNumber: null,
    vehicleOwnerID: null,
    vehicleOwnerName: null,
    vehicleOwnerContactNumber1: null,
    vehicleOwnerContactNumber2: null,
    jobID: null,
    totalNetAmount: null,
    discountRate: null,
    discountAmount: null,
    totalAmount: null,
    netTotalAmount: null,
    vatAmount: null,
    customerVATNumber: null,
    invoiceDate: null,
    invoiceStatus: null,
  };
}
