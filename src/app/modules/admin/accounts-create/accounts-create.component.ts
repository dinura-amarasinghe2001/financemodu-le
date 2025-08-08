import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { AccountTypeService } from 'app/entities/financemicro/account-type/service/account-type.service';
import { InventoryService } from 'app/entities/inventorymicro/inventory/service/inventory.service';
import { Observable, startWith, map } from 'rxjs';
import { AccounttreeCreateComponent } from '../accounttree-create/accounttree-create.component';
import { AccountsService } from 'app/entities/financemicro/accounts/service/accounts.service';

@Component({
  selector: 'app-accounts-create',
  standalone: true,
      imports: [
       CommonModule, MatIconModule,
           FormsModule, ReactiveFormsModule,
           MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule,
           MatOptionModule, MatButtonModule, MatCheckboxModule, MatRadioModule,MatAutocompleteModule
      ],
  templateUrl: './accounts-create.component.html',
  styleUrl: './accounts-create.component.scss'
})
export class AccountsCreateComponent implements OnInit {
  inventoryservice = inject(InventoryService);
  categoryService = inject(AccountTypeService);
AccountsService = inject(AccountsService);
  categoryForm: FormGroup;
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AccounttreeCreateComponent>,
    public _snackBarService: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { supplier: any }
  ) {
    this.categoryForm = this.fb.group({
      name: [''],
      parentCategory: [null]  // this will store the selected parent
    });
  }
  parentCategoryControl = new FormControl(null);
  filteredCategories!: Observable<any[]>;
  ngOnInit(): void {
  this.fetchCategories();
this.filteredCategories = this.categoryForm.controls.parentCategory.valueChanges.pipe(
  startWith(''),
  map(value => (typeof value === 'string' ? value : value?.lmu)),
  map(name =>
    name
      ? this.categories.filter(cat =>
          cat.lmu.toLowerCase().includes(name.toLowerCase())
        )
      : this.categories.slice()
  )
);

 if (this.data?.supplier) {
  this.categoryForm.patchValue(this.data.supplier);
  // If parentCategory is an object, patch it properly here, e.g.:
  // this.categoryForm.patchValue({ parentCategory: theParentObject });
  this.fullPathPreview = this.computeFullPath();
}


  // 🔁 Watch for form changes and update preview
  this.categoryForm.valueChanges.subscribe(() => {
    this.fullPathPreview = this.computeFullPath();
  });
}
  displayCategory(category: any): string {
    return category && category.lmu ? category.lmu : '';
  }

  onCategorySelected(event: any, selectedCategory: any) {
    if (event.isUserInput) {
      this.parentCategoryControl.setValue(selectedCategory);
    }
  }
  fetchCategories() {
    this.categoryService.query().subscribe({
      next: (res) => {
        this.categories = res.body || [];
        console.log(this.categories)
      },
      error: (err) => {
        console.error('Failed to fetch categories:', err);
      }
    });
  }

 computeFullPath(): string {
  const parent = this.categoryForm.controls.parentCategory.value;
  const name = this.categoryForm.controls.name.value || '';
console.log(parent)
  if (parent) {
    if (typeof parent === 'object' && parent.lmu) {
      return `${parent.lmu}/${name}`;
    }
    if (typeof parent === 'string' && parent.trim() !== '') {
      console.log('tis works')
      return `${parent.trim()}/${name}`;
    }
  }

  return name || '';
}

fullPathPreview: string = '';

  itemsave(): void {
    let fullPath = this.computeFullPath();

  if (fullPath.endsWith('/')) {
    fullPath = fullPath.slice(0, -1);
  }

  const segments = fullPath.split('/');
  let generatedCode = '';

  if (segments.length >= 2) {
    const firstPart = segments[0];
    const secondLastPart = segments[segments.length - 2];

    const first3First = firstPart.substring(0, 3);
    const first3SecondLast = secondLastPart.substring(0, 3);
    const randomNum = Math.floor(100 + Math.random() * 900); // random 3-digit number

    generatedCode = `${first3First}${first3SecondLast}${randomNum}`;
  }

  const payload = {
    id: null,
     parent: this.categoryForm.value.parentCategory.type || this.categoryForm.value.parentCategory,
     path: fullPath,
    code: generatedCode,  // Use generated code here
    child:  this.categoryForm.controls.name.value || '',
    name: this.categoryForm.controls.name.value || ''
  };

  console.log('Generated Code:', generatedCode);
  console.log('Payload:', payload);
  this.AccountsService.create(payload).subscribe({
      next: (response) => {
   this._snackBarService.open("Category created successfully!", "Close", {
           duration: 3000,
      });
     this.dialogRef.close(true);
        // window.location.reload();
       },
      error: (err) => {
        console.error('Error creating category:', err);
  }
    });
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      this.itemsave();
    } else {
      console.warn('Form is invalid');
    }
  }
}
