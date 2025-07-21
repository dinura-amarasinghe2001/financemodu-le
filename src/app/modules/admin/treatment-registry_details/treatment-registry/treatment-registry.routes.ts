import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
import { TreatmentRegistryComponent } from './treatment-registry.component';
 
export default [
    {
        path     : '',
        component: TreatmentRegistryComponent,
    },
] as Routes;
