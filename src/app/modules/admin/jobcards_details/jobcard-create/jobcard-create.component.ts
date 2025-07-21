import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { FuseCardComponent } from "@fuse/components/card";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { IEstimateTreatment } from "app/entities/operationsModuleCooperation/estimate-treatment/estimate-treatment.model";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import {
  IJobCard,
  NewJobCard,
} from "app/entities/operationsModuleCooperation/job-card/job-card.model";
import { JobCardService } from "app/entities/operationsModuleCooperation/job-card/service/job-card.service";
import {
  IJobEstimate,
  NewJobEstimate,
} from "app/entities/operationsModuleCooperation/job-estimate/job-estimate.model";
import {
  IJobItemTimeEstimation,
  NewJobItemTimeEstimation,
} from "app/entities/operationsModuleCooperation/job-item-time-estimation/job-item-time-estimation.model";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { forkJoin, Observable, Subject, takeUntil, tap } from "rxjs";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";
import { JobItemTimeEstimationService } from "app/entities/operationsModuleCooperation/job-item-time-estimation/service/job-item-time-estimation.service";
import { JobEstimateService } from "app/entities/operationsModuleCooperation/job-estimate/service/job-estimate.service";
import { ActivatedRoute } from "@angular/router";
import { FuseAlertComponent, FuseAlertService } from "@fuse/components/alert";
import { MatSnackBar } from "@angular/material/snack-bar";
import { GatePassService } from "app/entities/operationsModuleCooperation/gate-pass/service/gate-pass.service";
import {
  IGatePass,
  NewGatePass,
} from "app/entities/operationsModuleCooperation/gate-pass/gate-pass.model";
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from "@fuse/components/navigation";
import {
  IEstimate,
  NewEstimate,
} from "app/entities/operationsModuleCooperation/estimate/estimate.model";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import dayjs from "dayjs/esm";
import {
  IJobEstimateWorkLog,
  NewJobEstimateWorkLog,
} from "app/entities/operationsModuleCooperation/job-estimate-work-log/job-estimate-work-log.model";
import { JobEstimateWorkLogService } from "app/entities/operationsModuleCooperation/job-estimate-work-log/service/job-estimate-work-log.service";
import { HttpResponse } from "@angular/common/http";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
  selector: "app-jobcard-create",
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
  templateUrl: "./jobcard-create.component.html",
  styleUrl: "./jobcard-create.component.scss",
})
export class JobcardCreateComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  jobCardForm: UntypedFormGroup;
  showDetails: boolean = false;
  searchInputControl = new FormControl();
  jobCardDetails: IJobCard;
  vehicleEstimateTreatments: IJobEstimate[] = [];

  allSelectedTreatments: IJobEstimate[] = [];
  selectedTreatmentsForJobCard: IJobEstimate[] = [];
  selectedEstimateIds: number[] = [];

  selectedVehicleandClientDetails: {
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null = null;
  isInsurance: boolean = false;
  numberOfPanels: number;
  insuranceProviderID: string;
  insuranceProvider: string;
  jobID = "";
  jobCardNumber = "";
  estimateID = 0;
  estimateDetailsFor = 0;
  _estimateService = inject(EstimateService);
  jobEstimateWorkLogService = inject(JobEstimateWorkLogService);

  resentEsitamte: IEstimate[] = [];

  isUpdating: boolean = false;

  jobEstimateWorkers: IJobEstimateWorkLog[] = [];
  _newUser: string = "";
  _newTime: number = 0;
  showUserInputForEstimateId: number | null = null;

  private _fuseAlertService = inject(FuseAlertService);
  _fuseNavigationService = inject(FuseNavigationService);

  constructor(
    private _fb: FormBuilder,
    private _jobCardRegistryService: JobCardService,
    private _jobEstimateService: JobEstimateService,
    private _estimateTreatmentService: EstimateTreatmentService,
    private _selectedCardService: SelectedCardService,
    private _activatedRoute: ActivatedRoute,
    private _snackBarService: MatSnackBar,
    private _fuseConfirmationService: FuseConfirmationService
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

    const jobID = this._activatedRoute.snapshot.paramMap.get("id");
    this.jobID = jobID;

    if (!this.selectedVehicleandClientDetails?.vehicle?.licenseNo) {
      this.show("alertBox5"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox5"), 4000);
      const params2 = {
        size: 5,
        sort: "createdDate,desc",
      };
      this._estimateService.query(params2).subscribe((res) => {
        console.log("Recent all Estimatesssssssssssss:", res.body);
        this.resentEsitamte = res.body || [];
      });
    } else {
      const params = {
        size: 5,
        "licenseNo.contains": `${this.selectedVehicleandClientDetails?.vehicle?.licenseNo}`,
        sort: "createdDate,desc",
      };

      this._estimateService.query(params).subscribe((res) => {
        console.log("Recent Estimatesssssssssssss:", res.body);
        this.resentEsitamte = res.body || [];
        if (res.body.length === 0) {
          const params2 = {
            size: 5,
            sort: "createdDate,desc",
          };
          this._estimateService.query(params2).subscribe((res) => {
            console.log("Recent all Estimatesssssssssssss:", res.body);
            this.resentEsitamte = res.body || [];
          });
        }
      });
    }

    if (jobID) {
      this.isUpdating = true;
      this._jobCardRegistryService.find(parseInt(jobID)).subscribe((res) => {
        if (res.body) {
          this.jobCardDetails = res.body;

          console.log("🛠️ Job Card For Update:", res.body);

          this.jobCardForm.patchValue({ ...res.body });

          const data = res.body;
          const patchedData = {
            ...data,
            startDate: (data.startDate as any)?.toDate?.() ?? data.startDate,
            jobCompleteDate:
              (data.jobCompleteDate as any)?.toDate?.() ?? data.jobCompleteDate,
            boothDate: (data.boothDate as any)?.toDate?.() ?? data.boothDate,
            createdDate:
              (data.createdDate as any)?.toDate?.() ?? data.createdDate,
            lastModifiedDate:
              (data.lastModifiedDate as any)?.toDate?.() ??
              data.lastModifiedDate,
            tinkeringStartDateTime:
              (data.tinkeringStartDateTime as any)?.toDate?.() ??
              data.tinkeringStartDateTime,
            tinkeringEndDateTime:
              (data.tinkeringEndDateTime as any)?.toDate?.() ??
              data.tinkeringEndDateTime,
            paintStartDateTime:
              (data.paintStartDateTime as any)?.toDate?.() ??
              data.paintStartDateTime,
            paintEndDateTime:
              (data.paintEndDateTime as any)?.toDate?.() ??
              data.paintEndDateTime,
            fittingStartDateTime:
              (data.fittingStartDateTime as any)?.toDate?.() ??
              data.fittingStartDateTime,
            fittingEndDateTime:
              (data.fittingEndDateTime as any)?.toDate?.() ??
              data.fittingEndDateTime,
            qcStartDateTime:
              (data.qcStartDateTime as any)?.toDate?.() ?? data.qcStartDateTime,
            qcEndDateTime:
              (data.qcEndDateTime as any)?.toDate?.() ?? data.qcEndDateTime,
            sparePartStartDateTime:
              (data.sparePartStartDateTime as any)?.toDate?.() ??
              data.sparePartStartDateTime,
            sparePartEndDateTime:
              (data.sparePartEndDateTime as any)?.toDate?.() ??
              data.sparePartEndDateTime,
          };

          this.jobCardForm.patchValue(patchedData);
          this.numberOfPanels = res.body.numberOfPanels;
          this.insuranceProvider = res.body.insuranceCompany;

          this.selectedVehicleandClientDetails = {
            vehicle: {
              id: parseInt(res.body.vehicleID, 10),
              licenseNo: res.body.vehicleLicenseNumber,
              brand: res.body.vehicleBrand,
              model: res.body.vehicleModel,
            } as IVehicleRegistry,
            client: {
              id: parseInt(res.body.vehicleOwnerID, 10),
              name: res.body.vehicleOwnerName,
              contactNumber1: res.body.vehicleOwnerContactNumber1,
              contactNumber2: res.body.vehicleOwnerContactNumber2,
            } as IClientRegistry,
          };

          this._jobEstimateService
            .query({ "jobCardId.equals": `${res.body.id}` })
            .subscribe((res) => {
              const estimates: IJobEstimate[] = (res.body || []).map(
                (treatment) => ({
                  ...treatment,
                  startDate: treatment.startDate
                    ? ((treatment.startDate as any).toDate?.() ??
                      treatment.startDate)
                    : null,
                  endDate: treatment.endDate
                    ? ((treatment.endDate as any).toDate?.() ??
                      treatment.endDate)
                    : null,
                  estStartDate: treatment.estStartDate
                    ? ((treatment.estStartDate as any).toDate?.() ??
                      treatment.estStartDate)
                    : null,
                  estEndDate: treatment.estEndDate
                    ? ((treatment.estEndDate as any).toDate?.() ??
                      treatment.estEndDate)
                    : null,
                })
              );

              estimates.forEach((estimate) => {
                const estimateIdNum = parseInt(estimate.estimateID || "0", 10);
                if (
                  estimateIdNum &&
                  !this.selectedEstimateIds.includes(estimateIdNum)
                ) {
                  this.selectedEstimateIds.push(estimateIdNum);
                }

                // 🔄 Fetch related work logs for each job estimate
                if (estimate.id) {
                  this.jobEstimateWorkLogService
                    .query({ "jobEstimateId.equals": estimate.id })
                    .subscribe((workLogsRes) => {
                      const workLogs = workLogsRes.body || [];

                      // Attach logs directly to the treatment
                      const treatmentIndex =
                        this.allSelectedTreatments.findIndex(
                          (t) => t.id === estimate.id
                        );

                      if (treatmentIndex > -1) {
                        this.allSelectedTreatments[
                          treatmentIndex
                        ].jobEstimateWorkLogs =
                          workLogs as NewJobEstimateWorkLog[];
                      }

                      const selectedIndex =
                        this.selectedTreatmentsForJobCard.findIndex(
                          (t) => t.id === estimate.id
                        );

                      if (selectedIndex > -1) {
                        this.selectedTreatmentsForJobCard[
                          selectedIndex
                        ].jobEstimateWorkLogs =
                          workLogs as NewJobEstimateWorkLog[];
                      }

                      console.log(
                        `📋 Work Logs for Job Estimate ${estimate.id}:`,
                        workLogs
                      );
                    });
                }
              });

              this.allSelectedTreatments = estimates;

              if (this.selectedEstimateIds.length > 0) {
                this.filterItems(this.selectedEstimateIds[0]);
              }

              console.log("Job Item For Update:", estimates);
            });

          this.showDetails = true;
        }
      });
    }

    this._selectedCardService.selectedCard$.subscribe((selected) => {
      // alert(
      //   "Selected Vehicle: " +
      //     JSON.stringify(selected?.vehicle) +
      //     "\nSelected Client: " +
      //     JSON.stringify(selected?.client)
      // );
      this.selectedVehicleandClientDetails = selected;
    });
    this.jobCardForm = this._fb.group({
      id: [null],
      // vehicleID: [null],
      // vehicleBrand: [null],
      // vehicleModel: [null],
      // vehicleLicenseNumber: [null],
      // vehicleOwnerID: [null],
      // vehicleOwnerName: [null],
      // vehicleOwnerContactNumber1: [null],
      // vehicleOwnerContactNumber2: [null],
      estimateID: [null],
      // insuranceCompany: [null],
      serviceAdvisor: [null],
      // numberOfPanels: [null],
      fuelLevel: [null],
      meterReading: [null],
      startDate: [null, Validators.required],
      jobCardNumber: [null],
      jobCompleteDate: [null, Validators.required],
      boothDate: [null, Validators.required],
      opsUnitID: [null],
      createdBy: [null],
      createdDate: [null],
      lastModifiedBy: [null],
      lastModifiedDate: [null],
      tinkeringStartDateTime: [null],
      tinkeringEndDateTime: [null],
      fittingStartDateTime: [null],
      fittingEndDateTime: [null],
      paintStartDateTime: [null],
      paintEndDateTime: [null],
      qcStartDateTime: [null],
      qcEndDateTime: [null],
      sparePartStartDateTime: [null],
      sparePartEndDateTime: [null],
      ownerBelongings: [null],
    });
  }

  loadEstimate(): void {
    const search = this.searchInputControl.value?.trim();

    this._estimateService
      .find(search)
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap((res) => {
          console.log(res.body, "This is coming from load");
          this.resentEsitamte = Array.isArray(res.body) ? res.body : [res.body];
          // if (res.body) {
          //   this.isInsurance = res.body.isInsurance;
          //   this.insuranceProviderID = res.body.insuranceID;
          //   this.insuranceProvider = res.body.insuranceName;
          //   this.numberOfPanels = res.body.numberOfPanels;
          //   this.estimateID = res.body.id;
          // }
          // const estimate = { ...res.body };
          // delete estimate.id;
          // this.jobCardDetails = { ...res.body };
          // this.jobCardDetails.vehicleLicenseNumber = res.body.licenseNo;
          // this.jobCardDetails.insuranceCompany = res.body.insuranceName;
          // if (this.jobCardDetails) {
          //   this._estimateTreatmentService
          //     .query({
          //       "estimateId.equals": `${res.body.id}`,
          //     })
          //     .subscribe((res) => {
          //       const treatments: IEstimateTreatment[] = res.body || [];

          //       // Transform into IJobItemTimeEstimation
          //       this.vehicleEstimateTreatments = treatments.map((treatment) => {
          //         const remark =
          //           treatment.partName ||
          //           treatment.repairName ||
          //           treatment.paintName ||
          //           treatment.fittingChargeName ||
          //           treatment.other ||
          //           "";

          //         const jobItem: IJobEstimate = {
          //           id: treatment.id,
          //           remarks: remark,
          //         };

          //         return jobItem;
          //       });
          //     });
          // }
        })
      )
      .subscribe();
  }

  selectEsitamte(id: number): void {
    // this.searchInputControl.setValue(String(id));

    // if (!this.searchInputControl.value) return;

    // this.loadEstimate();

    this._estimateService
      .find(id)
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap((res) => {
          const vehicleLicenseNo = res.body.licenseNo;

          this.isInsurance = res.body.isInsurance;
          this.insuranceProviderID = res.body.insuranceID;
          this.insuranceProvider = res.body.insuranceName;
          this.numberOfPanels = res.body.numberOfPanels;
          this.estimateID = res.body.id;

          // const estimate = { ...res.body };
          // delete estimate.id;
          this.jobCardDetails = { ...res.body };
          this.jobCardDetails.vehicleLicenseNumber = res.body.licenseNo;
          this.jobCardDetails.insuranceCompany = res.body.insuranceName;

          this._estimateTreatmentService
            .query({ "estimateId.equals": `${res.body.id}` })
            .subscribe((res) => {
              const treatments: IEstimateTreatment[] = res.body || [];

              // Filter out treatments already added
              const newItems: IJobEstimate[] = treatments
                .filter(
                  (t) =>
                    !this.selectedTreatmentsForJobCard.some(
                      (j) => j.id === t.id
                    )
                )
                .map((treatment) => {
                  const remark =
                    treatment.partName ||
                    treatment.repairName ||
                    treatment.paintName ||
                    treatment.fittingChargeName ||
                    treatment.other ||
                    "";

                  return {
                    // startDate: dayjs(),
                    id: treatment.id,
                    remarks: remark,
                    estimateID: id.toString(),
                    vehicleLicenseNumber: vehicleLicenseNo,
                  };
                });

              if (newItems.length > 0) {
                this.allSelectedTreatments.push(...newItems);
                //This is the data that im using
                this.selectedTreatmentsForJobCard.push(...newItems);
                if (!this.selectedEstimateIds.includes(id)) {
                  this.selectedEstimateIds.push(id);
                }

                //remove the added estimate from recent
                this.resentEsitamte = this.resentEsitamte.filter(
                  (e) => e.id !== id
                );

                // const jobEstimateIds = newItems.map((item) => item.id);

                // jobEstimateIds.forEach((jobEstimateId) => {
                //   this.jobEstimateWorkLogService
                //     .query({ "jobEstimateId.equals": jobEstimateId })
                //     .subscribe((workLogs) => {
                //       this.jobEstimateWorkers = workLogs.body;
                //       console.log(
                //         `Work logs for estimate ID ${jobEstimateId}:`,
                //         workLogs.body
                //       );
                //     });
                // });
                this.filterItems(id); // Apply initial filter
              }
            });
        })
      )
      .subscribe();
  }

  filterItems(id: number): void {
    this.estimateDetailsFor = id;
    this.selectedTreatmentsForJobCard = this.allSelectedTreatments.filter(
      (item) => Number(item.estimateID) === id
    );
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  async createJobCard(): Promise<void> {
    const nextJobCardNumber = await this.getNexJobID();
    const jobCard: NewJobCard = {
      ...this.jobCardForm.getRawValue(),
      id: null,
      vehicleID: this.jobCardDetails.vehicleID,
      vehicleLicenseNumber: this.jobCardDetails.vehicleLicenseNumber,
      vehicleBrand: this.jobCardDetails.vehicleBrand,
      vehicleModel: this.jobCardDetails.vehicleModel,
      vehicleOwnerID: this.jobCardDetails.vehicleOwnerID,
      vehicleOwnerName: this.jobCardDetails.vehicleOwnerName,
      vehicleOwnerContactNumber1:
        this.jobCardDetails.vehicleOwnerContactNumber1,
      vehicleOwnerContactNumber2:
        this.jobCardDetails.vehicleOwnerContactNumber2,
      insuranceCompany: this.insuranceProvider,
      numberOfPanels: this.numberOfPanels,
      serviceAdvisor: this.jobCardDetails.serviceAdvisor,
      serviceAdvisorID: this.jobCardDetails.serviceAdvisorID,
      estimateID: this.estimateID,
      ownerBelongings: this.jobCardDetails.ownerBelongings,
      jobCardNumber: nextJobCardNumber,
    };

    if (
      this.jobCardDetails.vehicleID === null ||
      this.jobCardDetails.vehicleLicenseNumber === ""
    ) {
      this.show("alertBox4"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox4"), 4000);
      return;
    }

    this._jobCardRegistryService.create(jobCard).subscribe((res) => {
      console.log("Job Card Created: ", res);
      if (res.body) {
        this.jobCardNumber = res.body.jobCardNumber;
        this.jobID = res.body.id.toString();
        this.allSelectedTreatments = this.allSelectedTreatments.map((q) => {
          return {
            ...q,
            id: null,

            jobID: res.body.id.toString(),
            jobCard: {
              id: res.body.id,
            },
          } as NewJobEstimate;
        });

        this.createRecords(0);

        this.jobID = res.body.id.toString();

        // TODO assign id
        // this.createJobItemTimeEstimationService(res.body.id);
        this.createGatepss(res.body.jobCardNumber);
      }
      // Handle success response
    });
  }

  private gatePassService = inject(GatePassService);

  createGatepss(jobCardNumber: string): void {
    const newGatePass: NewGatePass = {
      id: null,
      vehicleID: this.jobCardDetails.vehicleID,
      vehicleLicenseNumber: this.jobCardDetails.vehicleLicenseNumber,
      vehicleBrand: this.jobCardDetails.vehicleBrand,
      vehicleModel: this.jobCardDetails.vehicleModel,
      vehicleOwnerID: this.jobCardDetails.vehicleOwnerID,
      vehicleOwnerName: this.jobCardDetails.vehicleOwnerName,
      vehicleOwnerContactNumber1:
        this.jobCardDetails.vehicleOwnerContactNumber1,
      vehicleOwnerContactNumber2:
        this.jobCardDetails.vehicleOwnerContactNumber2,
      jobCardNumber: jobCardNumber,
      fuelLevel: this.jobCardForm.get("fuelLevel")?.value,
      meterReading: this.jobCardForm.get("meterReading")?.value,
      status: "OPEN",
      ownerBelongings: this.jobCardDetails.ownerBelongings,
    };

    console.log("Gate Pass Created: ", newGatePass);
    this.gatePassService.create(newGatePass).subscribe();
  }

  addAssignedUser(treatment: IJobEstimate, i: number): void {
    if (!this._newUser || !this._newTime || !treatment.id) return;

    const newWorkLog: IJobEstimateWorkLog = {
      id: null,
      workedEmployeeName: this._newUser,
      workedHours: this._newTime,
      workDate: dayjs(),
      jobEstimate: {
        id: null,
      } as IJobEstimate,
    };
    if (
      this.selectedTreatmentsForJobCard[i].jobEstimateWorkLogs === undefined
    ) {
      this.selectedTreatmentsForJobCard[i].jobEstimateWorkLogs = [];
    }

    this.selectedTreatmentsForJobCard[i].jobEstimateWorkLogs.push(
      newWorkLog as NewJobEstimateWorkLog
    );
    this.jobEstimateWorkers.push(newWorkLog);
    console.log(this.jobEstimateWorkers);

    // Reset inputs and hide the field
    this._newUser = "";
    this._newTime = 0;
    this.showUserInputForEstimateId = null;
  }

  onLogs(i: number) {
    console.log(this.selectedTreatmentsForJobCard[i]);
  }

  // addAssignedUser(treatment: IJobEstimate): void {
  //   console.log(treatment);
  //   const newWorkLog: IJobEstimateWorkLog = {
  //     id: Date.now(), // temporary local ID (use 0 if backend assigns it)
  //     workedEmployeeName: this._newUser,
  //     workedHours: this._newTime,
  //     workDate: dayjs(),
  //     jobEstimate: {
  //       id: treatment.id,
  //     } as IJobEstimate,
  //   };

  //   this.jobEstimateWorkers.push(newWorkLog);
  //   // if (!this.jobEstimateWorkers) this.jobEstimateWorkers = [];
  //   this.jobEstimateWorkers.push({
  //     id: null,
  //     workedEmployeeName: this._newUser,
  //     workedHours: this._newTime,
  //     workDate: dayjs(),
  //     jobEstimate: null,
  //   });

  //   this._newUser = "";
  //   this._newTime = 0;

  //   // if (
  //   //   treatment._newUser &&
  //   //   treatment._newTime &&
  //   //   treatment.id &&
  //   //   treatment.jobID
  //   // ) {
  //   //   // // Create IJobEstimateWorkLog entry
  //   //   // const newWorkLog: IJobEstimateWorkLog = {
  //   //   //   id: Date.now(), // temporary local ID (use 0 if backend assigns it)
  //   //   //   workedEmployeeName: treatment._newUser,
  //   //   //   workedHours: Number(treatment._newTime),
  //   //   //   workDate: dayjs(), // current timestamp
  //   //   //   jobEstimate: {
  //   //   //     id: treatment.id,
  //   //   //   } as IJobEstimate,
  //   //   // };

  //   //   // // ✅ Push to your central work log list
  //   //   // this.jobEstimateWorkers.push(newWorkLog);

  //   //   // // ✅ Optional: Add to chip UI list per treatment
  //   //   // if (!treatment.assignedUsers) treatment.assignedUsers = [];
  //   //   // treatment.assignedUsers.push({
  //   //   //   name: treatment._newUser,
  //   //   //   time: treatment._newTime,
  //   //   // });

  //   //   // Clear input fields
  //   //   treatment._newUser = "";
  //   //   treatment._newTime = "";
  //   //   treatment._showUserFields = false;
  //   // }
  // }

  removeAssignedUser(treatment: IJobEstimate, user: IJobEstimateWorkLog): void {
    if (treatment.jobEstimateWorkLogs) {
      treatment.jobEstimateWorkLogs = treatment.jobEstimateWorkLogs.filter(
        (u) => u.id !== user.id
      );
    }
  }

  getWorkersForEstimate(estimateId: number): IJobEstimateWorkLog[] {
    return this.jobEstimateWorkers.filter(
      (w) => w.jobEstimate?.id === estimateId
    );
  }

  createJobItemTimeEstimationService(jobCardID: number): void {
    const jobEstimates: IJobEstimate[] = this.allSelectedTreatments.map(
      (treatment) => ({
        id: null,

        estimateID: treatment.estimateID,
        vehicleLicenseNumber: treatment.vehicleLicenseNumber,
        departmentID: treatment.departmentID ?? null,
        startDate: treatment.startDate ?? null,
        endDate: treatment.endDate ?? null,
        currentState: treatment.currentState ?? null,
        remarks: treatment.remarks ?? null,
        estStartDate: treatment.estStartDate ?? null,
        estEndDate: treatment.estEndDate ?? null,
        opsUnitID: treatment.opsUnitID ?? null,
        createdBy: treatment.createdBy ?? null,
        createdDate: treatment.createdDate ?? null,
        lastModifiedBy: treatment.lastModifiedBy ?? null,
        lastModifiedDate: treatment.lastModifiedDate ?? null,
        jobID: jobCardID.toString(),
        jobCard: {
          id: jobCardID,
        },
      })
    );

    jobEstimates.forEach((jobEstimate) => {
      const newJobEstimate: NewJobEstimate = {
        ...jobEstimate,
        id: null,
      };

      console.log("New job Estimate", newJobEstimate);

      this._jobEstimateService.create(newJobEstimate).subscribe({
        next: (response) => {
          const createdEstimate = response.body;
          console.log("Job estimate saved:", createdEstimate);

          // const relatedLogs = this.jobEstimateWorkers.filter(
          //   (log) => log.jobEstimate?.jobID === jobEstimate.jobID
          // );

          // console.log(
          //   "Matched logs for jobID:",
          //   jobEstimate.jobID,
          //   relatedLogs
          // );

          // relatedLogs.forEach((log) => {
          //   const newWorkLog: NewJobEstimateWorkLog = {
          //     id: null,
          //     workedEmployeeName: log.workedEmployeeName,
          //     workedHours: log.workedHours,
          //     workDate: log.workDate,
          //     jobEstimate: { id: createdEstimate?.id ?? 0 }, // link new estimate ID
          //   };

          //   console.log("Work Log for line", newWorkLog);

          //   // this.jobEstimateWorkLogService.create(newWorkLog).subscribe({
          //   //   next: (logResponse) => {
          //   //     console.log("Work log posted:", logResponse.body);
          //   //   },
          //   //   error: (logErr) => {
          //   //     console.error("Error creating work log:", logErr);
          //   //   },
          //   // });
          // });

          this._snackBarService.open(
            "Job Estimate Created Successfully!",
            "Close",
            { duration: 3000 }
          );
        },
        error: (err) => {
          console.error("Error Saving Job Estimate:", err);
          this._snackBarService.open("Error!", "Close", { duration: 3000 });
        },
      });
    });
  }

  updateJobCard(): void {
    const jobCard: IJobCard = {
      ...this.jobCardForm.getRawValue(),
      id: this.jobID,
      vehicleID: this.jobCardDetails.vehicleID,
      vehicleLicenseNumber: this.jobCardDetails.vehicleLicenseNumber,
      vehicleBrand: this.jobCardDetails.vehicleBrand,
      vehicleModel: this.jobCardDetails.vehicleModel,
      vehicleOwnerID: this.jobCardDetails.vehicleOwnerID,
      vehicleOwnerName: this.jobCardDetails.vehicleOwnerName,
      vehicleOwnerContactNumber1:
        this.jobCardDetails.vehicleOwnerContactNumber1,
      vehicleOwnerContactNumber2:
        this.jobCardDetails.vehicleOwnerContactNumber2,
      insuranceCompany: this.insuranceProvider,
      numberOfPanels: this.numberOfPanels,
      serviceAdvisor: this.jobCardDetails.serviceAdvisor,
      serviceAdvisorID: this.jobCardDetails.serviceAdvisorID,
      estimateID: this.jobCardDetails.estimateID,
      ownerBelongings: this.jobCardDetails.ownerBelongings,
      jobCardNumber: this.jobCardDetails.jobCardNumber,
    };

    if (
      this.jobCardDetails.vehicleID === null ||
      this.jobCardDetails.vehicleLicenseNumber === ""
    ) {
      this.show("alertBox4"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox4"), 4000);
      return;
    }

    // this._jobCardRegistryService.update(jobCard).subscribe((res) => {
    //   console.log("Job Card Created: ", res);
    //   if (res.body) {
    //     this.allSelectedTreatments = this.allSelectedTreatments.map((q) => {
    //       return {
    //         ...q,
    //         id: res.body.id,

    //         jobID: res.body.id.toString(),
    //         jobCard: {
    //           id: res.body.id,
    //         },
    //       } as NewJobEstimate;
    //     });
    //     this.updateRecords(0);
    //   }
    //   // Handle success response
    // });

    this._jobCardRegistryService.update(jobCard).subscribe((res) => {
      console.log("Job Card Created: ", res);
      if (res.body) {
        // this.updateJobItemTimeEstimationService(res.body.id);
        this.updateRecords(0);
      }
      // Handle success response
    });
  }

  updateJobItemTimeEstimationService(jobCardID: number): void {
    const jobEstimates: IJobEstimate[] = this.allSelectedTreatments.map(
      (treatment) => ({
        id: treatment.id,
        jobID: jobCardID.toString() ?? null,
        departmentID: treatment.departmentID ?? null,
        estimateID: treatment.estimateID,
        vehicleLicenseNumber: treatment.vehicleLicenseNumber,
        startDate: treatment.startDate ?? null,
        endDate: treatment.endDate ?? null,
        currentState: treatment.currentState ?? null,
        remarks: treatment.remarks ?? null,
        estStartDate: treatment.estStartDate ?? null,
        estEndDate: treatment.estEndDate ?? null,
        opsUnitID: treatment.opsUnitID ?? null,
        createdBy: treatment.createdBy ?? null,
        createdDate: treatment.createdDate ?? null,
        lastModifiedBy: treatment.lastModifiedBy ?? null,
        lastModifiedDate: treatment.lastModifiedDate ?? null,
        jobCard: {
          id: jobCardID,
        },
      })
    );

    // Now send to your service
    jobEstimates.forEach((jobEstimate) => {
      this._jobEstimateService.update(jobEstimate).subscribe({
        next: (response) => {
          console.log("Job estimate saved:", response);
          this._snackBarService.open(
            "Job Estimate Updated Successfully!",
            "Close",
            {
              duration: 3000,
            }
          );
        },
        error: (err) => {
          this._snackBarService.open("Error Updated!", "Close", {
            duration: 3000,
          });
          console.error("Error Saving Job Estimate:", err);
        },
      });
    });
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  // createRecords(index: number) {
  //   const record: IJobEstimate = this.allSelectedTreatments[index];
  //   this._jobEstimateService.create(record as NewJobEstimate).subscribe((q) => {
  //     const estId = q.body.id;
  //     // alert(estId);
  //     const workLogs: IJobEstimateWorkLog[] = [];
  //     console.log();
  //     console.log();
  //     console.log(record);

  //     if (record.jobEstimateWorkLogs === undefined) {
  //       if (index + 1 === this.allSelectedTreatments.length) {
  //       } else {
  //         this.createRecords(index + 1);
  //       }
  //       return;
  //     }
  //     const workLogForks: Observable<HttpResponse<IJobEstimateWorkLog>>[] =
  //       record.jobEstimateWorkLogs.map((w) => {
  //         return this.jobEstimateWorkLogService.create({
  //           ...w,
  //           jobEstimate: { id: estId },
  //         } as NewJobEstimateWorkLog);
  //       });

  //     forkJoin(workLogForks).subscribe((q) => {
  //       if (index + 1 === this.allSelectedTreatments.length) {
  //       } else {
  //         this.createRecords(index + 1);
  //       }
  //     });
  //   });
  // }

  createRecords(index: number) {
    const record: IJobEstimate = this.allSelectedTreatments[index];

    this._jobEstimateService
      .create(record as NewJobEstimate)
      .subscribe((res) => {
        const estId = res.body?.id;
        if (!estId) {
          console.error("Failed to create job estimate record");
          return;
        }

        console.log("Created Job Estimate with ID:", estId);

        const logs = record.jobEstimateWorkLogs || [];

        const proceedToNext = () => {
          if (index + 1 < this.allSelectedTreatments.length) {
            this.createRecords(index + 1);
          } else {
            // All done — now patch the job card & fetch work logs
            if (this.jobID) {
              this.isUpdating = true;
              this._jobCardRegistryService
                .find(parseInt(this.jobID))
                .subscribe((res) => {
                  if (res.body) {
                    this.jobCardDetails = res.body;

                    console.log("🛠️ Job Card For Update:", res.body);

                    this.jobCardForm.patchValue({ ...res.body });

                    const data = res.body;
                    const patchedData = {
                      ...data,
                      startDate:
                        (data.startDate as any)?.toDate?.() ?? data.startDate,
                      jobCompleteDate:
                        (data.jobCompleteDate as any)?.toDate?.() ??
                        data.jobCompleteDate,
                      boothDate:
                        (data.boothDate as any)?.toDate?.() ?? data.boothDate,
                      createdDate:
                        (data.createdDate as any)?.toDate?.() ??
                        data.createdDate,
                      lastModifiedDate:
                        (data.lastModifiedDate as any)?.toDate?.() ??
                        data.lastModifiedDate,
                      tinkeringStartDateTime:
                        (data.tinkeringStartDateTime as any)?.toDate?.() ??
                        data.tinkeringStartDateTime,
                      tinkeringEndDateTime:
                        (data.tinkeringEndDateTime as any)?.toDate?.() ??
                        data.tinkeringEndDateTime,
                      paintStartDateTime:
                        (data.paintStartDateTime as any)?.toDate?.() ??
                        data.paintStartDateTime,
                      paintEndDateTime:
                        (data.paintEndDateTime as any)?.toDate?.() ??
                        data.paintEndDateTime,
                      fittingStartDateTime:
                        (data.fittingStartDateTime as any)?.toDate?.() ??
                        data.fittingStartDateTime,
                      fittingEndDateTime:
                        (data.fittingEndDateTime as any)?.toDate?.() ??
                        data.fittingEndDateTime,
                      qcStartDateTime:
                        (data.qcStartDateTime as any)?.toDate?.() ??
                        data.qcStartDateTime,
                      qcEndDateTime:
                        (data.qcEndDateTime as any)?.toDate?.() ??
                        data.qcEndDateTime,
                      sparePartStartDateTime:
                        (data.sparePartStartDateTime as any)?.toDate?.() ??
                        data.sparePartStartDateTime,
                      sparePartEndDateTime:
                        (data.sparePartEndDateTime as any)?.toDate?.() ??
                        data.sparePartEndDateTime,
                    };

                    this.jobCardForm.patchValue(patchedData);
                    this.numberOfPanels = res.body.numberOfPanels;
                    this.insuranceProvider = res.body.insuranceCompany;

                    this.selectedVehicleandClientDetails = {
                      vehicle: {
                        id: parseInt(res.body.vehicleID, 10),
                        licenseNo: res.body.vehicleLicenseNumber,
                        brand: res.body.vehicleBrand,
                        model: res.body.vehicleModel,
                      } as IVehicleRegistry,
                      client: {
                        id: parseInt(res.body.vehicleOwnerID, 10),
                        name: res.body.vehicleOwnerName,
                        contactNumber1: res.body.vehicleOwnerContactNumber1,
                        contactNumber2: res.body.vehicleOwnerContactNumber2,
                      } as IClientRegistry,
                    };

                    this._jobEstimateService
                      .query({ "jobCardId.equals": `${res.body.id}` })
                      .subscribe((res) => {
                        const estimates: IJobEstimate[] = (res.body || []).map(
                          (treatment) => ({
                            ...treatment,
                            startDate: treatment.startDate
                              ? ((treatment.startDate as any).toDate?.() ??
                                treatment.startDate)
                              : null,
                            endDate: treatment.endDate
                              ? ((treatment.endDate as any).toDate?.() ??
                                treatment.endDate)
                              : null,
                            estStartDate: treatment.estStartDate
                              ? ((treatment.estStartDate as any).toDate?.() ??
                                treatment.estStartDate)
                              : null,
                            estEndDate: treatment.estEndDate
                              ? ((treatment.estEndDate as any).toDate?.() ??
                                treatment.estEndDate)
                              : null,
                          })
                        );

                        estimates.forEach((estimate) => {
                          const estimateIdNum = parseInt(
                            estimate.estimateID || "0",
                            10
                          );
                          if (
                            estimateIdNum &&
                            !this.selectedEstimateIds.includes(estimateIdNum)
                          ) {
                            this.selectedEstimateIds.push(estimateIdNum);
                          }

                          // 🔄 Fetch related work logs for each job estimate
                          if (estimate.id) {
                            this.jobEstimateWorkLogService
                              .query({ "jobEstimateId.equals": estimate.id })
                              .subscribe((workLogsRes) => {
                                const workLogs = workLogsRes.body || [];

                                // Attach logs directly to the treatment
                                const treatmentIndex =
                                  this.allSelectedTreatments.findIndex(
                                    (t) => t.id === estimate.id
                                  );

                                if (treatmentIndex > -1) {
                                  this.allSelectedTreatments[
                                    treatmentIndex
                                  ].jobEstimateWorkLogs =
                                    workLogs as NewJobEstimateWorkLog[];
                                }

                                const selectedIndex =
                                  this.selectedTreatmentsForJobCard.findIndex(
                                    (t) => t.id === estimate.id
                                  );

                                if (selectedIndex > -1) {
                                  this.selectedTreatmentsForJobCard[
                                    selectedIndex
                                  ].jobEstimateWorkLogs =
                                    workLogs as NewJobEstimateWorkLog[];
                                }

                                console.log(
                                  `📋 Work Logs for Job Estimate ${estimate.id}:`,
                                  workLogs
                                );
                              });
                          }
                        });

                        this.allSelectedTreatments = estimates;

                        if (this.selectedEstimateIds.length > 0) {
                          this.filterItems(this.selectedEstimateIds[0]);
                        }

                        console.log("Job Item For Update:", estimates);
                      });

                    this.showDetails = true;
                  }
                });
            }
            this.finalizeAfterAllEstimatesCreated();
          }
        };

        if (logs.length === 0) {
          proceedToNext();
          return;
        }

        const workLogRequests: Observable<HttpResponse<IJobEstimateWorkLog>>[] =
          logs.map((log) =>
            this.jobEstimateWorkLogService.create({
              ...log,
              jobEstimate: { id: estId },
            } as NewJobEstimateWorkLog)
          );

        forkJoin(workLogRequests).subscribe({
          next: () => {
            console.log(
              `🛠️ Created ${logs.length} work logs for estimate ${estId}`
            );
            proceedToNext();
          },
          error: (err) => {
            console.error("❌ Failed to create work logs:", err);
            proceedToNext(); // Still proceed to avoid infinite loop
          },
        });
      });
  }

  finalizeAfterAllEstimatesCreated() {
    this._fuseConfirmationService.open({
      title: "Success!",
      message:
        "All job estimates and work logs have been created successfully.",
      icon: {
        name: "heroicons_outline:check-circle",
        color: "accent",
      },
      dismissible: true,
      actions: {
        confirm: {
          label: "OK",
          color: "primary",
        },
      },
    });
  }

  toDate(value: any): Date | null {
    return value?.toDate?.() ?? value ?? null;
  }

  updateRecords(index: number) {
    const record: IJobEstimate = this.allSelectedTreatments[index];

    if (!record.id) {
      console.error("Cannot update a record without an ID:", record);
    } else {
      this._jobEstimateService.update(record).subscribe((res) => {
        const estId = res.body?.id;
        if (!estId) {
          console.error("Failed to update job estimate record");
          return;
        }

        console.log("Updated Job Estimate with ID:", estId);

        const logs = record.jobEstimateWorkLogs;

        const handleNext = () => {
          if (index + 1 < this.allSelectedTreatments.length) {
            this.updateRecords(index + 1);
          } else {
            // All updates done — show success confirmation
            this._fuseConfirmationService.open({
              title: "Updates Complete!",
              message:
                "All job estimates and work logs have been updated successfully.",
              icon: {
                name: "heroicons_outline:check-circle",
                color: "accent",
              },
              dismissible: true,
              actions: {
                confirm: {
                  label: "OK",
                  color: "primary",
                },
              },
            });
          }
        };

        if (!logs || logs.length === 0) {
          handleNext();
          return;
        }

        const workLogForks: Observable<HttpResponse<IJobEstimateWorkLog>>[] =
          logs.map((log) => {
            const payload = {
              ...log,
              jobEstimate: { id: estId },
            };

            return log.id
              ? this.jobEstimateWorkLogService.update(
                  payload as IJobEstimateWorkLog
                )
              : this.jobEstimateWorkLogService.create(
                  payload as NewJobEstimateWorkLog
                );
          });

        forkJoin(workLogForks).subscribe({
          next: () => {
            console.log(`Work logs for estimate ${estId} handled.`);
            handleNext();
          },
          error: (err) => {
            console.error("Failed to update/create work logs:", err);
          },
        });
      });
    }
  }

  getNexJobID(): Promise<string> {
    const params = {
      page: 0,
      size: 1,
      sort: "id,desc", // safer fallback than string sort
    };

    return new Promise((resolve) => {
      this._jobCardRegistryService.query(params).subscribe((res) => {
        const latest = res.body?.[0];
        let nextID = "JOB-000001";

        if (latest?.jobCardNumber) {
          const lastNumber = parseInt(
            latest.jobCardNumber.replace("JOB-", ""),
            10
          );
          const newNumber = lastNumber + 1;
          nextID = "JOB-" + newNumber.toString().padStart(6, "0");
        }

        resolve(nextID);
      });
    });
  }
}
