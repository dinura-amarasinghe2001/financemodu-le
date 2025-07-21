import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { CreateEstimateComponent } from './create-estimate.component';

export default [
    {
        path     : '',
        component: CreateEstimateComponent,
    },
] as Routes;
