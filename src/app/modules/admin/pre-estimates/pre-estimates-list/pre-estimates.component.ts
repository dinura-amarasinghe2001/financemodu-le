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
import { IPreEstimate } from "app/entities/operationsModuleCooperation/pre-estimate/pre-estimate.model";
import { PreEstimateService } from "app/entities/operationsModuleCooperation/pre-estimate/service/pre-estimate.service";
import dayjs from "dayjs/esm";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FuseVerticalNavigationComponent } from "../../../../../@fuse/components/navigation/vertical/vertical.component";
import { environment } from "environments/environment";
import { PreEstimateTreatmentService } from "app/entities/operationsModuleCooperation/pre-estimate-treatment/service/pre-estimate-treatment.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-pre-estimates",
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
    FuseVerticalNavigationComponent,
  ],
  templateUrl: "./pre-estimates.component.html",
  styleUrl: "./pre-estimates.component.scss",
})
export class PreEstimatesComponent implements OnInit, AfterViewInit, OnDestroy {
  openComposeDialog() {
    throw new Error("Method not implemented.");
  }
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private preEstimateService = inject(PreEstimateService);
  private _preEstimateTreatmentService = inject(PreEstimateTreatmentService);
  private _snackBarService = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  dataSource: MatTableDataSource<IPreEstimate> =
    new MatTableDataSource<IPreEstimate>([]);
  displayedColumns: string[] = [
    "id",
    "preEstimateNumber",
    "licenseNo",
    // "vehicleID",
    "vehicleBrand",
    "vehicleModel",
    "vehicleOwnerName",

    "createdDate",
    "action",
  ];
  searchInputControl: FormControl = new FormControl("");
  totalItems: number = 0;
  itemsPerPage: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  menuData = [
    {
      id: "mailbox",
      title: "Mailbox",
      type: "group",
      children: [
        {
          id: "inbox",
          title: "Inbox",
          type: "basic",
          icon: "heroicons_outline:inbox",
          link: "/mailbox/inbox",
        },
        {
          id: "sent",
          title: "Sent",
          type: "basic",
          icon: "heroicons_outline:paper-airplane",
          link: "/mailbox/sent",
        },
        // more items...
      ],
    },
  ];

  ngOnInit(): void {
    this.loadPreEstimates();

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPreEstimates();
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadPreEstimates()),
          takeUntil(this._unsubscribeAll)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadPreEstimates(): void {
    const page = this.paginator?.pageIndex ?? 0;
    const size = this.paginator?.pageSize ?? this.itemsPerPage;
    const sort = this.sort?.active ?? "createdDate";
    const order = this.sort?.direction ?? "desc";
    const search = this.searchInputControl.value ?? "";

    this.preEstimateService
      .query({
        page: page,
        size: size,
        sort: [`${sort},${order}`],
        "preEstimateNumber.contains": search,
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

  openPreEstimateCreateDialog(): void {
    this.router.navigate(["/pre-estimates-create"]);
    // Implement the logic to open the create dialog
    // console.log("Open create dialog");
  }

  openPreEstimateTreatments(ID: string): void {
    // environment.preEstimateID = ID;
    this.router.navigate(["/pre-estimates-view/", ID]);
    // Implement the logic to open the create dialog
    // console.log("Open create dialog");
  }

  openPreEstimateEditDialog(preEstimate: IPreEstimate): void {
    // Implement the logic to open the edit dialog
    console.log("Open edit dialog", preEstimate);
  }

  deletePreEstimate(preEstimate: IPreEstimate): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Pre Estimate",
      message:
        "Are you sure you want to delete this pre estimate? This action cannot be undone!",
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
        this._preEstimateTreatmentService
          .query({
            "preEstimateId.equals": preEstimate.id,
          })
          .subscribe((res) => {
            if (res.body) {
              const deleteItems = res.body.map((item) => {
                return this._preEstimateTreatmentService.delete(item.id);
              });

              console.log(res.body);

              forkJoin(deleteItems).subscribe((res) => {
                if (res) {
                  this._snackBarService.open(
                    "Pre Estimate deleted successfully!",
                    "Close",
                    {
                      duration: 3000,
                    }
                  );
                  this.preEstimateService
                    .delete(preEstimate.id)
                    .subscribe(() => {
                      this.loadPreEstimates();
                    });
                }
              });
            }
          });
      }
    });
  }
}
