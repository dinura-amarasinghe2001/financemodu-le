import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ISupplier } from 'app/entities/inventorymicro/supplier/supplier.model';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-supplierprofile',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,    MatStepperModule
  ],
  templateUrl: './supplierprofile.component.html',
  styleUrls: ['./supplierprofile.component.scss']
})
export class SupplierprofileComponent {
  activeTabIndex = 0;

  switchToTab(index: number): void {
    this.activeTabIndex = index;
  }

 supplierprofile: ISupplier = {
    id: 0,
    code: null,
    shortCode: null,
    name: null,
    addressOffice: null,
    streetOffice: null,
    cityOffice: null,
    provinceOffice: null,
    addressFactory: null,
    streetFactory: null,
    cityFactory: null,
    provinceFactory: null,
    phone1: null,
    phone2: null,
    fax: null,
    email: null,
    website: null,
    contactPersonName: null,
    contactPersonPhone: null,
    contactPersonMobile: null,
    contactPersonEmail: null,
    registeredDate: null,
    description: null,
    brNumber: null,
    vatRegNumber: null,
    tinNumber: null,
    brNumberFilePath: null,
    vatRegNumberFilePath: null,
    tinNumberFilePath: null,
    agreementFilePath: null,
    roadMapFilePath: null,
    isActive: null,
    lmu: null,
    lmd: null,
    accountId: null,
    accountCode: null,
    isVATEnable: null,
    isNBTEnable: null,
    leadTime: null,
    isRegistered: null,
    creditPeriod: null,
    creditLimit: null
  };
  continue(): void {
  console.log(this.supplierprofile);
  this.switchToTab(1);
}

}
 
