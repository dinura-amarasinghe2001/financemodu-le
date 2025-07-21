import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { OwnersComponent } from './owners.component';

export default [
    {
        path     : '',
        component: OwnersComponent,
    },
] as Routes;
