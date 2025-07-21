import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { InvoicesComponent } from './invoices.component';

export default [
    {
        path     : '',
        component: InvoicesComponent,
    },
] as Routes;
