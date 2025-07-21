import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { AppointmentsComponent } from './appointments.component';

export default [
    {
        path     : '',
        component: AppointmentsComponent,
    },
] as Routes;
