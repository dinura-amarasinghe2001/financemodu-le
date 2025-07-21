import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IGatePass } from "app/entities/operationsModuleCooperation/gate-pass/gate-pass.model";
import { GatePassService } from "app/entities/operationsModuleCooperation/gate-pass/service/gate-pass.service";
import { GatePassImgService } from "../gatepass-create/gate-pass-img.service";
import { MatFormField } from "@angular/material/form-field";
import { ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
import { MatTimepickerModule } from "@angular/material/timepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { FuseAlertComponent } from "@fuse/components/alert";
import { MatButtonModule } from "@angular/material/button";
import { FuseNavigationService } from "@fuse/components/navigation";
import { environment } from "environments/environment";

@Component({
  selector: "app-gatepass-print",
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInputModule,
    MatIcon,
    CommonModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FuseAlertComponent,
    MatButtonModule,
  ],
  templateUrl: "./gatepass-print.component.html",
  styleUrl: "./gatepass-print.component.scss",
})
export class GatepassPrintComponent implements OnInit {
  _fuseNavigationService = inject(FuseNavigationService);

  gatePassID: number = 0;

  routeParamId: string;
  queryParamPropertyId: string;
  gatePassDetails: IGatePass;

  private router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private _gatePassService: GatePassService,
    private _gatePassImgService: GatePassImgService
  ) {}

  ngOnInit(): void {
    this.routeParamId = this.route.snapshot.paramMap.get("id");
    this.gatePassID = Number(this.routeParamId);

    if (this.routeParamId) {
      this.getGatePass(Number(this.routeParamId));
    }

    this.queryParamPropertyId =
      this.route.snapshot.queryParamMap.get("gatePassId");
  }

  getGatePass(id: number): void {
    this._gatePassService.find(id).subscribe((res) => {
      this.gatePassDetails = res.body;
      if (this.gatePassDetails) {
        this.loadImages();
      }
      console.log(this.gatePassDetails);
    });
  }

  imageUrl: string;
  frontImgUrl: string | null = null;
  sideRImgUrl: string | null = null;
  sideLImgUrl: string | null = null;
  rearImgUrl: string | null = null;

  loadImages(): void {
    const details = this.gatePassDetails;

    if (details.frontView1) {
      this._gatePassImgService
        .getImageWithAuth(`${environment.imgUrl}${details.frontView1}`)
        .subscribe((url) => (this.frontImgUrl = url));
    }

    if (details.sideRView1) {
      this._gatePassImgService
        .getImageWithAuth(`${environment.imgUrl}${details.sideRView1}`)
        .subscribe((url) => (this.sideRImgUrl = url));
    }

    if (details.sideLView1) {
      this._gatePassImgService
        .getImageWithAuth(`${environment.imgUrl}${details.sideLView1}`)
        .subscribe((url) => (this.sideLImgUrl = url));
    }

    if (details.rearView1) {
      this._gatePassImgService
        .getImageWithAuth(`${environment.imgUrl}${details.rearView1}`)
        .subscribe((url) => (this.rearImgUrl = url));
    }
  }

  getImageUrl(imageName: string): void {
    this._gatePassImgService
      .getImageWithAuth(`${environment.imgUrl}${imageName}`)
      .subscribe((url) => {
        this.imageUrl = url;
      });
  }

  print(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(["/gatepass-view", this.gatePassID]);
    // this.router.navigate(["/pre-estimates-view/", this.preEstimateID]);

    // window.history.back();
  }
}
