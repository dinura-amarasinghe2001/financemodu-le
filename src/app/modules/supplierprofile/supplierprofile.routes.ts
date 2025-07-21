import { Routes } from '@angular/router';
 
import { SupplierprofileComponent } from './supplierprofile.component';
 

export default [
  {
    path: '',
    component: SupplierprofileComponent,
    children: [
      {
        path: '',
        redirectTo: 'details',
        pathMatch: 'full',
      },
      {
        path: 'details',
        component: SupplierprofileComponent, // Make sure this component exists and is imported
      },
    ]
  }
] as Routes;

