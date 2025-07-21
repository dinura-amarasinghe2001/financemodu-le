import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatOptionModule } from "@angular/material/core";
import {
  MatDatepicker,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator } from "@angular/material/paginator";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute, Route, Router } from "@angular/router";
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from "@fuse/components/navigation";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { ClientRegistryService } from "app/entities/operationsModuleCooperation/client-registry/service/client-registry.service";
import {
  IEstimateTreatment,
  NewEstimateTreatment,
} from "app/entities/operationsModuleCooperation/estimate-treatment/estimate-treatment.model";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import {
  IEstimate,
  NewEstimate,
} from "app/entities/operationsModuleCooperation/estimate/estimate.model";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import { IPreEstimateTreatment } from "app/entities/operationsModuleCooperation/pre-estimate-treatment/pre-estimate-treatment.model";
import { PreEstimateTreatmentService } from "app/entities/operationsModuleCooperation/pre-estimate-treatment/service/pre-estimate-treatment.service";
import { PreEstimateService } from "app/entities/operationsModuleCooperation/pre-estimate/service/pre-estimate.service";
import { VehicleModelService } from "app/entities/operationsModuleCooperation/vehicle-model/service/vehicle-model.service";
import { VehicleRegistryService } from "app/entities/operationsModuleCooperation/vehicle-registry/service/vehicle-registry.service";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { VehicleTreatmentRegistryService } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/service/vehicle-treatment-registry.service";
import { IVehicleTreatmentRegistry } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/vehicle-treatment-registry.model";
import dayjs from "dayjs/esm";
import { Subject, takeUntil, tap } from "rxjs";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";
import { FuseConfirmationService } from "@fuse/services/confirmation";

