import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { EstimatesComponent } from './estimates.component';

export default [
    {
        path     : '',
        component: EstimatesComponent,
    },
] as Routes;
