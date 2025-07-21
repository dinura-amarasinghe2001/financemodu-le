import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { OnGoingComponent } from './on-going.component';

export default [
    {
        path     : '',
        component: OnGoingComponent,
    },
] as Routes;
