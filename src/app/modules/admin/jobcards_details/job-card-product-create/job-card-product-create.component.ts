import { query } from "@angular/animations";
import { CommonModule } from "@angular/common";
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
import { MatTimepickerModule } from "@angular/material/timepicker";
import { FuseAlertComponent, FuseAlertService } from "@fuse/components/alert";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { IJobCard } from "app/entities/operationsModuleCooperation/job-card/job-card.model";
import { JobCardService } from "app/entities/operationsModuleCooperation/job-card/service/job-card.service";
import {
  IJobEstimateWorkLog,
  NewJobEstimateWorkLog,
} from "app/entities/operationsModuleCooperation/job-estimate-work-log/job-estimate-work-log.model";
import { JobEstimateWorkLogService } from "app/entities/operationsModuleCooperation/job-estimate-work-log/service/job-estimate-work-log.service";
import { IJobEstimate } from "app/entities/operationsModuleCooperation/job-estimate/job-estimate.model";
import { JobEstimateService } from "app/entities/operationsModuleCooperation/job-estimate/service/job-estimate.service";
import dayjs from "dayjs/esm";
import { forkJoin, map, Observable, of, tap } from "rxjs";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { HttpResponse } from "@angular/common/http";
import {
  IJobEstimateWorkProducts,
  NewJobEstimateWorkProducts,
} from "app/entities/operationsModuleCooperation/job-estimate-work-products/job-estimate-work-products.model";
import { JobEstimateWorkProductsService } from "app/entities/operationsModuleCooperation/job-estimate-work-products/service/job-estimate-work-products.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";
// import { log } from "console";

