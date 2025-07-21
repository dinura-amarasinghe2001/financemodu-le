import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { JobCardsComponent } from './job-cards.component';
export default [
    {
        path     : '',
        component: JobCardsComponent,
    }
] as Routes;
