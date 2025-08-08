import { Routes } from '@angular/router';
import {  TransactionComponent} from './transaction.component';
 

export default [
  {
    path: '',
    component:  TransactionComponent,
    children: [
     
      
    ]
  }
] as Routes;
