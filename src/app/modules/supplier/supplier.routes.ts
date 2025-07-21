import { Routes } from '@angular/router';
import { SupplierComponent } from './supplier.component';
import { AddsupplierComponent } from './addsupplier/addsupplier.component';
import { ReadsupplierComponent } from './readsupplier/readsupplier.component';

export default [
  {
    path: '',
    component: SupplierComponent,
    children: [
      { path: 'addsupplier', component: AddsupplierComponent },
      { path: 'readsupplier', component: ReadsupplierComponent },
      
    ]
  }
] as Routes;
