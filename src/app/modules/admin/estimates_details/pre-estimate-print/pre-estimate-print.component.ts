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
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import { IEstimate } from "app/entities/operationsModuleCooperation/estimate/estimate.model";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { IEstimateTreatment } from "app/entities/operationsModuleCooperation/estimate-treatment/estimate-treatment.model";

@Component({
  selector: "app-pre-estimate-print",
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: "./pre-estimate-print.component.html",
  styleUrl: "./pre-estimate-print.component.scss",
})
export class PreEstimatePrintComponent implements OnInit {
  _fuseNavigationService = inject(FuseNavigationService);

  estimateID: number = 0;

  isInsurance: boolean = false;
  numberOfPanels: number;
  insuranceProviderID: string;
  vehicleNo: string;
  insuranceProvider: string;

  estimate: IEstimate;

  estimateTreatments: IEstimateTreatment[] = [];
  private router = inject(Router);

  constructor(
    private _estimateTreatmentService: EstimateTreatmentService,
    private _preEstimateService: PreEstimateService,
    private _estimateService: EstimateService,
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
globalRowCounter = 1;
 

getNextRowNumber(): number {
  return this.globalRowCounter++;
}

  ngOnInit(): void {
    this.globalRowCounter = 1;
    // Initialization logic here
    const id = this._route.snapshot.paramMap.get("id");
    this.estimateID = Number(id);

    if (id) {
      this._estimateService.find(Number(id)).subscribe((res) => {
        if (res.body) {
          this.estimate = res.body;
          this.insuranceProviderID = res.body.insuranceID;
          this.insuranceProvider = res.body.insuranceName;
          this.numberOfPanels = res.body.numberOfPanels;
          this.vehicleNo = res.body.licenseNo;
        }
      });
      this._estimateTreatmentService
        .query({
          "estimateId.equals": `${id}`,
        })
        .subscribe((res) => {
          console.log("Estimate Treatments:", res.body);
          this.estimateTreatments = res.body || [];
          if (this.estimateTreatments.length > 0) {
            this.estimateTreatments.forEach((treatment) => {
              const section = this.mapTreatmentTypeToSection(
                treatment.treatmentType
              );

              if (section) {
                this.formLines[section].push({
                  id: treatment.id,
                   rowNumber: this.globalRowCounter++, 
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
      this.globalRowCounter = 1;
    window.print();
  }

  goBack(): void {
    this.router.navigate(["/view-estimate", this.estimateID]);

    // window.history.back();
  }
}
