import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { ModelsComponent } from './models_details/models.component';
export default [
    {
        path     : '',
        component: ModelsComponent,
    }
] as Routes;
