import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { FuseAlertComponent } from "@fuse/components/alert";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { JobCardAddWizardComponent } from "../job-card-add-wizard/job-card-add-wizard.component";
import { JobCardService } from "app/entities/operationsModuleCooperation/job-card/service/job-card.service";
import { IJobCard } from "app/entities/operationsModuleCooperation/job-card/job-card.model";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { forkJoin, of, switchMap } from "rxjs";
import { JobEstimateService } from "app/entities/operationsModuleCooperation/job-estimate/service/job-estimate.service";
import { JobEstimateWorkLogService } from "app/entities/operationsModuleCooperation/job-estimate-work-log/service/job-estimate-work-log.service";
import { JobEstimateWorkProductsService } from "app/entities/operationsModuleCooperation/job-estimate-work-products/service/job-estimate-work-products.service";

@Component({
  selector: "app-job-cards",
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatSelectModule,
    MatAutocomplete,
    RouterModule,
  ],
  templateUrl: "./job-cards.component.html",
  styleUrl: "./job-cards.component.scss",
})
export class JobCardsComponent implements OnInit {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  searchInputControl = new FormControl();
  allJobCardDetails: any[] = [];
  noRecord: boolean = false;

  displayedColumns: string[] = [
    "id",
    "jobCardNumber",

    "vehicleLicenseNumber",
    "vehicleOwnerName",
    "vehicleBrand",
    "vehicleModel",
    "serviceAdvisor",
    "action",
  ];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;
  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _jobCardService: JobCardService,
    private _jobEstimateService: JobEstimateService,
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar,
    private _router: Router,
    private _jobEstimateWorkLogService: JobEstimateWorkLogService,
    private _jobEstimateProductService: JobEstimateWorkProductsService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      this.page = 0;
      this.searchJobCard();
    });
  }
  ngOnInit(): void {
    this.getallJobCardDetails();
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getallJobCardDetails();
    });
  }

  //Get all jobCard details
  getallJobCardDetails() {
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
      sort: "createdDate,desc",
    };

    this._jobCardService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  //search jobCard Details
  searchJobCard() {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getallJobCardDetails();
      return;
    }

    // const queryString = `((id:"${searchTerm}"*) OR (licenseNo:"${searchTerm}"*))`;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      "jobCardNumber.contains": searchTerm,
    };

    this._jobCardService
      // .search({
      //   query: queryString,
      //   size: 5,
      //   sort: ["desc"],
      // })
      .query(params)
      .subscribe((res) => {
        this.totalItems = Number(res.headers.get("X-Total-Count"));
        this.dataSource.data = res.body || [];
        this.noRecord = this.dataSource.data.length === 0;
      });
  }

  /**
   * Open JobCard edit dialog
   */
  openJobCardEditDialog(jobCard: any): void {
    const dialogRef = this._dialogService.open(JobCardAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        jobCard,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("JobCard updated successfully!", "Close", {
          duration: 3000,
        });
        this.getallJobCardDetails();
      }
    });
  }

  /**
   * Delete
   */

  // deleteJobCard(jobCard: IJobCard): void {
  //   this._jobCardService.delete(jobCard.id).subscribe(() => {
  //     this._snackBarService.open("JobCard deleted successfully!", "Close", {
  //       duration: 3000,
  //     });
  //     this.getallJobCardDetails();
  //   });
  // }

  deleteJobCard(jobCard: IJobCard): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Estimate",
      message:
        "Are you sure you want to delete this jobCard? This action cannot be undone!",
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
        this._jobEstimateService
          .query({ "jobCardId.equals": jobCard.id })
          .subscribe((jobEstimateRes) => {
            const jobEstimates = jobEstimateRes.body || [];

            const allDeleteObservables = [];

            jobEstimates.forEach((estimate) => {
              const workLogs$ = this._jobEstimateWorkLogService
                .query({ "jobEstimateId.equals": estimate.id })
                .pipe(
                  switchMap((workLogRes) => {
                    const workLogs = workLogRes.body || [];

                    const productDeletes = workLogs.map((log) =>
                      this._jobEstimateProductService
                        .query({ "jobEstimateWorkLogId.equals": log.id })
                        .pipe(
                          switchMap((productRes) => {
                            const productDeleteCalls = (
                              productRes.body || []
                            ).map((product) =>
                              this._jobEstimateProductService.delete(product.id)
                            );
                            return forkJoin(
                              productDeleteCalls.length
                                ? productDeleteCalls
                                : [of(null)]
                            );
                          }),
                          switchMap(() =>
                            this._jobEstimateWorkLogService.delete(log.id)
                          )
                        )
                    );

                    return forkJoin(
                      productDeletes.length ? productDeletes : [of(null)]
                    );
                  }),
                  switchMap(() => this._jobEstimateService.delete(estimate.id))
                );

              allDeleteObservables.push(workLogs$);
            });

            forkJoin(
              allDeleteObservables.length ? allDeleteObservables : [of(null)]
            ).subscribe(() => {
              this._jobCardService.delete(jobCard.id).subscribe(() => {
                this._snackBarService.open(
                  "Job Card deleted successfully!",
                  "Close",
                  {
                    duration: 3000,
                  }
                );
                this.getallJobCardDetails();
              });
            });
          });
      }
    });
  }

  /**
   * Open JobCard creation dialog
   */
  openJobCardCreateDialog(): void {
    const dialogRef = this._dialogService.open(JobCardAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("JobCard created successfully!", "Close", {
          duration: 3000,
        });
        this.getallJobCardDetails();
      }
    });
  }
}
