import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs'; // <--- import this
import { SupplierprofileComponent } from '../supplierprofile.component';

@Component({
  selector: 'app-wizardsupplierprofiles',
  standalone: true,
  imports: [MatDialogModule, MatTabsModule], // <-- add MatTabsModule here
  template: `
    <mat-tab-group [(selectedIndex)]="activeTabIndex">
      <mat-tab label="General Information">
        <p>General Information Form</p>
      </mat-tab>
      <mat-tab label="Bank Information">
        <p>Bank Information Form</p>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrls: ['./wizardsupplierprofiles.component.scss']
})
export class WizardsupplierprofilesComponent {
  activeTabIndex = 0;

  constructor(private dialog: MatDialog) {}

  openSupplierProfileDialog() {
    this.dialog.open(SupplierprofileComponent, {
      width: '900px',
      maxHeight: '90vh',
      autoFocus: false,
    });
  }
}
