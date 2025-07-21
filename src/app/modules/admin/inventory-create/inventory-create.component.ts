import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SupplierCreateComponent } from '../supplier-create/supplier-create.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { InventoryService } from 'app/entities/inventorymicro/inventory/service/inventory.service';
import { CategoryService } from 'app/entities/inventorymicro/category/service/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
 

@Component({
  selector: 'app-inventory-create',
  standalone: true,
  imports: [CommonModule, MatIconModule,
          FormsModule,
          ReactiveFormsModule,
          MatStepperModule,
          MatFormFieldModule,
          MatInputModule,
          MatSelectModule,
          MatOptionModule,
          MatButtonModule,
          MatCheckboxModule,
          MatRadioModule,],
  templateUrl: './inventory-create.component.html',
  styleUrl: './inventory-create.component.scss'
})
export class InventoryCreateComponent {
  inventoryservice=inject(InventoryService);
  categoryService=inject(CategoryService);
 
 inventoryForm : FormGroup;
constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InventoryCreateComponent>,public _snackBarService: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: any }
  ) {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      code: [null, Validators.required],
      reOrderQty: [null],
      checkType:[null],
      lastCost: [null],
      lastSellingPrice: [null],
    });}


      ngOnInit(): void {


  if (this.data?.supplier) {
    this.inventoryForm.patchValue(this.data.supplier);
    //this.bankForm.patchValue(this.data.supplier); // assuming flat structure
  }
  this.fetchInventoryCode(); 
  this.fetchCategories(); // Fetch categories on initialization
}


categories: any[] = [];
fetchCategories() {
  this.categoryService.query().subscribe({
    next: (res) => {
      this.categories = res.body || [];
    },
    error: (err) => {
      console.error('Failed to fetch categories:', err);
    }
  });
}

fetchInventoryCode(): void {
  const queryParams = {
    sort: ['id,desc'], // <-- Sort by id in descending order
    size: 1            // <-- Fetch only the last item (optional for efficiency)
  };

  this.inventoryservice.query(queryParams).subscribe({
    next: (data) => {
      const items = data.body || [];
      const lastItem = items.length > 0 ? items[0] : null; // [0] because we sorted DESC
      const lastCode = lastItem?.code || 'ITEM000';
      const prefix = lastCode.match(/[A-Za-z]+/)?.[0] || 'ITEM';
      const numberPart = parseInt(lastCode.replace(/\D/g, ''), 10);
      const newNumber = (numberPart + 1).toString().padStart(3, '0');
      const newCode = `${prefix}${newNumber}`;

      this.inventoryForm.patchValue({ code: newCode });
    },
    error: (error) => {
      console.error('Error fetching inventory code:', error);
    }
  });
}

itemsave(): void {
  const value = this.inventoryForm.value;

  // Create keyword by concatenating code and name without spaces
  const codePart = (value.code || '').toString().replace(/\s+/g, '');
  const namePart = (value.name || '').toString().replace(/\s+/g, '');
  const keyword = codePart + namePart;

  // Spread existing values and override/add keyword
  const payload = {
    ...value,
    keyword,
  };

  this.inventoryservice.create(payload).subscribe({
    next: (response) => {
      console.log('Inventory item created successfully:', response);

      this._snackBarService.open("Item created successfully!", "Close", {
        duration: 3000,
      });

      this.dialogRef.close(true);  // Closing dialog and passing true
      window.location.reload();
    },
    error: (err) => {
      console.error('Error creating inventory item:', err);
    }
  });
}





onSave(): void {
  if (this.inventoryForm.valid) {
    const formData = { ...this.inventoryForm.value };

    // Convert string inputs to numbers
    formData.reOrderQty = parseInt(formData.reOrderQty, 10) || 0;
    formData.lastCost = parseFloat(formData.lastCost) || 0;
    formData.lastSellingPrice = parseFloat(formData.lastSellingPrice) || 0;
this.itemsave();
    console.log('Parsed Inventory Form Data:', formData);
    this.dialogRef.close(formData); // optionally pass data to parent
  } else {
    console.warn('Form is invalid');
  }
}


}
