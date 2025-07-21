import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
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
import { Router } from "@angular/router";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { IGatePass } from "app/entities/operationsModuleCooperation/gate-pass/gate-pass.model";
import { GatePassService } from "app/entities/operationsModuleCooperation/gate-pass/service/gate-pass.service";
import { Subject, takeUntil, tap, merge } from "rxjs";

@Component({
  selector: "app-gatepass",
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
  ],
  standalone: true,
  templateUrl: "./gatepass.component.html",
  styleUrl: "./gatepass.component.scss",
})
export class GatepassComponent implements OnInit, AfterViewInit, OnDestroy {
  private _fuseConfirmationService = inject(FuseConfirmationService);
  private gatePassService = inject(GatePassService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  dataSource: MatTableDataSource<IGatePass> = new MatTableDataSource<IGatePass>(
    []
  );
  displayedColumns: string[] = [
    "id",
    "vehicleLicenseNumber",
    "vehicleOwnerName",
    "vehicleBrand",
    "vehicleModel",
    "fuelLevel",
    "meterReading",
    "entryDateTime",
    "action",
  ];
  searchInputControl: FormControl = new FormControl("");
  totalItems: number = 0;
  itemsPerPage: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.loadGatePasses();

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadGatePasses();
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadGatePasses()),
          takeUntil(this._unsubscribeAll)
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadGatePasses(): void {
    const page = this.paginator?.pageIndex ?? 0;
    const size = this.paginator?.pageSize ?? this.itemsPerPage;
    const sort = this.sort?.active ?? "id";
    const order = this.sort?.direction ?? "asc";
    const search = this.searchInputControl.value ?? "";

    this.gatePassService
      .query({
        page: page,
        size: size,
        sort: [`${sort},${order}`],
        "vehicleLicenseNumber.contains": search,
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

  openGatePassCreateDialog(): void {
    // Implement the logic to open the create dialog
    console.log("Open create dialog");
  }

  openGatePassEditDialog(gatePass: IGatePass): void {
    // Implement the logic to open the edit dialog
    console.log("Open edit dialog", gatePass);
  }

  deleteGatePass(gatePass: IGatePass): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Gate Pass",
      message:
        "Are you sure you want to delete this gate pass? This action cannot be undone!",
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
        this.gatePassService.delete(gatePass.id).subscribe(() => {
          this.loadGatePasses();
        });
      }
    });
  }
}
