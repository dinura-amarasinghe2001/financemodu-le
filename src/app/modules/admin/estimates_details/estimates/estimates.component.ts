import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { Router, RouterLink } from "@angular/router";
import { FuseAlertComponent } from "@fuse/components/alert";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import {
  forkJoin,
  merge,
  Observable,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { IEstimate } from "app/entities/operationsModuleCooperation/estimate/estimate.model";
import { EstimateService } from "app/entities/operationsModuleCooperation/estimate/service/estimate.service";
import dayjs from "dayjs/esm";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CreateEstimateComponent } from "../create-estimate/create-estimate.component";
import { PreEstimateTreatmentService } from "app/entities/operationsModuleCooperation/pre-estimate-treatment/service/pre-estimate-treatment.service";
import { EstimateTreatmentService } from "app/entities/operationsModuleCooperation/estimate-treatment/service/estimate-treatment.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-estimates",
  standalone: true,
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
    RouterLink,
    FuseAlertComponent,
    MatTooltipModule,
    CreateEstimateComponent,
  ],
  templateUrl: "./estimates.component.html",
  styleUrl: "./estimates.component.scss",
})
export class EstimatesComponent implements OnInit, AfterViewInit, OnDestroy {
  createEstimate: boolean = false;
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private estimateService = inject(EstimateService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private _estimateTreatmentService = inject(EstimateTreatmentService);
  private _snackBarService = inject(MatSnackBar);

  dataSource: MatTableDataSource<IEstimate> = new MatTableDataSource<IEstimate>(
    []
  );
  displayedColumns: string[] = [
    "id",
    "estimateID",
    "vehicleID",
    "vehicleOwnerName",
    "ServiceAdvisorName",
    "vehicleModel",
    // "totalPrice",
    "action",
  ];
  searchInputControl: FormControl = new FormControl("");
  totalItems: number = 0;
  itemsPerPage: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.loadEstimates();

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadEstimates();
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadEstimates()),
          takeUntil(this._unsubscribeAll)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadEstimates(): void {
    const page = this.paginator?.pageIndex ?? 0;
    const size = this.paginator?.pageSize ?? this.itemsPerPage;
    const sort = this.sort?.active ?? "createdDate";
    const order = this.sort?.direction ?? "desc";
    const search = this.searchInputControl.value ?? "";

    this.estimateService
      .query({
        page: page,
        size: size,
        sort: [`${sort},${order}`],
        "estimateID.contains": search,
      })
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap((res) => {
          this.totalItems = Number(res.headers.get("X-Total-Count"));
          this.dataSource.data = res.body ?? [];
        })
      )
      .subscribe();
  }

  openEstimateEdit(estimateID: number): void {
    // Implement the logic to open the edit dialog
    console.log("Open edit dialog", estimateID);
    this.router.navigate(["/view-estimate/", estimateID]);
  }

  deleteEstimate(estimate: IEstimate): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Estimate",
      message:
        "Are you sure you want to delete this estimate? This action cannot be undone!",
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
        this._estimateTreatmentService
          .query({
            "estimateId.equals": estimate.id,
          })
          .subscribe((res) => {
            if (res.body.length > 0) {
              const deleteItems = res.body.map((item) => {
                return this._estimateTreatmentService.delete(item.id);
              });

              forkJoin(deleteItems).subscribe((res) => {
                if (res) {
                  this._snackBarService.open(
                    "Estimate deleted successfully!",
                    "Close",
                    {
                      duration: 3000,
                    }
                  );
                  this.estimateService.delete(estimate.id).subscribe(() => {
                    this.loadEstimates();
                  });
                }
              });
            } else {
              this.estimateService.delete(estimate.id).subscribe(() => {
                this.loadEstimates();
              });
            }
          });
      }
    });
  }

  toggleCreateEstimate(): void {
    this.createEstimate = !this.createEstimate;
  }
}