@Component({
  selector: "app-create-estimate",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./create-estimate.component.html",
  styleUrl: "./create-estimate.component.scss",
})
export class CreateEstimateComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  searchInputControl = new FormControl();

  esitamte: IEstimate;
  resentEsitamte: IEstimate[] = [];
  vehiclePreEstimateTreatments: IEstimateTreatment[] = [];

  totalItems: number = 0;
  itemsPerPage: number = 10;

  esitamteID: string | null = null;
  estimateNumber: string | null = null;

  user: User;

  partTreatments: IVehicleTreatmentRegistry[] = [];
  paintTreatments: IVehicleTreatmentRegistry[] = [];
  fittingChargeTreatments: IVehicleTreatmentRegistry[] = [];
  repairTreatments: IVehicleTreatmentRegistry[] = [];
  otherTreatments: IVehicleTreatmentRegistry[] = [];
  preEstimateType: string = "";

  ///////////////////////////////////////////////////
  allVehicleDetails: IVehicleRegistry[] = [];
  allClientDetails: IClientRegistry[] = [];

  searchByVehicleNo: boolean = true;
  selectedCard: {
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null = null;

  _fuseNavigationService = inject(FuseNavigationService);
  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _preEstimateService: PreEstimateService,
    private _estimateService: EstimateService,
    private _estimateTreatmentService: EstimateTreatmentService,
    private _vehicleRegistryService: VehicleRegistryService,
    private _clientRegistryService: ClientRegistryService,
    private _preEstimateTreatmentService: PreEstimateTreatmentService,
    private _vehicleModelService: VehicleModelService,
    private _vehicleTreatmentRegistryService: VehicleTreatmentRegistryService,
    private _route: ActivatedRoute,
    private _snackBarService: MatSnackBar,
    private _userService: UserService,
    private _router: Router,
    private _selectedCardService: SelectedCardService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      // this.page = 0;
      this.loadPreEstimates();
    });

    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        "mainNavigation"
      );
    navigation.close();

    const presEstimateID =
      this._router.getCurrentNavigation()?.extras.state?.["presEstimateID"];

    // alert(presEstimateID);
    this.searchInputControl.setValue(presEstimateID);

    if (presEstimateID) {
      this.loadPreEstimates();
      console.log("Im first");
    }
  }

  ngOnInit(): void {
    this._selectedCardService.selectedCard$.subscribe((selected) => {
      // alert(
      //   "Selected Vehicle: " +
      //     JSON.stringify(selected?.vehicle) +
      //     "\nSelected Client: " +
      //     JSON.stringify(selected?.client)
      // );
      this.selectedCard = selected;
      console.log("Selected Vehicle and Client Details:", this.selectedCard);
    });

    this._userService.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((user: User) => {
        this.user = user;
      });

    const params = {
      size: 5,
      "licenseNo.contains": `${this.selectedCard?.vehicle?.licenseNo}`,
      sort: "createdDate,desc",
    };

    this._preEstimateService.query(params).subscribe((res) => {
      console.log("Recent Estimatesssssssssssss:", res.body);
      this.resentEsitamte = res.body || [];
      if (res.body.length === 0) {
        const params2 = {
          size: 5,
          sort: "createdDate,desc",
        };
        this._preEstimateService.query(params2).subscribe((res) => {
          console.log("Recent Estimatesssssssssssss:", res.body);
          this.resentEsitamte = res.body || [];
        });
      }
    });

    const id = this._route.snapshot.paramMap.get("id");
    this.esitamteID = id;
    if (id) {
      this._estimateService.find(Number(id)).subscribe((res) => {
        this.esitamte = res.body;
        this.estimateNumber = res.body.estimateID;
        if (this.esitamte) {
          this._estimateTreatmentService
            .query({
              "estimateId.equals": `${this.esitamte.id}`,
            })
            .subscribe((res) => {
              console.log("🚗 Vehicle Pre-Estimate Treatments:", res.body);
              this.vehiclePreEstimateTreatments = res.body || [];
              if (this.vehiclePreEstimateTreatments.length > 0) {
                this.vehiclePreEstimateTreatments.forEach((treatment) => {
                  const section = this.mapTreatmentTypeToSection(
                    treatment.treatmentType
                  );
                  if (section) {
                    this.formLines[section].push({
                      id: treatment.id,
                      works:
                        treatment.partName ||
                        treatment.repairName ||
                        treatment.paintName ||
                        treatment.fittingChargeName ||
                        treatment.other ||
                        "",
                      quantity: treatment.quantity,
                      type: treatment.type,
                      priceType: treatment.sh,
                      sh: treatment.sh,
                      customPrice: treatment.customPrice,
                      price: treatment.price,
                      approvedPrice: treatment.approvedPrice,
                      approvedPriceState: treatment.approvedPriceState,
                      approvedDate: treatment.approvedDate
                        ? treatment.approvedDate.toDate()
                        : null,

                      estimateTreatmentReason:
                        treatment.estimateTreatmentReason,
                    });
                  }
                });
              }
            });
        }
      });
    }
    // // Initialization logic here
    // this.loadPreEstimates();
    // this.searchInputControl.valueChanges
    //   .pipe(
    //     takeUntil(this._unsubscribeAll),
    //     tap(() => {
    //       this.paginator.pageIndex = 0;
    //       this.loadPreEstimates();
    //     })
    //   )
    //   .subscribe();
  }

  estimatePassPrint(): void {
    const estimateId = this.esitamteID;
    this._router.navigate(["/estimate-print", estimateId], {
      queryParams: { estimateId: estimateId },
    });
  }

  loadAfterSave(id: number): void {
    if (id) {
      this._estimateService.find(Number(id)).subscribe((res) => {
        this.esitamte = res.body;
        if (this.esitamte) {
          this._estimateTreatmentService
            .query({
              "estimateId.equals": `${this.esitamte.id}`,
            })
            .subscribe((res) => {
              console.log("🚗 Vehicle Pre-Estimate Treatments:", res.body);
              this.vehiclePreEstimateTreatments = res.body || [];
              if (this.vehiclePreEstimateTreatments.length > 0) {
                this.vehiclePreEstimateTreatments.forEach((treatment) => {
                  const section = this.mapTreatmentTypeToSection(
                    treatment.treatmentType
                  );
                  if (section) {
                    this.formLines[section].push({
                      id: treatment.id,
                      works:
                        treatment.partName ||
                        treatment.repairName ||
                        treatment.paintName ||
                        treatment.fittingChargeName ||
                        treatment.other ||
                        "",
                      quantity: treatment.quantity,
                      type: treatment.type,
                      priceType: treatment.sh,
                      sh: treatment.sh,
                      customPrice: treatment.customPrice,
                      price: treatment.price,
                      approvedPrice: treatment.approvedPrice,
                      approvedPriceState: treatment.approvedPriceState,
                      approvedDate: treatment.approvedDate
                        ? treatment.approvedDate.toDate()
                        : null,

                      estimateTreatmentReason:
                        treatment.estimateTreatmentReason,
                    });
                  }
                });
              }
            });
        }
      });
    }
  }

  selectEsitamte(id: number): void {
    this.searchInputControl.setValue(String(id));
    if (this.searchInputControl.value) {
      this.loadPreEstimates();
      console.log("Im Second");
    }
  }

  loadPreEstimates(): void {
    const rawValue = this.searchInputControl.value;

    const search =
      typeof rawValue === "string" ? rawValue.trim() : String(rawValue);
    // const search = this.searchInputControl.value?.trim();

    this._preEstimateService
      .find(Number(search))
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap((res) => {
          this.totalItems = Number(res.headers.get("X-Total-Count"));
          const estimate = { ...res.body };
          // delete estimate.id;
          this.esitamte = estimate;

          if (this.esitamte) {
            this._vehicleModelService.query().subscribe((res) => {
              const modelID = res.body?.[0]?.id;
              this._vehicleTreatmentRegistryService
                .query({
                  "vehicleModelId.equals": `${modelID}`,
                })
                .subscribe((res) => {
                  console.log("🚗 Vehicle Treatment Registry:", res.headers);
                  const treatments = res.body || [];

                  this.partTreatments = treatments.filter(
                    (t) => t.treatmentType === "PART"
                  );

                  console.log("🚗 Part Treatments:", this.partTreatments);
                  this.paintTreatments = treatments.filter(
                    (t) => t.treatmentType === "PAINT"
                  );

                  console.log("🎨 Paint Treatments:", this.paintTreatments);
                  this.fittingChargeTreatments = treatments.filter(
                    (t) => t.treatmentType === "FITTING_CHARGE"
                  );
                  this.repairTreatments = treatments.filter(
                    (t) => t.treatmentType === "REPAIR"
                  );
                  this.otherTreatments = treatments;
                });
            });
          }

          if (this.esitamte) {
            this._preEstimateTreatmentService
              .query({
                "preEstimateId.equals": `${this.esitamte.id}`,
              })
              .subscribe((res) => {
                console.log(
                  "🚗 Vehicle Pre-Estimate Treatmentsssssssssssssssssss:",
                  res.body
                );
                this.vehiclePreEstimateTreatments = (res.body || []).map(
                  (t) => ({ ...t })
                );

                // ✅ Clear formLines before populating
                Object.keys(this.formLines).forEach((key) => {
                  this.formLines[key] = [];
                });

                // ✅ Push data to form lines
                this.vehiclePreEstimateTreatments.forEach((treatment) => {
                  const section = this.mapTreatmentTypeToSection(
                    treatment.treatmentType
                  );
                  if (section) {
                    this.formLines[section].push({
                      id: treatment.id,
                      works:
                        treatment.partName ||
                        treatment.repairName ||
                        treatment.paintName ||
                        treatment.fittingChargeName ||
                        treatment.other ||
                        "",
                      quantity: treatment.quantity,
                      type: treatment.type,
                      priceType: treatment.sh,
                      sh: treatment.sh,
                      customPrice: treatment.customPrice,
                      price: treatment.price || treatment.marketPrice,
                      approvedPrice: treatment.approvedPrice,
                      approvedPriceState: treatment.approvedPriceState,
                      approvedDate: treatment.approvedDate
                        ? treatment.approvedDate.toDate()
                        : null,
                      estimateTreatmentReason:
                        treatment.estimateTreatmentReason,
                    });
                  }
                });
              });
          }
        })
      )
      .subscribe();
  }

  mapTreatmentTypeToSection(treatmentType: string): string | null {
    switch (treatmentType.toUpperCase()) {
      case "PART":
        return "part";
      case "REPAIR":
        return "repair";
      case "PAINT":
        return "paint";
      case "FITTING_CHARGE":
        return "fitting_charge";
      case "OTHER":
        return "other";
      default:
        return null;
    }
  }

  filteredWorks: { [key: string]: IVehicleTreatmentRegistry[] } = {
    part: [],
    fitting_charge: [],
    repair: [],
    paint: [],
    other: [],
  };

  filterWorks(input: string, section: string): void {
    const allWorks = this.getWorkOptions(section);
    this.filteredWorks[section] = allWorks.filter((work) =>
      this.getWorkName(work, section)
        .toLowerCase()
        .includes(input.toLowerCase())
    );
  }

  getWorkOptions(section: string): IVehicleTreatmentRegistry[] {
    switch (section) {
      case "part":
        return this.partTreatments;
      case "fitting_charge":
        return this.fittingChargeTreatments;
      case "repair":
        return this.repairTreatments;
      case "paint":
        return this.paintTreatments;
      case "other":
        return this.otherTreatments;
      default:
        return [];
    }
  }

  getWorkName(work: IVehicleTreatmentRegistry, section: string): string {
    switch (section) {
      case "part":
        return work.partName || "";
      case "fitting_charge":
        return work.fittingChargeName || "";
      case "repair":
        return work.repairName || "";
      case "paint":
        return work.paintName || "";
      case "other":
        return (
          work.partName ||
          work.repairName ||
          work.paintName ||
          work.fittingChargeName ||
          ""
        );
      default:
        return "";
    }
  }

  syncFormLinesToTreatments(): void {
    const sectionToTypeMap = {
      part: "PART",
      fitting_charge: "FITTING_CHARGE",
      repair: "REPAIR",
      paint: "PAINT",
      other: "OTHER",
    };

    this.vehiclePreEstimateTreatments = [];

    Object.keys(this.formLines).forEach((section) => {
      this.formLines[section].forEach((line) => {
        const treatment = {
          ...line,
          treatmentType: sectionToTypeMap[section],
        };

        this.vehiclePreEstimateTreatments.push(treatment);
      });
    });
  }

  groupTreatmentsBySection(): void {
    const map = {
      PART: "part",
      FITTING_CHARGE: "fitting_charge",
      REPAIR: "repair",
      PAINT: "paint",
      OTHER: "other",
    };

    // Reset all
    Object.keys(this.formLines).forEach((key) => {
      this.formLines[key] = [];
    });

    this.vehiclePreEstimateTreatments.forEach((treatment) => {
      const key = map[treatment.treatmentType?.toUpperCase()] || "other";
      this.formLines[key].push(treatment);
    });
  }

  sectionLabels = {
    part: "Part",
    fitting_charge: "Fitting Charge",
    repair: "Repair",
    paint: "Paint",
    other: "Other",
  };

  formLines: { [key: string]: any[] } = {
    part: [],
    fitting_charge: [],
    repair: [],
    paint: [],
    other: [],
  };

  async createEstimate(): Promise<void> {
    const nextEstimateID = await this.getNextEstimateID();
    this.estimateNumber = nextEstimateID;
    // alert(nextEstimateID);
    const estimate: NewEstimate = {
      id: null,
      serviceAdvisor: this.user.name,
      serviceAdvisorID: this.user.id,
      vehicleID: this.esitamte.vehicleID,
      licenseNo: this.esitamte.licenseNo,
      vehicleBrand: this.esitamte.vehicleBrand,
      vehicleModel: this.esitamte.vehicleModel,
      vehicleOwnerID: this.esitamte.vehicleOwnerID,
      vehicleOwnerName: this.esitamte.vehicleOwnerName,
      vehicleOwnerContactNumber1: this.esitamte.vehicleOwnerContactNumber1,
      vehicleOwnerContactNumber2: this.esitamte.vehicleOwnerContactNumber2,
      opsUnitID: this.esitamte.opsUnitID,
      totalPrice: this.esitamte.totalPrice,
      estimateID: nextEstimateID,
      numberOfPanels: this.esitamte.numberOfPanels,
      createdBy: this.esitamte.createdBy,
      createdDate: this.esitamte.createdDate,
      lastModifiedBy: this.esitamte.lastModifiedBy,
      lastModifiedDate: this.esitamte.lastModifiedDate,
      insuranceID: this.esitamte.insuranceID,
      insuranceName: this.esitamte.insuranceName,
      isInsurance: this.esitamte.isInsurance,
      preEstimateType: this.esitamte.preEstimateType,
    };
    console.log("🚗 Estimate:", estimate);

    this._estimateService.create(estimate).subscribe((res) => {
      if (res.body) {
        console.log("🛠️ Estimate created:", res.body);
        this.createEstimateTreatments(res.body.id);
      }
    });

    // console.log("🚗 Estimate to be created:", estimate);
  }

  createEstimateTreatments(estimateID: number): void {
    if (
      !this.vehiclePreEstimateTreatments ||
      this.vehiclePreEstimateTreatments.length === 0
    ) {
      return;
    }

    let postedCount = 0;
    const total = this.vehiclePreEstimateTreatments.length;

    this.vehiclePreEstimateTreatments.forEach((treatment) => {
      const estimateTreatment: NewEstimateTreatment = {
        id: null,
        vehicleTreatmentID: treatment.vehicleTreatmentID,
        fittingChargeName: treatment.fittingChargeName,
        paintName: treatment.paintName,
        partName: treatment.partName,
        sh: treatment.sh,
        other: treatment.other,
        repairName: treatment.repairName,
        priceType: treatment.priceType,
        type: treatment.type,
        partNumber: treatment.partNumber,
        availableQuantity: treatment.availableQuantity,
        unitPrice: treatment.unitPrice,
        treatmentType: treatment.treatmentType,
        quantity: treatment.quantity,
        isSystemPrice: treatment.isSystemPrice,
        isPriceConfirmed: treatment.isPriceConfirmed,
        approvedDate: treatment.approvedDate
          ? dayjs(treatment.approvedDate)
          : undefined,
        price: treatment.price || treatment.marketPrice,
        customPrice: treatment.customPrice,
        approvedPrice: treatment.approvedPrice,
        approvedPriceState: treatment.approvedPriceState,
        estimateTreatmentReason: treatment.estimateTreatmentReason,
        opsUnitID: treatment.opsUnitID,
        createdBy: treatment.createdBy,
        createdDate: treatment.createdDate,
        lastModifiedBy: treatment.lastModifiedBy,
        lastModifiedDate: treatment.lastModifiedDate,
        estimate: { id: estimateID },
      };

      this._estimateTreatmentService
        .create(estimateTreatment)
        .subscribe((res) => {
          console.log("✅ Estimate Treatment Created:", res.body);

          postedCount++;

          if (postedCount === total) {
            // ✅ Only called once after all are done
            this.esitamteID = estimateID.toString();
            this.formLines = {
              part: [],
              fitting_charge: [],
              repair: [],
              paint: [],
              other: [],
            };
            this.loadAfterSave(Number(estimateID));

            const successDialog = this._fuseConfirmationService.open({
              title: "Estimate Created!",
              message:
                "The estimate was created successfully. Do you want to go to the Job Card now?",
              icon: { name: "heroicons_outline:check-circle", color: "accent" },
              dismissible: true,
              actions: {
                confirm: { label: "Yes, Go to Job Card", color: "primary" },
                cancel: { label: "No, Stay Here" },
              },
            });

            successDialog.afterClosed().subscribe((choice) => {
              if (choice === "confirmed") {
                this._router.navigate(["/job-cards-create"]);
              }
            });
          }
        });
    });
  }

  onLineInputChange(
    field: string,
    value: any,
    line: any,
    section: string
  ): void {
    line[field] = value;

    if (!line.id) {
      console.warn("❌ Line has no ID!", line);
      return;
    }

    const index = this.vehiclePreEstimateTreatments.findIndex(
      (t) => t.id === line.id
    );

    if (index !== -1) {
      this.vehiclePreEstimateTreatments[index][field] = value;

      if (field === "works") {
        switch (section) {
          case "part":
            this.vehiclePreEstimateTreatments[index].partName = value;
            break;
          case "repair":
            this.vehiclePreEstimateTreatments[index].repairName = value;
            break;
          case "paint":
            this.vehiclePreEstimateTreatments[index].paintName = value;
            break;
          case "fitting_charge":
            this.vehiclePreEstimateTreatments[index].fittingChargeName = value;
            break;
          case "other":
            this.vehiclePreEstimateTreatments[index].other = value;
            break;
        }
      }

      console.log(`✅ Updated ${field} in treatment index ${index}`);
    } else {
      console.warn(
        `❌ Could not find matching treatment for line ID ${line.id}`,
        line
      );
    }
  }

  updateEstimate(): void {
    const estimate: IEstimate = {
      id: this.esitamte.id,
      vehicleID: this.esitamte.vehicleID,
      serviceAdvisor: this.esitamte.serviceAdvisor,
      serviceAdvisorID: this.esitamte.serviceAdvisorID,
      licenseNo: this.esitamte.licenseNo,
      vehicleBrand: this.esitamte.vehicleBrand,
      vehicleModel: this.esitamte.vehicleModel,
      vehicleOwnerID: this.esitamte.vehicleOwnerID,
      vehicleOwnerName: this.esitamte.vehicleOwnerName,
      vehicleOwnerContactNumber1: this.esitamte.vehicleOwnerContactNumber1,
      vehicleOwnerContactNumber2: this.esitamte.vehicleOwnerContactNumber2,
      opsUnitID: this.esitamte.opsUnitID,
      totalPrice: this.esitamte.totalPrice,
      estimateID: this.esitamte.estimateID,
      numberOfPanels: this.esitamte.numberOfPanels,
      createdBy: this.esitamte.createdBy,
      createdDate: this.esitamte.createdDate,
      lastModifiedBy: this.esitamte.lastModifiedBy,
      lastModifiedDate: this.esitamte.lastModifiedDate,
      insuranceID: this.esitamte.insuranceID,
      insuranceName: this.esitamte.insuranceName,
      isInsurance: this.esitamte.isInsurance,
      preEstimateType: this.esitamte.preEstimateType,
    };
    console.log("🚗 Estimate:", estimate);

    this._estimateService.update(estimate).subscribe((res) => {
      console.log("🛠️ Estimate updated:", res.body);
      if (res.body) {
        this.updateEstimateTreatments(res.body.id);
      }
    });

    // console.log("🚗 Estimate to be created:", estimate);
  }

  updateEstimateTreatments(estimateID: number): void {
    if (
      !this.vehiclePreEstimateTreatments ||
      this.vehiclePreEstimateTreatments.length === 0
    ) {
      return;
    }

    this.vehiclePreEstimateTreatments.forEach((treatment) => {
      const estimateTreatment: IEstimateTreatment = {
        id: treatment.id,
        vehicleTreatmentID: treatment.vehicleTreatmentID,
        fittingChargeName: treatment.fittingChargeName,
        paintName: treatment.paintName,
        partName: treatment.partName,
        other: treatment.other,
        sh: treatment.sh,
        repairName: treatment.repairName,
        priceType: treatment.priceType,
        type: treatment.type,
        partNumber: treatment.partNumber,
        availableQuantity: treatment.availableQuantity,
        unitPrice: treatment.unitPrice,
        treatmentType: treatment.treatmentType,
        quantity: treatment.quantity,
        isSystemPrice: treatment.isSystemPrice,
        isPriceConfirmed: treatment.isPriceConfirmed,
        approvedDate: treatment.approvedDate
          ? dayjs(treatment.approvedDate)
          : undefined,
        price: treatment.price,
        customPrice: treatment.customPrice,
        approvedPrice: treatment.approvedPrice,
        approvedPriceState: treatment.approvedPriceState,
        estimateTreatmentReason: treatment.estimateTreatmentReason,
        opsUnitID: treatment.opsUnitID,
        createdBy: treatment.createdBy,
        createdDate: treatment.createdDate,
        lastModifiedBy: treatment.lastModifiedBy,
        lastModifiedDate: treatment.lastModifiedDate,
        estimate: {
          id: estimateID,
        },
      };

      this._estimateTreatmentService
        .update(estimateTreatment)
        .subscribe((res) => {
          console.log("🛠️ Estimate Treatment Updated:", res.body);
          this._snackBarService.open(
            "Estimate Updated Successfully!",
            "Close",
            {
              duration: 3000,
            }
          );
        });
    });
  }

  getNextEstimateID(): Promise<string> {
    const params = {
      page: 0,
      size: 1,
      sort: "estimateID,desc",
    };

    return new Promise((resolve) => {
      this._estimateService.query(params).subscribe((res) => {
        const latest = res.body?.[0];
        let nextID = "EST-000001";

        if (latest?.estimateID) {
          const lastNumber = parseInt(
            latest.estimateID.replace("EST-", ""),
            10
          );
          const newNumber = lastNumber + 1;
          nextID = "EST-" + newNumber.toString().padStart(6, "0");
        }

        resolve(nextID);
      });
    });
  }

  onEstimatePriceInput(event: Event, line: any, section: string): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/,/g, "");
    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue)) {
      line.price = numericValue;
      this.onLineInputChange("price", numericValue, line, section);
    }
  }

  onApprovedPriceInput(event: Event, line: any, section: string): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/,/g, "");
    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue)) {
      line.approvedPrice = numericValue;
      this.onLineInputChange("approvedPrice", numericValue, line, section);
    }
  }
}
