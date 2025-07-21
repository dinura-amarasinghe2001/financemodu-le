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
// import { IbrandModel } from "app/entities/operationsModuleCooperation/brand-model/brand-model.model";
// import { brandRegistryService } from "app/entities/operationsModuleCooperation/brand-registry/service/brand-registry.service";
// import { IbrandRegistry } from "app/entities/operationsModuleCooperation/brand-registry/brand-registry.model";
import { MatOption, MatSelectModule } from "@angular/material/select";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BrandAddWizardComponent } from "../brand-add-wizard/brand-add-wizard.component";
import { BrandService } from "app/entities/operationsModuleCooperation/brand/service/brand.service";
import {
  IBrand,
  NewBrand,
} from "app/entities/operationsModuleCooperation/brand/brand.model";
import { MatAutocomplete } from "@angular/material/autocomplete";
import { FuseConfirmationService } from "@fuse/services/confirmation";
import * as XLSX from "xlsx";
import { from, concatMap, last, finalize } from "rxjs";
import dayjs from "dayjs/esm";
@Component({
  selector: "app-brands",
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
    MatAutocomplete,
  ],
  templateUrl: "./brands.component.html",
  styleUrl: "./brands.component.scss",
})
// export class BrandsComponent {

// }
export class BrandsComponent implements OnInit {
  @ViewChild(MatPaginator) _paginator: MatPaginator;
  dataSource = new MatTableDataSource<any>();
  searchInputControl = new FormControl();
  allBrandDetails: any[] = [];
  noRecord: boolean = false;
  isImporting: boolean = false;

  displayedColumns: string[] = [
    "id",
    "brandName",
    // "description",
    // "opsUnitID",
    // "emblem",
    "action",
  ];

  itemsPerPage = 10;
  totalItems = 0;
  page = 1;

  private _fuseConfirmationService = inject(FuseConfirmationService);

  constructor(
    private _brandService: BrandService,
    private _dialogService: MatDialog,
    private _snackBarService: MatSnackBar
  ) {
    this.searchInputControl.valueChanges.subscribe((w) => {
      this.page = 0;
      this.searchbrand();
    });
  }
  ngOnInit(): void {
    this.getallBrandDetails();
  }

  ngAfterViewInit() {
    this._paginator.page.subscribe(() => {
      this.page = this._paginator.pageIndex + 1;
      this.itemsPerPage = this._paginator.pageSize;
      this.getallBrandDetails();
    });
  }

  //Get all brand details
  getallBrandDetails() {
    const queryParams = {
      page: this.page - 1,
      size: this.itemsPerPage,
    };

    this._brandService.query(queryParams).subscribe((res) => {
      if (res.body) {
        this.dataSource.data = res.body;
        this.totalItems = Number(res.headers.get("X-Total-Count"));
      } else {
        this.dataSource.data = [];
      }
      this.noRecord = this.dataSource.data.length === 0;
    });
  }

  //search brand Details
  searchbrand() {
    const searchTerm = this.searchInputControl.value?.trim();

    if (!searchTerm) {
      this.getallBrandDetails();
      return;
    }

    // const queryString = `((id:"${searchTerm}"*) OR (licenseNo:"${searchTerm}"*))`;
    const params = {
      page: this.page,
      size: this.itemsPerPage,
      "brandName.contains": searchTerm,
    };

    this._brandService
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
   * Open brand edit dialog
   */
  openBrandEditDialog(brand: any): void {
    const dialogRef = this._dialogService.open(BrandAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
      data: {
        brand,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("Brand Updated Successfully!", "Close", {
          duration: 3000,
        });
        this.getallBrandDetails();
      }
    });
  }

  /**
   * Delete
   */

  // deleteBrand(brand: IBrand): void {
  //   this._brandService.delete(brand.id).subscribe(() => {
  //     this._snackBarService.open("Brand Deleted Successfully!", "Close", {
  //       duration: 3000,
  //     });
  //     this.getallBrandDetails();
  //   });
  // }

  deleteBrand(brand: IBrand): void {
    const confirmation = this._fuseConfirmationService.open({
      title: "Delete Brand",
      message:
        "Are you sure you want to delete this brand? This action cannot be undone!",
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
        this._brandService.delete(brand.id).subscribe(() => {
          this.getallBrandDetails();
        });
      }
    });
  }

  /**
   * Open Brand creation dialog
   */
  openBrandCreateDialog(): void {
    const dialogRef = this._dialogService.open(BrandAddWizardComponent, {
      width: "80vh",
      maxHeight: "90vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._snackBarService.open("Brand Created Successfully!", "Close", {
          duration: 3000,
        });
        this.getallBrandDetails();
      }
    });
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

      this.importBrandFromExcel(jsonData);
      fileInput.value = "";
    };

    reader.onerror = () => {
      console.error("Error reading file");
      this.isImporting = false;
      fileInput.value = "";
    };

    reader.readAsArrayBuffer(file);
  }

  importBrandFromExcel(excelData: any[]): void {
    if (!excelData.length) {
      console.warn("No data to import.");
      return;
    }

    this.isImporting = true;

    // Extract unique IDs from the Excel data
    const ids = [...new Set(excelData.map((row) => row.id).filter(Boolean))];

    // Build query parameters to fetch existing brands
    const params: any = {
      page: this.page,
      size: this.itemsPerPage,
    };

    if (ids.length) {
      params["id.in"] = ids.join(",");
    }

    console.log("Query Parameters:", params);

    // Step 1: Fetch existing brands
    this._brandService.query(params).subscribe((response) => {
      const existingBrands = response.body || [];
      console.log("Found existingBrands:", existingBrands);

      // Map of existing brands by ID
      const idMap = new Map<number, any>();
      existingBrands.forEach((brand) => {
        if (brand.id) {
          idMap.set(brand.id, brand);
        }
      });

      // Step 2: Process and import each brand
      from(excelData)
        .pipe(
          concatMap((row) => {
            const isExisting = idMap.has(row.id);

            const brand: NewBrand = {
              id: isExisting ? row.id : null, // null for creation
              // Add other properties as needed, e.g., name: row.name
              brandName: row.brandName ?? null,
              description: row.description ?? null,
              opsUnitID: row.opsUnitID ?? null,
              emblem: row.emblem ?? null,
              createdBy: row.createdBy ?? null,
              createdDate: row.createdDate ? dayjs(row.createdDate) : null,
              lastModifiedBy: row.lastModifiedBy ?? null,
              lastModifiedDate: row.lastModifiedDate
                ? dayjs(row.lastModifiedDate)
                : null,
            };

            const request$ = isExisting
              ? this._brandService.update(brand)
              : this._brandService.create(brand);

            return request$; // optionally use catchError here
          }),
          last(),
          finalize(() => {
            this.isImporting = false;
            console.log("Brand import completed.");
            this.getallBrandDetails(); // Refresh list
          })
        )
        .subscribe();
    });
  }
}
