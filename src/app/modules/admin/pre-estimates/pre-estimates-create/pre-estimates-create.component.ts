import { Component, inject, OnInit } from "@angular/core";
import { FuseVerticalNavigationComponent } from "../../../../../@fuse/components/navigation/vertical/vertical.component";
import { CommonModule } from "@angular/common";
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { TreatmentType } from "app/entities/enumerations/treatment-type.model";
import {
  IPreEstimateTreatment,
  NewPreEstimateTreatment,
} from "app/entities/operationsModuleCooperation/pre-estimate-treatment/pre-estimate-treatment.model";
import { PreEstimateTreatmentService } from "app/entities/operationsModuleCooperation/pre-estimate-treatment/service/pre-estimate-treatment.service";
import { PreEstimateService } from "app/entities/operationsModuleCooperation/pre-estimate/service/pre-estimate.service";
import { IVehicleRegistry } from "app/entities/operationsModuleCooperation/vehicle-registry/vehicle-registry.model";
import { IClientRegistry } from "app/entities/operationsModuleCooperation/client-registry/client-registry.model";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";

import {
  IPreEstimate,
  NewPreEstimate,
} from "app/entities/operationsModuleCooperation/pre-estimate/pre-estimate.model";
import { PreEstimateFormService } from "app/entities/operationsModuleCooperation/pre-estimate/update/pre-estimate-form.service";
import { MatButtonModule } from "@angular/material/button";
import { FuseNavigationService } from "@fuse/components/navigation";
import { VehicleTreatmentRegistryService } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/service/vehicle-treatment-registry.service";
import { IVehicleTreatmentRegistry } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/vehicle-treatment-registry.model";
import { Router, ActivatedRoute } from "@angular/router";
import { environment } from "environments/environment";
import { IBrand } from "app/entities/operationsModuleCooperation/brand/brand.model";
import { forkJoin, map, Observable, startWith } from "rxjs";
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { FuseCardComponent } from "@fuse/components/card";
import { MatSnackBar } from "@angular/material/snack-bar";
import { set, size } from "lodash";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatSelectModule } from "@angular/material/select";
import { FuseAlertComponent, FuseAlertService } from "@fuse/components/alert";

@Component({
  selector: "app-pre-estimates-create",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FuseVerticalNavigationComponent,
    CommonModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    FuseCardComponent,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
    FuseAlertComponent,
  ],
  standalone: true,
  templateUrl: "./pre-estimates-create.component.html",
  styleUrl: "./pre-estimates-create.component.scss",
})
export class PreEstimatesCreateComponent implements OnInit {
  preEstimateDetails: boolean = true;
  preEstimateID: number = 0;
  preEstimateType: string = "PRE-ESTIMATE";

  // numberOfPanels: FormControl = new FormControl("");
  isInsurance: boolean = true;
  preEstimateNumber: string = "";
  numberOfPanels: number;
  insuranceProviderID: string;
  insuranceProvider: string;

  isUpdating: boolean = false;

  insuranceOptions: string[] = [
    "HNB",
    "LOLC",
    "CONTINENTAL",
    "CO OPERATIVE",
    "AMANA",
    "SRI LANKA",
    "MBSL",
    "CEYLINCO",
    "SANASA",
    "PEOPLE S",
    "AGRAHARA",
    "FAIR FIRST",
    "ORIENTAL",
    "ALLIANZ",
  ];

  private _router = inject(Router);

  filteredInsuranceOptions: string[] = [...this.insuranceOptions];

  selectedMenu: string = "part";
  selectedVehicleModelID = 0;

  partTreatments: IVehicleTreatmentRegistry[] = [];
  paintTreatments: IVehicleTreatmentRegistry[] = [];
  fittingChargeTreatments: IVehicleTreatmentRegistry[] = [];
  repairTreatments: IVehicleTreatmentRegistry[] = [];
  otherTreatments: IVehicleTreatmentRegistry[] = [];

