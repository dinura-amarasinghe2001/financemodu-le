import { Component, inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from "@fuse/components/navigation";
import { PreEstimateTreatmentService } from "app/entities/operationsModuleCooperation/pre-estimate-treatment/service/pre-estimate-treatment.service";
import { PreEstimateService } from "app/entities/operationsModuleCooperation/pre-estimate/service/pre-estimate.service";
import { VehicleTreatmentRegistryService } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/service/vehicle-treatment-registry.service";
import { SelectedCardService } from "../../dashboard/services/selected-card.service";
import { IPreEstimateTreatment } from "app/entities/operationsModuleCooperation/pre-estimate-treatment/pre-estimate-treatment.model";
import { CommonModule } from "@angular/common";
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { IPreEstimate } from "app/entities/operationsModuleCooperation/pre-estimate/pre-estimate.model";

@Component({
  selector: "app-pre-estimate-print",
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./pre-estimate-print.component.html",
  styleUrl: "./pre-estimate-print.component.scss",
})
export class PreEstimatePrintComponent implements OnInit {
  _fuseNavigationService = inject(FuseNavigationService);

  preEstimateID: number = 0;

  isInsurance: boolean = false;
  numberOfPanels: number;
  insuranceProviderID: string;
  vehicleNo: string;
  insuranceProvider: string;

  preEstimate: IPreEstimate;

  vehiclePreEstimateTreatments: IPreEstimateTreatment[] = [];
  private router = inject(Router);

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
rowCounter = 1;
getAndIncrementRow(): number {
  return this.rowCounter++;
}

  ngOnInit(): void {
    // Initialization logic here
    const id = this._route.snapshot.paramMap.get("id");
    this.preEstimateID = Number(id);

    if (id) {
      this._preEstimateService.find(Number(id)).subscribe((res) => {
        if (res.body) {
          this.preEstimate = res.body;
          this.isInsurance = res.body.isInsurance;
          this.insuranceProviderID = res.body.insuranceID;
          this.insuranceProvider = res.body.insuranceName;
          this.numberOfPanels = res.body.numberOfPanels;
          this.vehicleNo = res.body.licenseNo;
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

  formLines: { [key: string]: any[] } = {
    part: [],
    fitting_charge: [],
    repair: [],
    paint: [],
    other: [],
  };

  print(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(["/pre-estimates-view/", this.preEstimateID]);

    // window.history.back();
  }
}
