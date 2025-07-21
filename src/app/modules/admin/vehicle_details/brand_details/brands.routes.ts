import { Routes } from '@angular/router';
import { ExampleComponent } from 'app/modules/admin/example/example.component';
// import { VehiclesComponent } from './vehicles/vehicles.component';
import { BrandsComponent } from './brands/brands.component';
export default [
    {
        path     : '',
        component: BrandsComponent,
    }
] as Routes;