  formService = inject(PreEstimateFormService);
  _fuseNavigationService = inject(FuseNavigationService);
  editForm = this.formService.createPreEstimateFormGroup();

  selectedVehicleandClientDetails: {
    vehicle: IVehicleRegistry;
    client: IClientRegistry;
  } | null = null;

  vehiclePreEstimateTreatments: IPreEstimateTreatment[] = [];

  private _fuseAlertService = inject(FuseAlertService);

  constructor(
    private _preEstimateTreatmentService: PreEstimateTreatmentService,
    private _preEstimateService: PreEstimateService,
    private _selectedCardService: SelectedCardService,
    private _vehicleTreatmentRegistryService: VehicleTreatmentRegistryService,
    private _route: ActivatedRoute,
    private _snackBarService: MatSnackBar
  ) {
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
        "mainNavigation"
      );
    navigation.close();
  }

  menuData = [
    {
      id: "pre-estimates",
      title: "Pre Estimates",
      type: "group",
      children: [
        {
          id: "part",
          title: "Part",
          type: "basic",
          icon: "heroicons_outline:inbox",
          function: () => this.selectMenu("part"),
        },
        {
          id: "fitting_charge",
          title: "Fitting Charge",
          type: "basic",
          icon: "heroicons_outline:bolt",
          function: () => this.selectMenu("fitting_charge"),
        },
        {
          id: "repair",
          title: "Repair",
          type: "basic",
          icon: "heroicons_outline:wrench-screwdriver",
          function: () => this.selectMenu("repair"),
        },
        {
          id: "paint",
          title: "Paint",
          type: "basic",
          icon: "heroicons_outline:paint-brush",
          function: () => this.selectMenu("paint"),
        },
        {
          id: "other",
          title: "Other",
          type: "basic",
          icon: "heroicons_outline:ellipsis-horizontal-circle",
          function: () => this.selectMenu("other"),
        },
      ],
    },
  ];

  formLines: { [key: string]: any[] } = {
    part: [],
    fitting_charge: [],
    repair: [],
    paint: [],
    other: [],
  };

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
      this.selectedVehicleModelID = Number(selected?.vehicle?.modelID) || 0;
    });
    // Initialize each with one line optionally
    // Object.keys(this.formLines).forEach((key) => {
    //   this.formLines[key].push(this.createEmptyLine());
    // });
    console.log("🚗 Vehicle Model ID:", this.selectedVehicleModelID);

    if (this.selectedVehicleModelID) {
      console.log("🚗 Vehicle Model ID:", this.selectedVehicleModelID);
      const params = {
        // "vehicleModelId.equals": `${this.selectedVehicleModelID}`,
        page : 0,
        size: 1000,
      };

      this._vehicleTreatmentRegistryService.query(params).subscribe((res) => {
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
    } else {
      const params = {
        size: 1000,
      };
      this._vehicleTreatmentRegistryService.query(params).subscribe((res) => {
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
    }

    const id = this._route.snapshot.paramMap.get("id");

    if (id) {
      this.isUpdating = true;
      this.preEstimateID = Number(id);
      this._preEstimateService.find(Number(id)).subscribe((res) => {
        if (res.body) {
          this.isInsurance = res.body.isInsurance;
          this.preEstimateNumber = res.body.preEstimateNumber;
          this.insuranceProviderID = res.body.insuranceID;
          this.insuranceProvider = res.body.insuranceName;
          this.numberOfPanels = res.body.numberOfPanels;
          this.preEstimateType = res.body.preEstimateType;
        }
      });
      this._preEstimateTreatmentService
        .query({
          "preEstimateId.equals": `${id}`,
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
                  marketPrice: treatment.marketPrice,
                  sh: treatment.sh,
                  priceType: treatment.priceType,
                  customPrice: treatment.customPrice,
                  price: treatment.price,
                });
              }
            });
          }
        });
    }

    // this.loadAfterCreate(this.preEstimateID);
    console.log("Received ID:", id);
  }

  loadAfterCreate(id: number): void {
    if (id) {
      this.isUpdating = true;
      this.preEstimateID = Number(id);
      this._preEstimateService.find(Number(id)).subscribe((res) => {
        if (res.body) {
          this.isInsurance = res.body.isInsurance;
          this.preEstimateNumber = res.body.preEstimateNumber;
          this.insuranceProviderID = res.body.insuranceID;
          this.insuranceProvider = res.body.insuranceName;
          this.numberOfPanels = res.body.numberOfPanels;
          this.preEstimateType = res.body.preEstimateType;
        }
      });
      this._preEstimateTreatmentService
        .query({
          "preEstimateId.equals": `${id}`,
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
                  marketPrice: treatment.marketPrice,
                  sh: treatment.sh,
                  priceType: treatment.priceType,
                  customPrice: treatment.customPrice,
                  price: treatment.price,
                });
              }
            });
          }
        });
    }
  }

  filteredWorks: { [key: string]: IVehicleTreatmentRegistry[] } = {
    part: [],
    fitting_charge: [],
    repair: [],
    paint: [],
    other: [],
  };

  getWorkName(work: IVehicleTreatmentRegistry): string {
    return (
      work.partName ||
      work.repairName ||
      work.paintName ||
      work.fittingChargeName
    );
  }

  filterWorks(search: string, section: string): void {
    const allList = this.getTreatmentList(section);

    if (!search) {
      // If no input, show the first 2 items as default
      this.filteredWorks[section] = allList.slice(0, 2);
      return;
    }

    const lower = search.toLowerCase();
    this.filteredWorks[section] = allList.filter((t) =>
      this.getWorkName(t).toLowerCase().includes(lower)
    );
  }

  getTreatmentList(section: string): IVehicleTreatmentRegistry[] {
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

  onWorkSelected(workName: string, line: any, section: string): void {
    const treatment = this.getTreatmentList(section).find(
      (t) => this.getWorkName(t) === workName
    );

    if (treatment) {
      this.onLineInputChange(
        "works",
        this.getWorkName(treatment),
        line,
        section
      );
      // this.onLineInputChange(
      //   "quantity",
      //   treatment.availableQuantity,
      //   line,
      //   section
      // );

      // this.onLineInputChange(
      //   "quantity",
      //   treatment.availableQuantity,
      //   line,
      //   section
      // );

      // this.onLineInputChange("price", treatment.price, line, section);
      // this.onLineInputChange("priceType", "estimate", line, section);
    }
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

  filterInsuranceOptions(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredInsuranceOptions = this.insuranceOptions.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  getWorkOptions(section: string): string[] {
    switch (section) {
      case "part":
        return this.partTreatments.map((t) => t.partName);
      case "fitting_charge":
        return this.fittingChargeTreatments.map((t) => t.fittingChargeName);
      case "repair":
        return this.repairTreatments.map((t) => t.repairName);
      case "paint":
        return this.paintTreatments.map((t) => t.paintName);
      case "other":
        return this.otherTreatments.map((t) => t.partName);
      default:
        return [];
    }
  }

  selectMenu(menu: string): void {
    this.selectedMenu = menu;
  }

  addLine(section: string): void {
    this.formLines[section].push(this.createEmptyLine());
  }

  removeLine(section: string, line: any): void {
    const index = this.formLines[section].indexOf(line);
    if (index > -1) {
      this.formLines[section].splice(index, 1);
    }
  }

  createEmptyLine(): any {
    return {
      works: "",
      sh: "",
      marketPrice: "",
      quantity: null,
      type: "",
      priceType: "",
      customPrice: null,
      price: null,
    };
  }

  onLineInputChange(
    field: string,
    value: any,
    line: any,
    section: string
  ): void {
    const index = this.formLines[section].indexOf(line);
    if (index > -1) {
      // Create a new object reference to trigger change detection
      this.formLines[section][index] = {
        ...line,
        [field]: value,
      };
    }

    let updatedLine = {
      ...line,
      [field]: value,
    };

    // If field is 'priceType' and value is 'SYSTEM', set customPrice to 'AP'
    if (field === "priceType" && value === "SYSTEM") {
      updatedLine.customPrice = "AP";
    }

    this.formLines[section][index] = updatedLine;

    console.log(`✅ ${field} changed to:`, value);
    console.log("🧾 Full updated line:", this.formLines[section][index]);
  }

  logLine(line: any, section: string): void {
    console.log(
      `🔍 Logging line in section [${section}]`,
      JSON.stringify(line)
    );
  }

  trackByIndex(index: number): number {
    return index;
  }

  async createPreEstimate(): Promise<void> {
    const vehicleID = this.selectedVehicleandClientDetails?.vehicle?.licenseNo;

    if (!vehicleID || vehicleID.trim() === "") {
      this.show("alertBox4"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox4"), 4000);
      return;
    }

    this.dismiss("alertBox4");
    const nextPreEstimateID = await this.getNextPreEstimateID();
    this.preEstimateNumber = nextPreEstimateID;
    // alert(nextPreEstimateID);
    const NewPreEstimate: NewPreEstimate = {
      id: null,
      preEstimateNumber: nextPreEstimateID,
      vehicleID:
        this.selectedVehicleandClientDetails?.vehicle.id?.toString() ?? null,
      licenseNo:
        this.selectedVehicleandClientDetails?.vehicle.licenseNo ?? null,
      vehicleBrand: this.selectedVehicleandClientDetails?.vehicle.brand ?? null,
      vehicleModel: this.selectedVehicleandClientDetails?.vehicle.model ?? null,
      vehicleOwnerID:
        this.selectedVehicleandClientDetails?.client.id?.toString() ?? null,
      vehicleOwnerName:
        this.selectedVehicleandClientDetails?.client.name ?? null,
      vehicleOwnerContactNumber1:
        this.selectedVehicleandClientDetails?.client.contactNumber1 ?? null,
      vehicleOwnerContactNumber2:
        this.selectedVehicleandClientDetails?.client.contactNumber2 ?? null,
      isInsurance: this.isInsurance,
      insuranceID: this.insuranceProviderID,
      insuranceName: this.insuranceProvider,
      opsUnitID: null,
      preEstimateType: this.preEstimateType,
      totalPrice: 0,
      isActive: true,
      numberOfPanels: this.numberOfPanels,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
    };

    // now use this object as needed (e.g., send to service)
    console.log("NewPreEstimate:", NewPreEstimate);

    this._preEstimateService.create(NewPreEstimate).subscribe(
      (res) => {
        console.log("Pre-estimate Created Successfully:", res);
        this.preEstimateID = res.body.id;
        this.createPreEstimateTreatments(res.body?.id);
      },
      (error) => {
        console.error("Error Creating Pre Estimate:", error);
      }
    );
  }

  // Validate the form lines before creating estimates

  createPreEstimateTreatments(prestimateID: number): void {
    const treatments: NewPreEstimateTreatment[] = [];

    Object.keys(this.formLines).forEach((section) => {
      this.formLines[section].forEach((line) => {
        const treatment: NewPreEstimateTreatment = {
          id: null,
          fittingChargeName: section === "fitting_charge" ? line.works : null,
          paintName: section === "paint" ? line.works : null,
          partName: section === "part" ? line.works : null,
          repairName: section === "repair" ? line.works : null,
          other: section === "other" ? line.works : null,
          marketPrice: line.marketPrice,
          quantity: null,
          type: null,
          priceType: null,
          customPrice: null,
          price: line.price,
          sh: line.sh ? line.sh : null,
          treatmentType: section.toUpperCase() as keyof typeof TreatmentType,
          isSystemPrice: true,
          unitPrice: null,
          partNumber: null,
          vehicleTreatmentID: null,
          opsUnitID: null,
          createdBy: null,
          createdDate: null,
          lastModifiedBy: null,
          lastModifiedDate: null,
          preEstimate: { id: prestimateID } as IPreEstimate,
        };

        treatments.push(treatment);
      });
    });

    const createRequests = treatments.map((t) =>
      this._preEstimateTreatmentService.create(t)
    );

    forkJoin(createRequests).subscribe({
      next: (results) => {
        console.log("✅ All treatments created:", results);
        this._snackBarService.open(
          "Pre Estimate Created Successfully!",
          "Close",
          { duration: 3000 }
        );

        this.preEstimateID = prestimateID;
        this.formLines = {
          part: [],
          fitting_charge: [],
          repair: [],
          paint: [],
          other: [],
        };

        // ✅ Navigate or reload view
        this.loadAfterCreate(this.preEstimateID);

        // Optional: navigate
        // this._router.navigate(["/pre-estimates-view/", this.preEstimateID], {
        //   state: { showSuccess: true },
        // });
      },
      error: (err) => {
        console.error("❌ Error creating one or more treatments:", err);
      },
    });
  }

  getSectionTotal(section: string): number {
    return (
      this.formLines[section]?.reduce((sum, line) => {
        const value = line.price ?? line.marketPrice; // use price, or fallback to marketPrice
        return sum + (value ? Number(value) : 0);
      }, 0) || 0
    );
  }

  toggleEstimateAndTreatments(): void {
    this.preEstimateDetails = !this.preEstimateDetails;
  }

  updatePreEstimate(): void {
    const vehicleID = this.selectedVehicleandClientDetails?.vehicle?.licenseNo;

    if (!vehicleID || vehicleID.trim() === "") {
      this.show("alertBox4"); // Vehicle not selected
      setTimeout(() => this.dismiss("alertBox4"), 4000);
      return;
    }

    this.dismiss("alertBox4");
    const NewPreEstimate: IPreEstimate = {
      id: this.preEstimateID,
      preEstimateNumber: this.preEstimateNumber,
      vehicleID:
        this.selectedVehicleandClientDetails?.vehicle.id?.toString() ?? null,
      licenseNo:
        this.selectedVehicleandClientDetails?.vehicle.licenseNo ?? null,
      vehicleBrand: this.selectedVehicleandClientDetails?.vehicle.brand ?? null,
      vehicleModel: this.selectedVehicleandClientDetails?.vehicle.model ?? null,
      vehicleOwnerID:
        this.selectedVehicleandClientDetails?.client.id?.toString() ?? null,
      vehicleOwnerName:
        this.selectedVehicleandClientDetails?.client.name ?? null,
      vehicleOwnerContactNumber1:
        this.selectedVehicleandClientDetails?.client.contactNumber1 ?? null,
      vehicleOwnerContactNumber2:
        this.selectedVehicleandClientDetails?.client.contactNumber2 ?? null,
      isInsurance: this.isInsurance,
      insuranceID: this.insuranceProviderID,
      insuranceName: this.insuranceProvider,
      opsUnitID: null,
      totalPrice: 0,
      isActive: true,
      numberOfPanels: this.numberOfPanels,
      createdBy: null,
      createdDate: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      preEstimateType: this.preEstimateType,
    };

    // now use this object as needed (e.g., send to service)
    console.log("NewPreEstimate:", NewPreEstimate);

    this._preEstimateService.update(NewPreEstimate).subscribe(
      (res) => {
        console.log("Pre Estimate Created Successfully:", res);
        this.updatePreEstimateTreatments(res.body?.id);
      },
      (error) => {
        console.error("Error Creating Pre Estimate:", error);
      }
    );
  }

  updatePreEstimateTreatments(prestimateID: number): void {
    const treatments: IPreEstimateTreatment[] = [];

    Object.keys(this.formLines).forEach((section) => {
      this.formLines[section].forEach((line) => {
        const treatment: IPreEstimateTreatment = {
          id: line.id,
          fittingChargeName: section === "fitting_charge" ? line.works : null,
          paintName: section === "paint" ? line.works : null,
          partName: section === "part" ? line.works : null,
          repairName: section === "repair" ? line.works : null,
          other: section === "other" ? line.works : null,

          marketPrice: line.marketPrice,
          quantity: null,
          type: null,
          priceType: null,
          customPrice: null,
          price: line.price,
          sh: line.sh ? line.sh : null,

          treatmentType: section.toUpperCase() as keyof typeof TreatmentType,
          isSystemPrice: true,
          unitPrice: null,
          partNumber: null,
          vehicleTreatmentID: null,
          opsUnitID: null,
          createdBy: null,
          createdDate: null,
          lastModifiedBy: null,
          lastModifiedDate: null,

          preEstimate: {
            id: prestimateID,
          } as IPreEstimate,
        };
        treatments.push(treatment);
      });
    });

    // Post the data to the backend
    treatments.forEach((treatment) => {
      const isNew = !treatment.id; // If there's no ID, treat it as a new line

      if (isNew) {
        const newTreatment: NewPreEstimateTreatment = {
          ...treatment,
          id: null,
        };
        this._preEstimateTreatmentService.create(newTreatment).subscribe({
          next: (response) => {
            console.log("New Pre Estimate Line Created:", response);
            this._snackBarService.open(
              "New Line Added Successfully!",
              "Close",
              {
                duration: 3000,
              }
            );
          },
          error: (error) => {
            console.error("Error Adding New Line:", error);
          },
        });
      } else {
        this._preEstimateTreatmentService.update(treatment).subscribe({
          next: (response) => {
            console.log("Pre Estimate Line Updated:", response);
            this._snackBarService.open("Line Updated Successfully!", "Close", {
              duration: 3000,
            });
          },
          error: (error) => {
            console.error("Error Updating Line:", error);
          },
        });
      }
    });
  }

  printEstimate(): void {
    const printContent = document.getElementById("print-section");
    const originalContent = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      // window.location.reload(); // optional: reload to restore events/state
    }
  }

  print(): void {
    // const pre = this.invoiceID;
    const presEstimateID = this.preEstimateID;
    this._router.navigate(["/pre-estimates-print/", presEstimateID]);
  }

  createEstimate(): void {
    const presEstimateID = this.preEstimateID;

    this._router.navigate(["/create-estimates"], {
      state: { presEstimateID },
    });
  }

  getNextPreEstimateID(): Promise<string> {
    const params = {
      page: 0,
      size: 1,
      sort: "id,desc", // safer fallback than string sort
    };

    return new Promise((resolve) => {
      this._preEstimateService.query(params).subscribe((res) => {
        const latest = res.body?.[0];
        let nextID = "PRE-EST-000001";

        if (latest?.preEstimateNumber) {
          const lastNumber = parseInt(
            latest.preEstimateNumber.replace("PRE-EST-", ""),
            10
          );
          const newNumber = lastNumber + 1;
          nextID = "PRE-EST-" + newNumber.toString().padStart(6, "0");
        }

        resolve(nextID);
      });
    });
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  onMarketPriceInput(event: Event, line: any, section: string): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/,/g, "");
    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue)) {
      line.marketPrice = numericValue;
      this.onLineInputChange("marketPrice", numericValue, line, section);
    } else {
      line.marketPrice = 0;
    }
  }

  onEstimatePriceInput(event: Event, line: any, section: string): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value.replace(/,/g, "");
    const numericValue = parseFloat(raw);
    if (!isNaN(numericValue)) {
      line.price = numericValue;
      this.onLineInputChange("price", numericValue, line, section);
    } else {
      line.price = 0;
    }
  }
}
