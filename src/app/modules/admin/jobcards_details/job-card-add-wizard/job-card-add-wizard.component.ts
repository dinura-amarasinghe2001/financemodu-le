import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from "@angular/core";
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
import {
  MatOptionModule,
  provideNativeDateAdapter,
} from "@angular/material/core";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTimepickerModule } from "@angular/material/timepicker";
import {
  IJobCard,
  NewJobCard,
} from "app/entities/operationsModuleCooperation/job-card/job-card.model";
import { JobCardService } from "app/entities/operationsModuleCooperation/job-card/service/job-card.service";
import { IEstimateTreatment } from "app/entities/operationsModuleCooperation/estimate-treatment/estimate-treatment.model";
import { IJobEstimate } from "app/entities/operationsModuleCooperation/job-estimate/job-estimate.model";
import { FuseCardComponent } from "@fuse/components/card";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { Subject, takeUntil, tap } from "rxjs";
import { IJobItemTimeEstimation } from "app/entities/operationsModuleCooperation/job-item-time-estimation/job-item-time-estimation.model";

@Component({
  selector: "app-job-card-add-wizard",
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
    FuseCardComponent,
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./job-card-add-wizard.component.html",
  styleUrl: "./job-card-add-wizard.component.scss",
})
export class JobCardAddWizardComponent implements OnInit {
  jobCardForm: UntypedFormGroup;
  value: Date;
  startDate: any;
  jobCompleteDate: any;
  boothDate: any;

  searchInputControl = new FormControl();
  jobCardDetails: IJobCard;
  vehiclePreEstimateTreatments: IJobItemTimeEstimation[] = [];

  showDetails: boolean = false;

  constructor(
    // public dialogRef: MatDialogRef<JobCardAddWizardComponent>,
    // @Inject(MAT_DIALOG_DATA)
    // public data: {
    //   jobCard: IJobCard;
    // },
    private _fb: FormBuilder,
    private _jobCardRegistryService: JobCardService,
    private _estimateService: EstimateService,
    private _estimateTreatmentService: EstimateTreatmentService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      // this.page = 0;
      this.loadEstimate();
    });
  }
  ngOnInit(): void {
    // this.loadEstimate();
    this.jobCardForm = this._fb.group({
      id: [null],
      vehicleID: [null],
      vehicleBrand: [null],
      vehicleModel: [null],
      vehicleLicenseNumber: [null],
      vehicleOwnerID: [null],
      vehicleOwnerName: [null],
      vehicleOwnerContactNumber1: [null],
      vehicleOwnerContactNumber2: [null],
      estimateID: [null],
      insuranceCompany: [null],
      serviceAdvisor: [null],
      numberOfPanels: [null],
      fuelLevel: [null],
      meterReading: [null],
      startDate: [null, Validators.required],
      jobCardNumber: [null],
      jobCompleteDate: [null, Validators.required],
      boothDate: [null, Validators.required],
      opsUnitID: [null],
      createdBy: [null],
      createdDate: [null], // You can initialize with a date if needed
      lastModifiedBy: [null],
      lastModifiedDate: [null], // You can initialize with a date if needed
    });

    // if (this.data?.jobCard) {
    //   this.jobCardForm.patchValue(this.data.jobCard);
    // }
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  submitjobCard() {
    const jobCardData = this.jobCardForm.value;

    const newJobCard: NewJobCard = {
      id: null,
      vehicleID: this.jobCardForm.get("vehicleID").value,
      vehicleBrand: this.jobCardForm.get("vehicleBrand").value,
      vehicleModel: this.jobCardForm.get("vehicleModel").value,
      vehicleLicenseNumber: this.jobCardForm.get("vehicleLicenseNumber").value,
      vehicleOwnerID: this.jobCardForm.get("vehicleOwnerID").value,
      vehicleOwnerName: this.jobCardForm.get("vehicleOwnerName").value,
      vehicleOwnerContactNumber1: this.jobCardForm.get(
        "vehicleOwnerContactNumber1"
      ).value,
      vehicleOwnerContactNumber2: this.jobCardForm.get(
        "vehicleOwnerContactNumber2"
      ).value,
      estimateID: this.jobCardForm.get("estimateID").value,
      insuranceCompany: this.jobCardForm.get("insuranceCompany").value,
      serviceAdvisor: this.jobCardForm.get("serviceAdvisor").value,
      numberOfPanels: this.jobCardForm.get("numberOfPanels").value,
      fuelLevel: this.jobCardForm.get("fuelLevel").value,
      meterReading: this.jobCardForm.get("meterReading").value,
      startDate: this.jobCardForm.get("startDate").value,
      jobCardNumber: this.jobCardForm.get("jobCardNumber").value,
      jobCompleteDate: this.jobCardForm.get("jobCompleteDate").value,
      boothDate: this.jobCardForm.get("boothDate").value,
      opsUnitID: this.jobCardForm.get("opsUnitID").value,
    };
  }

  // cancel(): void {
  //   this.dialogRef.close();
  // }

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  loadEstimate(): void {
    const search = this.searchInputControl.value?.trim();

    this._estimateService
      .find(search)
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap((res) => {
          const estimate = { ...res.body };
          // delete estimate.id;
          this.jobCardDetails = { ...res.body };
          if (this.jobCardDetails) {
            this._estimateTreatmentService
              .query({
                "estimateId.equals": `${res.body.id}`,
              })
              .subscribe((res) => {
                const treatments: IEstimateTreatment[] = res.body || [];

                // Transform into IJobItemTimeEstimation
                this.vehiclePreEstimateTreatments = treatments.map(
                  (treatment) => {
                    const remark =
                      treatment.partName ||
                      treatment.repairName ||
                      treatment.paintName ||
                      treatment.fittingChargeName ||
                      treatment.other ||
                      "";

                    const jobItem: IJobItemTimeEstimation = {
                      id: treatment.id,
                      remark: remark,
                      // You can map startDateTime, endDateTime, jobItemType etc. if needed
                      // For example:
                      // startDateTime: treatment.approvedDate,
                      // jobItemType: this.mapTreatmentTypeToJobItemType(treatment.treatmentType),
                      // opsUnitID: treatment.opsUnitID,
                    };

                    return jobItem;
                  }
                );

                console.log(
                  "🛠️ Job Item Time Estimations:",
                  this.vehiclePreEstimateTreatments
                );
              });
          }
        })
      )
      .subscribe();
  }

  createEstimate(): void {}

  updateEstimate(): void {}
}
