import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SupplierCreateComponent } from '../supplier-create/supplier-create.component';

@Component({
  selector: 'app-supplier-details',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatFormField, MatFormFieldModule, MatInputModule],
  templateUrl: './supplier-details.component.html',
  styleUrl: './supplier-details.component.scss',
})
export class SupplierDetailsComponent implements OnInit, AfterViewInit {
  supplier: any;
  searchInputControl = new FormControl();
  constructor(private _matDialogService: MatDialog) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {}

  openCreateDialog(): void {
    const supplier = this.supplier;
    this._matDialogService.open(SupplierCreateComponent, {
      width: '80vh',
      maxHeight: '90vh',
      data: {
        supplier,
      },
    });
  }
}
