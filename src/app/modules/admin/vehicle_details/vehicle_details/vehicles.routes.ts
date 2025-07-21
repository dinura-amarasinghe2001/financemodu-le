import { Routes } from "@angular/router";
import { ExampleComponent } from "app/modules/admin/example/example.component";
import { VehiclesComponent } from "./vehicles/vehicles.component";
export default [
  {
    path: "",
    component: VehiclesComponent,
  },
] as Routes;
