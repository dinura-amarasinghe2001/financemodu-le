import { Routes } from '@angular/router';
import {  AccountsComponent} from './accounts.component';
 

export default [
  {
    path: '',
    component:  AccountsComponent,
    children: [
     
      
    ]
  }
] as Routes;
