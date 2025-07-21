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
import { RouterLink } from "@angular/router";
import { MatTabsModule } from "@angular/material/tabs";
import { FuseAlertComponent } from "@fuse/components/alert";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ModelAddWizardComponent } from "../model-add-wizard/model-add-wizard.component";
import { VehicleModelService } from "app/entities/operationsModuleCooperation/vehicle-model/service/vehicle-model.service";
import {
  IVehicleModel,
  NewVehicleModel,
} from "app/entities/operationsModuleCooperation/vehicle-model/vehicle-model.model";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import { BrandService } from "app/entities/operationsModuleCooperation/brand/service/brand.service";
import {
  IBrand,
  NewBrand,
} from "app/entities/operationsModuleCooperation/brand/brand.model";
//import { VehicleAddWizardComponent } from "../vehicle-add-wizard/vehicle-add-wizard.component";
import * as XLSX from "xlsx";
import dayjs from "dayjs/esm";
import { from, concatMap, last, finalize } from "rxjs";

@Component({
  selector: "app-models",
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
  ],
  templateUrl: "./models.component.html",
  styleUrl: "./models.component.scss",
})
export class ModelsComponent {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  searchInputControl = new FormControl();
  allModelDetails: any[] = [];
  noRecord: boolean = false;
  isImporting: boolean = false;

  allBrand: IBrand[] = [];

  displayedColumns: string[] = [
    "id",
    "modelName",
    // "description",
    // "opsUnitID",
    "brand",
    "action",
  ];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar,
    private _modelService: VehicleModelService,
    private _brandService: BrandService
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      this.page = 0;
      this.searchModel();
    });
  }
  ngOnInit(): void {
    this.getAllModelDetails();
    this._brandService.query({ size: 1000 }).subscribe((res) => {
      this.allBrand = res.body || [];
    });
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getAllModelDetails();
    });
  }

  //Get all model details
  getAllModelDetails() {
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
    };

    this._modelService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  //search model Details
  searchModel() {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getAllModelDetails();
      return;
    }

    // const queryString = `((id:"${searchTerm}"*) OR (licenseNo:"${searchTerm}"*))`;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      "licenseNo.contains": searchTerm,
    };

    this._modelService
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
   * Open model edit dialog
   */
  openModelEditDialog(model: any): void {
    const dialogRef = this._dialogService.open(ModelAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        model,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("Model Updated Successfully!", "Close", {
          duration: 3000,
        });
        this.getAllModelDetails();
      }
    });
  }

  /**
   * Delete
   */
  // deleteModel(model: IVehicleModel) {
  //   this._modelService.delete(model.id).subscribe(() => {
  //     this._snackBarService.open("Vehicle Deleted Successfully!", "Close", {
  //       duration: 3000,
  //     });
  //     this.getAllModelDetails();
  //   });
  // }

  deleteModel(model: IVehicleModel): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Model",
      message:
        "Are you sure you want to delete this model? This action cannot be undone!",
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
        this._modelService.delete(model.id).subscribe(() => {
          this.getAllModelDetails();
        });
      }
    });
  }
  /**
   * Open vehicle creation dialog
   */
  openModelCreateDialog(): void {
    const dialogRef = this._dialogService.open(ModelAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("Model Created Successfully!", "Close", {
          duration: 3000,
        });
        this.getAllModelDetails();
      }
    });
  }

  getBrandNameById(id: number): string {
    const brand = this.allBrand.find((m) => m.id === id);
    return brand ? brand.brandName : "-";
  }

  onFileUpload(event: any, fileInput: HTMLInputElement): void {
    const file = event.target.files[0];

    if (!file) {
      console.warn("No file selected.");
      return;
    }

    this.isImporting = true;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      console.log("Parsed Excel Data:", jsonData);

      this.importModelFromExcel(jsonData);
      fileInput.value = "";
    };

    reader.onerror = () => {
      console.error("Error reading file");
      this.isImporting = false;
      fileInput.value = "";
    };

    reader.readAsArrayBuffer(file);
  }

  importModelFromExcel(excelData: any[]): void {
    if (!excelData.length) {
      console.warn("No data to import.");
      return;
    }

    this.isImporting = true;

    // Extract unique IDs from the Excel data
    const ids = [...new Set(excelData.map((row) => row.id).filter(Boolean))];

    // Build query parameters to fetch existing models
    const params: any = {
      page: this.page,
      size: this.itemsPerPage,
    };

    if (ids.length) {
      params["id.in"] = ids.join(",");
    }

    console.log("Query Parameters:", params);

    // Step 1: Fetch existing models
    this._modelService.query(params).subscribe((response) => {
      const existingModel = response.body || [];
      console.log("Found existingModel:", existingModel);

      // Map of existing models by ID
      const idMap = new Map<number, IVehicleModel>();
      existingModel.forEach((model) => {
        if (model.id) {
          idMap.set(model.id, model);
        }
      });

      // Step 2: Process and import each model
      from(excelData)
        .pipe(
          concatMap((row) => {
            const isExisting = idMap.has(row.id);

            const model: NewVehicleModel = {
              id: isExisting ? row.id : null,
              modelName: row.modelName ?? null,
              description: row.description ?? null,
              opsUnitID: row.opsUnitID ?? null,
              createdBy: row.createdBy ?? null,
              createdDate: row.createdDate ? dayjs(row.createdDate) : null,
              lastModifiedBy: row.lastModifiedBy ?? null,
              lastModifiedDate: row.lastModifiedDate
                ? dayjs(row.lastModifiedDate)
                : null,
              brand: { id: row.brandId ?? null },
            };

            const request$ = isExisting
              ? this._modelService.update(model)
              : this._modelService.create(model);

            return request$;
          }),
          last(),
          finalize(() => {
            this.isImporting = false;
            console.log("Model import completed.");
            this.getAllModelDetails();
          })
        )
        .subscribe();
    });
  }
}
