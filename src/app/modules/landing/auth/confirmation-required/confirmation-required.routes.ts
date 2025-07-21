import { Routes } from "@angular/router";
import { AuthConfirmationRequiredComponent } from "app/modules/landing/auth/confirmation-required/confirmation-required.component";

export default [
  {
    path: "",
    component: AuthConfirmationRequiredComponent,
  },
] as Routes;