@Component({
  selector: "app-job-card-product-create",
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
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
  ],
  templateUrl: "./job-card-product-create.component.html",
  styleUrl: "./job-card-product-create.component.scss",
})
export class JobCardProductCreateComponent implements OnInit {
  estimateNumbers: number[] = [];
  selectedEstimateId: string | null = "ALL";

  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _jobEstimateTreatmentService: JobEstimateService,
    private _jobEstimateWorkLogService: JobEstimateWorkLogService,
    private _jobService: JobCardService,
    private _selectedCardService: SelectedCardService,
    private _jobEstimateProductService: JobEstimateWorkProductsService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      // this.page = 0;
      this.loadJobWorks();
    });
  }
  ngOnInit(): void {
    this._selectedCardService.selectedCard$.subscribe((selected) => {
      this.selectedVehicleAndClientDetails = selected;
      // alert(this.selectedVehicleAndClientDetails?.vehicle?.licenseNo);
    });
    const params = {
      size: 5,
      "vehicleLicenseNumber.contains": `${this.selectedVehicleAndClientDetails?.vehicle?.licenseNo}`,
      sort: "createdDate,desc",
    };
    this._jobService.query(params).subscribe((jobCards) => {
      const results = jobCards.body || [];

      if (results.length > 0) {
        this.allJobs = results;
      } else {
        // fallback: fetch all job cards
        this._jobService
          .query({
            size: 5,

            sort: "createdDate,desc",
          })
          .subscribe((res) => {
            this.allJobs = res.body || [];
          });
      }
    });

    // this.loadJobWorks();
  }
  selectedVehicleAndClientDetails: {
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null = null;
  searchInputControl = new FormControl();
  allJobs: IJobCard[] = [];
  jobEstimateTreatments: IJobEstimate[] = [];
  filteredJobEstimateTreatments: IJobEstimate[] = [];
  jobEstimateWorkers: IJobEstimateWorkLog[] = [];
  jobEstimateProducts: IJobEstimateWorkProducts[] = [];
  estimateWorkIds: number[] = [];
  selectedEstimateTreatment = 0;

  showUserWizard = false;
  showProductWizard = false;
  activeEstimate: IJobEstimate | null = null;
  activeIndex: number = -1;
  _newUser = "";
  _newTime: number | null = null;
  showUserInputForEstimateId: number | null = null;

  private _fuseAlertService = inject(FuseAlertService);

  openUserWizard(treatment: IJobEstimate, index: number): void {
    this.activeEstimate = treatment;
    this.activeIndex = index;
    this._newUser = "";
    this._newTime = null;
    this.showUserWizard = true;
  }

  _newProduct: string = "";
  _newProductQuantity: number = 0;
  _newUnit: string = "";
  _newNote: string = "";

  //////////////////////////////////
  tempProducts: IJobEstimateWorkProducts[] = [];

  isEditMode = false;
  editWorkLogIndex = -1;

  loadJobWorks(): void {
    const rawValue = this.searchInputControl.value;

    const search =
      typeof rawValue === "string" ? rawValue.trim() : String(rawValue);

    if (!search || search.trim() === "") {
      console.warn("⛔ Ignored empty or space-only search input.");
      return;
    }

    this._jobEstimateTreatmentService
      .query({ "jobCardId.equals": search })
      .subscribe((response) => {
        console.log(response);
        this.jobEstimateTreatments = response.body || [];
        this.filteredJobEstimateTreatments = response.body || [];

        this.estimateNumbers = [];
        this.jobEstimateTreatments.forEach((treatment) => {
          const estimateIdNum = parseInt(treatment.estimateID || "0", 10);
          if (estimateIdNum && !this.estimateNumbers.includes(estimateIdNum)) {
            this.estimateNumbers.push(estimateIdNum);
          }
        });

        const logFetches = this.jobEstimateTreatments.map((treatment) => {
          if (treatment.id) {
            return this._jobEstimateWorkLogService
              .query({ "jobEstimateId.equals": treatment.id })
              .pipe(
                tap((res) => {
                  treatment.jobEstimateWorkLogs = (res.body ||
                    []) as NewJobEstimateWorkLog[];
                })
              );
          } else {
            return of(null);
          }
        });

        forkJoin(logFetches).subscribe(() => {
          console.log("✅ All job estimate work logs loaded and attached:");
          console.log(this.jobEstimateTreatments);

          // 🔁 Now fetch all products for these job estimates
          const allWorkLogIds = this.jobEstimateTreatments
            .flatMap((t) => t.jobEstimateWorkLogs ?? [])
            .filter((log) => log.id)
            .map((log) => log.id);

          if (allWorkLogIds.length === 0) return;

          const productFetches = allWorkLogIds.map((logId) =>
            this._jobEstimateProductService
              .query({ "jobEstimateWorkLogId.equals": logId })
              .pipe(map((res) => ({ logId, products: res.body || [] })))
          );

          forkJoin(productFetches).subscribe((results) => {
            results.forEach(({ logId, products }) => {
              // Find the correct log and attach products
              this.jobEstimateTreatments.forEach((treatment) => {
                treatment.jobEstimateWorkLogs?.forEach((log) => {
                  if (log.id === logId) {
                    log.jobEstimateProducts = products;
                  }
                });
              });
            });

            console.log(
              "📦 All products assigned to their respective work logs."
            );
          });
        });
      });
  }

  // addAssignedUser(treatment: IJobEstimate, i: number): void {
  //   if (!this._newUser || !this._newTime || !treatment.id) return;

  //   const newWorkLog: IJobEstimateWorkLog = {
  //     id: null,
  //     workedEmployeeName: this._newUser,
  //     workedHours: this._newTime,
  //     workDate: dayjs(),
  //     jobEstimate: {
  //       id: null,
  //     } as IJobEstimate,
  //     jobEstimateProducts: [...this.tempProducts],
  //   };

  //   if (this.jobEstimateTreatments[i].jobEstimateWorkLogs === undefined) {
  //     this.jobEstimateTreatments[i].jobEstimateWorkLogs = [];
  //   }

  //   this.jobEstimateTreatments[i].jobEstimateWorkLogs.push(
  //     newWorkLog as NewJobEstimateWorkLog
  //   );
  //   this.jobEstimateWorkers.push(newWorkLog);
  //   console.log(this.jobEstimateWorkers);

  //   // Reset inputs and hide the field
  //   this._newUser = "";
  //   this._newTime = 0;
  //   this.tempProducts = [];
  //   this.showUserWizard = false;

  //   this.showUserInputForEstimateId = null;
  // }

  addAssignedUser(treatment: IJobEstimate, i: number): void {
    if (!this._newUser || !this._newTime || !treatment.id) return;

    const newWorkLog: IJobEstimateWorkLog = {
      id: this.isEditMode
        ? treatment.jobEstimateWorkLogs![this.editWorkLogIndex].id
        : null,
      workedEmployeeName: this._newUser,
      workedHours: this._newTime,
      workDate: dayjs(),
      jobEstimate: {
        id: treatment.id,
      } as IJobEstimate,
      jobEstimateProducts: this.tempProducts.map((product) => ({
        ...product,
        jobEstimateWorkLog: null,
      })),
    };

    if (!treatment.jobEstimateWorkLogs) {
      treatment.jobEstimateWorkLogs = [];
    }

    if (this.isEditMode && this.editWorkLogIndex !== -1) {
      treatment.jobEstimateWorkLogs[this.editWorkLogIndex] =
        newWorkLog as NewJobEstimateWorkLog;
    } else {
      treatment.jobEstimateWorkLogs.push(newWorkLog as NewJobEstimateWorkLog);
    }

    this._newUser = "";
    this._newTime = 0;
    this.tempProducts = [];
    this.showUserWizard = false;
    this.isEditMode = false;
    this.editWorkLogIndex = -1;
  }

  cancelEdit(): void {
    this._newUser = "";
    this._newTime = 0;
    this.tempProducts = [];
    this.showUserWizard = false;
    this.isEditMode = false;
    this.editWorkLogIndex = -1;
  }

  addProductToTempProducts(): void {
    if (!this._newProduct || !this._newProductQuantity || !this._newUnit)
      return;

    const product: NewJobEstimateWorkProducts = {
      id: null,
      workProductName: this._newProduct,
      quantity: this._newProductQuantity,
      unit: this._newUnit,
      notes: this._newNote,
      jobEstimateWorkLog: null, // assigned later
    };

    this.tempProducts.push(product);

    // Reset product fields
    this._newProduct = "";
    this._newProductQuantity = 0;
    this._newUnit = "";
    this._newNote = "";
    this.showProductWizard = !this.showProductWizard;
  }

  editWorkLog(
    user: IJobEstimateWorkLog,
    workLogIndex: number,
    treatment: IJobEstimate,
    treatmentIndex: number
  ): void {
    this.isEditMode = true;
    this.editWorkLogIndex = workLogIndex;
    this.activeEstimate = treatment;
    this.activeIndex = treatmentIndex;

    this._newUser = user.workedEmployeeName ?? "";
    this._newTime = user.workedHours ?? 0;
    this.tempProducts = [...(user.jobEstimateProducts || [])];

    this.showUserWizard = true;
  }

  removeTempProduct(index: number): void {
    this.tempProducts.splice(index, 1);
  }

  filterItems(): void {
    console.log("Hellooooooo");
  }

  updateRecords(index: number) {
    const record: IJobEstimate = this.jobEstimateTreatments[index];

    if (!record.id) {
      console.error("Cannot update a record without an ID:", record);
      return;
    }

    this._jobEstimateTreatmentService.update(record).subscribe((res) => {
      const estId = res.body?.id;
      if (!estId) {
        console.error("Failed to update job estimate record");
        return;
      }

      console.log("✅ Updated Job Estimate with ID:", estId);

      const logs = record.jobEstimateWorkLogs;

      if (!logs || logs.length === 0) {
        if (index + 1 < this.jobEstimateTreatments.length) {
          this.updateRecords(index + 1);
        }
        return;
      }

      // Save all work logs (create or update)
      const workLogForks: Observable<IJobEstimateWorkLog>[] = logs.map(
        (log) => {
          const payload = {
            ...log,
            jobEstimate: { id: estId },
          };

          return log.id
            ? this._jobEstimateWorkLogService
                .update(payload)
                .pipe(map((response) => response.body as IJobEstimateWorkLog))
            : this._jobEstimateWorkLogService
                .create(payload as NewJobEstimateWorkLog)
                .pipe(map((response) => response.body as IJobEstimateWorkLog));
        }
      );

      // First save logs, then products per log
      forkJoin(workLogForks).subscribe({
        next: (savedLogs) => {
          console.log(`📘 Work logs for estimate ${estId} handled.`);

          const productForks: Observable<IJobEstimateWorkProducts>[] = [];

          savedLogs.forEach((savedLog, logIndex) => {
            const localProducts = logs[logIndex].jobEstimateProducts || [];

            localProducts.forEach((product) => {
              const productPayload = {
                ...product,
                jobEstimate: { id: estId },
                jobEstimateWorkLog: { id: savedLog.id }, // associate with saved work log
              };

              productForks.push(
                product.id
                  ? this._jobEstimateProductService
                      .update(productPayload)
                      .pipe(
                        map(
                          (response) =>
                            response.body as IJobEstimateWorkProducts
                        )
                      )
                  : this._jobEstimateProductService
                      .create({
                        ...productPayload,
                        id: null,
                      } as NewJobEstimateWorkProducts)
                      .pipe(
                        map(
                          (response) =>
                            response.body as IJobEstimateWorkProducts
                        )
                      )
              );
            });
          });

          // Save all products after work logs are saved
          forkJoin(
            productForks.length > 0 ? productForks : [of(null)]
          ).subscribe({
            next: () => {
              console.log(`📦 All products for estimate ${estId} saved.`);
              this.show("alertBox5"); // Vehicle not selected
              setTimeout(() => this.dismiss("alertBox5"), 4000);

              // Proceed to next record
              if (index + 1 < this.jobEstimateTreatments.length) {
                this.updateRecords(index + 1);
              }
            },
            error: (err) => {
              console.error("❌ Failed to update/create products:", err);
            },
          });
        },
        error: (err) => {
          console.error("❌ Failed to update/create work logs:", err);
        },
      });
    });
  }

  removeAssignedUser(treatment: IJobEstimate, user: IJobEstimateWorkLog): void {
    console.log("treatment", treatment);
    console.log("User", user);

    const confirmation = this._fuseConfirmationService.open({
      title: "Delete",
      message:
        "Are you sure you want to delete this? This action cannot be undone!",
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
        if (user.jobEstimateProducts?.length) {
          const deleteObservables = user.jobEstimateProducts.map((product) =>
            this._jobEstimateProductService.delete(product.id)
          );

          forkJoin(deleteObservables).subscribe({
            next: () => {
              this._jobEstimateWorkLogService
                .delete(user.id)
                .subscribe((res) => {
                  this.loadJobWorks();
                  this.show("alertBox6"); // Vehicle not selected
                  setTimeout(() => this.dismiss("alertBox6"), 4000);
                  // alert()
                });
              alert("All Products Deleted");
            },
            error: (err) => {
              console.error("Error deleting products", err);
            },
          });
        } else {
          this._jobEstimateWorkLogService.delete(user.id).subscribe((res) => {
            this.loadJobWorks();
            this.show("alertBox6"); // Vehicle not selected
            setTimeout(() => this.dismiss("alertBox6"), 4000);
            // alert()
          });
        }
      }
    });

    // this._jobEstimateWorkLogService.delete(user.id).subscribe((res) => {
    //   this.loadJobWorks();

    //   // alert()
    // });

    // if (!user.id) {
    //   // If no ID, it's unsaved: just remove from the list
    //   treatment.jobEstimateWorkLogs = treatment.jobEstimateWorkLogs?.filter(
    //     (log) => log !== user
    //   );
    //   return;
    // }

    // const products = user.jobEstimateProducts || [];

    // // Step 1: Prepare product deletion observables
    // const deleteProductCalls = products.map(
    //   (product) =>
    //     product.id
    //       ? this._jobEstimateProductService.delete(product.id)
    //       : of(null) // skip if no id
    // );

    // // Step 2: Delete all products, then delete the work log
    // forkJoin(deleteProductCalls).subscribe({
    //   next: () => {
    //     // Step 3: Now delete the work log
    //     this._jobEstimateWorkLogService.delete(user.id!).subscribe({
    //       next: () => {
    //         // Step 4: Remove from local list
    //         treatment.jobEstimateWorkLogs =
    //           treatment.jobEstimateWorkLogs?.filter(
    //             (log) => log.id !== user.id
    //           );
    //         console.log(
    //           `✅ Deleted work log and its products for ID ${user.id}`
    //         );
    //       },
    //       error: (err) => {
    //         console.error("❌ Failed to delete work log:", err);
    //       },
    //     });
    //   },
    //   error: (err) => {
    //     console.error(
    //       "❌ Failed to delete products before deleting work log:",
    //       err
    //     );
    //   },
    // });
  }

  onRemoveClick(
    event: Event,
    treatment: IJobEstimate,
    user: IJobEstimateWorkLog
  ): void {
    event.stopPropagation(); // prevent edit modal from opening
    this.removeAssignedUser(treatment, user);
  }

  filterWorks(): void {
    const selectedEstID = this.selectedEstimateId;

    if (!selectedEstID || selectedEstID == "ALL") {
      this.filteredJobEstimateTreatments = [...this.jobEstimateTreatments];
      return;
    }

    this.filteredJobEstimateTreatments = this.jobEstimateTreatments.filter(
      (treatment) =>
        parseInt(treatment.estimateID || "0", 10) === Number(selectedEstID)
    );
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }
}
