import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { PreEstimatesComponent } from './pre-estimates.component';

export default [
    {
        path     : '',
        component: PreEstimatesComponent,
    },
] as Routes;
