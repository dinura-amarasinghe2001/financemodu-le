import { Routes } from "@angular/router";
import { ExampleComponent } from "app/modules/admin/example/example.component";
import { JobCardAddWizardComponent } from "./job-card-add-wizard.component";
import { JobcardCreateComponent } from "../jobcard-create/jobcard-create.component";
export default [
  {
    path: "",
    component: JobcardCreateComponent,
  },
] as Routes;
