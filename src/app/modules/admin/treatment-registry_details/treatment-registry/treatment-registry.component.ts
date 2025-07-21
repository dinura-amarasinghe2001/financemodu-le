import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { VehicleTreatmentRegistryService } from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/service/vehicle-treatment-registry.service";
import {
  IVehicleTreatmentRegistry,
  NewVehicleTreatmentRegistry,
} from "app/entities/operationsModuleCooperation/vehicle-treatment-registry/vehicle-treatment-registry.model";
import { TreatmentRegistryAddWizardComponent } from "../treatment-registry-add-wizard/treatment-registry-add-wizard.component";
import { VehicleModelService } from "app/entities/operationsModuleCooperation/vehicle-model/service/vehicle-model.service";
import { IVehicleModel } from "app/entities/operationsModuleCooperation/vehicle-model/vehicle-model.model";
import { concatMap, finalize, forkJoin, from, last } from "rxjs";
import * as XLSX from "xlsx";
import dayjs from "dayjs/esm";
import { TreatmentType } from "app/entities/enumerations/treatment-type.model";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatOptionModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { FuseAlertComponent } from "@fuse/components/alert";

@Component({
  selector: "app-treatment-registry",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ReactiveFormsModule,
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
    MatOptionModule,
    FuseAlertComponent,
    MatButtonToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatChipsModule,
  ],
  templateUrl: "./treatment-registry.component.html",
  styleUrls: ["./treatment-registry.component.scss"],
})
export class TreatmentRegistryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<IVehicleTreatmentRegistry>();
  searchInputControl = new FormControl();
  get displayedColumns(): string[] {
    return [
      ...(this.isPart ? ["partName"] : []),
      ...(this.isPaint ? ["paintName"] : []),
      ...(this.isFittingCharge ? ["fittingChargeName"] : []),
      ...(this.isRepair ? ["repairName"] : []),
      "action",
    ];
  }

  isImporting: boolean = false;

  allVehicleModels: IVehicleModel[] = [];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;

  selectedType: string = "PART";
  // treatmentTypes = Object.keys(TreatmentType);
  treatmentTypes = [
    { value: "PART", label: "Spare Parts" },
    { value: "PAINT", label: "Painting" },
    { value: "FITTING_CHARGE", label: "Fitting Chargers" },
    { value: "REPAIR", label: "Repairing" },
  ];

  constructor(
    private treatmentRegistryService: VehicleTreatmentRegistryService,
    // private dialog: MatDialog,
    // private snackBar: MatSnackBar
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar,
    private _modelService: VehicleModelService
  ) {
    this.searchInputControl.valueChanges.subscribe(() => {
      this.page = 0;
      this.searchTreatments();
    });
  }

  ngOnInit(): void {
    this.getAllTreatments();

    this._modelService.query().subscribe((response) => {
      this.allVehicleModels = response.body || [];
    });
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.page = this.paginator.pageIndex + 1;
      this.itemsPerPage = this.paginator.pageSize;
      this.getAllTreatments();
    });
  }

  /**
   * Fetch all treatments
   */
  getAllTreatments(): void {
    const type = this.selectedType;
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
      "treatmentType.equals": type,
    };

    this.treatmentRegistryService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
    });
  }

  /**
   * Search treatments
   */
  searchTreatments(): void {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getAllTreatments();
      return;
    }

    const fields = ["fittingChargeName", "paintName", "partName", "repairName"];

    const queries = fields.map((field) => {
      return this.treatmentRegistryService.query({
        page: this.page - 1,
        size: this.itemsPerPage,
        [`${field}.contains`]: searchTerm,
      });
    });

    forkJoin(queries).subscribe((responses) => {
      // Combine all response bodies
      const combined = responses.flatMap((res) => res.body || []);

      // Deduplicate by `id`
      const uniqueResults = Array.from(
        new Map(combined.map((item) => [item.id, item])).values()
      );

      // Assign to table
      this.totalItems = uniqueResults.length;
      this.dataSource.data = uniqueResults;
    });
  }

  /**
   * Open treatment creation dialog
   */
  openTreatmentCreateDialog(): void {
    const dialogRef = this._dialogService.open(
      TreatmentRegistryAddWizardComponent,
      {
        width: "100vh",
        maxHeight: "90vh",
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open(
          "Appointment Created Successfully!",
          "Close",
          {
            duration: 3000,
          }
        );
        this.getAllTreatments();
      }
    });
  }

  /**
   * Open treatment edit dialog
   */
  openTreatmentEditDialog(treatment: any): void {
    const dialogRef = this._dialogService.open(
      TreatmentRegistryAddWizardComponent,
      {
        width: "80vh",
        maxHeight: "90vh",
        data: {
          treatment,
        },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open(
          "Appointment Updated Successfully!",
          "Close",
          {
            duration: 3000,
          }
        );
        this.getAllTreatments();
      }
    });
  }

  /**
   * Delete treatment
   */
  deleteTreatment(treatment: IVehicleTreatmentRegistry): void {
    this.treatmentRegistryService.delete(treatment.id).subscribe(() => {
      this._snackBarService.open("Treatment Deleted Successfully!", "Close", {
        duration: 3000,
      });
      this.getAllTreatments();
    });
  }

  getModelNameById(id: number): string {
    const model = this.allVehicleModels.find((m) => m.id === id);
    return model ? model.modelName : "-";
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

    const ids = [...new Set(excelData.map((row) => row.id).filter(Boolean))];

    const params: any = {
      page: 0,
      size: 1000,
    };

    if (ids.length) {
      params["id.in"] = ids.join(",");
    }

    this.treatmentRegistryService.query(params).subscribe((response) => {
      const existingTreatments = response.body || [];

      const idMap = new Map<number, any>();
      existingTreatments.forEach((treatment) => {
        if (treatment.id) {
          idMap.set(treatment.id, treatment);
        }
      });

      from(excelData)
        .pipe(
          concatMap((row) => {
            const isExisting = idMap.has(row.id);

            const treatment: NewVehicleTreatmentRegistry = {
              id: isExisting ? row.id : null,
              fittingChargeName: row.fittingChargeName ?? null,
              partName: row.partName ?? null,
              paintName: row.paintName ?? null,
              repairName: row.repairName ?? null,
              otherName: row.otherName ?? null,
              description: row.description ?? null,
              partNumber: row.partNumber ?? null,
              availableQuantity: row.availableQuantity ?? 0,
              price: row.price ?? 0,
              treatmentType: row.treatmentType ?? null,
              opsUnitID: row.opsUnitID ?? null,
              createdBy: row.createdBy ?? null,
              createdDate: row.createdDate ? dayjs(row.createdDate) : null,
              lastModifiedBy: row.lastModifiedBy ?? null,
              lastModifiedDate: row.lastModifiedDate
                ? dayjs(row.lastModifiedDate)
                : null,
              vehicleModel: row.vehicleModelId
                ? { id: row.vehicleModelId }
                : null,
            };

            return isExisting
              ? this.treatmentRegistryService.update(treatment)
              : this.treatmentRegistryService.create(treatment);
          }),
          last(),
          finalize(() => {
            this.isImporting = false;
            console.log("Treatment import completed.");
            this.getAllTreatments();
          })
        )
        .subscribe();
    });
  }

  filterWorks(): void {
    // alert(this.selectedType);
    const type = this.selectedType;
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
      "treatmentType.equals": type,
    };

    this.treatmentRegistryService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
    });
  }

  get selectedTypeColumn(): TreatmentType {
    return this.selectedType as TreatmentType;
  }

  get isOther(): boolean {
    return this.selectedTypeColumn === TreatmentType.OTHER;
  }

  get isPart(): boolean {
    return this.selectedTypeColumn === TreatmentType.PART || this.isOther;
  }

  get isPaint(): boolean {
    return this.selectedTypeColumn === TreatmentType.PAINT || this.isOther;
  }

  get isFittingCharge(): boolean {
    return (
      this.selectedTypeColumn === TreatmentType.FITTING_CHARGE || this.isOther
    );
  }

  get isRepair(): boolean {
    return this.selectedTypeColumn === TreatmentType.REPAIR || this.isOther;
  }
}
