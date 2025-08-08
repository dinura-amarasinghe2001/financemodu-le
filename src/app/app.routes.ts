import { Route } from "@angular/router";
import { initialDataResolver } from "app/app.resolvers";
import { AuthGuard } from "app/core/auth/guards/auth.guard";
import { NoAuthGuard } from "app/core/auth/guards/noAuth.guard";
import { LayoutComponent } from "app/layout/layout.component";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
  // Redirect empty path to '/example'
  { path: "", pathMatch: "full", redirectTo: "dashboard" },

  // Redirect signed-in user to the '/example'
  //
  // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
  // path. Below is another redirection for that path to redirect the user to the desired
  // location. This is a small convenience to keep all main routes together here on this file.
  { path: "signed-in-redirect", pathMatch: "full", redirectTo: "dashboard" },

  // Auth routes for guests
  {
    path: "",
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "confirmation-required",
        loadChildren: () =>
          import(
            "app/modules/landing/auth/confirmation-required/confirmation-required.routes"
          ),
      },
      {
        path: "forgot-password",
        loadChildren: () =>
          import(
            "app/modules/landing/auth/forgot-password/forgot-password.routes"
          ),
      },
      {
        path: "reset-password",
        loadChildren: () =>
          import(
            "app/modules/landing/auth/reset-password/reset-password.routes"
          ),
      },
      {
        path: "sign-in",
        loadChildren: () =>
          import("app/modules/landing/auth/sign-in/sign-in.routes"),
      },
      {
        path: "sign-up",
        loadChildren: () =>
          import("app/modules/landing/auth/sign-up/sign-up.routes"),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: "",
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "sign-out",
        loadChildren: () =>
          import("app/modules/landing/auth/sign-out/sign-out.routes"),
      },
      {
        path: "unlock-session",
        loadChildren: () =>
          import(
            "app/modules/landing/auth/unlock-session/unlock-session.routes"
          ),
      },
    ],
  },

  // Landing routes
  {
    path: "",
    component: LayoutComponent,
    data: {
      layout: "empty",
    },
    children: [
      {
        path: "home",
        loadChildren: () => import("app/modules/landing/home/home.routes"),
      },
    ],
  },

  // Admin routes
  {
    path: "",
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      {
        path: "example",
        loadChildren: () => import("app/modules/admin/example/example.routes"),
      },
      {
        path: "dashboard",
        loadChildren: () =>
          import("app/modules/admin/dashboard/dashboard.routes"),
      },
      // {
      //   path: "gatepass",
      //   loadChildren: () =>
      //     import("app/modules/admin/gatepass/gatepass.routes"),
      // },

      {
        path: "gatepass",
        loadChildren: () =>
          import("app/modules/admin/gatepass_details/gatepass/gatepass.routes"),
      },

      {
        path: "gatepass-create",
        loadChildren: () =>
          import(
            "app/modules/admin/gatepass_details/gatepass-create/gatepass.create.routes"
          ),
      },

      {
        path: "gatepass-view/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/gatepass_details/gatepass-create/gatepass.create.routes"
          ),
      },

      // {
      //   path: "appointments",
      //   loadChildren: () =>
      //     import("app/modules/admin/appointments/appointments.routes"),
      // },

      {
        path: "appointments_details",
        loadChildren: () =>
          import(
            "app/modules/admin/appointments_details/appointments/appointments.routes"
          ),
      },

      // {
      //   path: "job-cards",
      //   loadChildren: () =>
      //     import("app/modules/admin/job-cards/job-cards.routes"),
      // },

      {
        path: "job-cards",
        loadChildren: () =>
          import(
            "app/modules/admin/jobcards_details/job-cards/job-cards.routes"
          ),
      },

      {
        path: "job-cards-create",
        loadChildren: () =>
          import(
            "app/modules/admin/jobcards_details/job-card-add-wizard/job-cards.create.routes"
          ),
      },

      {
        path: "job-cards-view/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/jobcards_details/job-card-add-wizard/job-cards.create.routes"
          ),
      },

      {
        path: "treatment-registry",
        loadChildren: () =>
          import(
            "app/modules/admin/treatment-registry_details/treatment-registry/treatment-registry.routes"
          ),
      },

      {
        path: "estimates",
        loadChildren: () =>
          import(
            "app/modules/admin/estimates_details/estimates/estimates.routes"
          ),
      },

      {
        path: "create-estimates",
        loadChildren: () =>
          import(
            "app/modules/admin/estimates_details/create-estimate/create-estimates.routes"
          ),
      },

      {
        path: "view-estimate/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/estimates_details/create-estimate/create-estimates.routes"
          ),
      },

      {
        path: "pre-estimates",
        loadChildren: () =>
          import(
            "app/modules/admin/pre-estimates/pre-estimates-list/pre-estimates.routes"
          ),
      },

      {
        path: "pre-estimates-create",
        loadChildren: () =>
          import(
            "app/modules/admin/pre-estimates/pre-estimates-create/pre-estimates.create.routes"
          ),
      },

      {
        path: "pre-estimates-view/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/pre-estimates/pre-estimates-create/pre-estimates.create.routes"
          ),
      },

      {
        path: "pre-estimates-print/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/pre-estimates/pre-estimate-print/pre-estimates.print.routes"
          ),
      },

      {
        path: "invoices",
        loadChildren: () =>
          import("app/modules/admin/invoice_details/invoices/invoice.routes"),
      },

      {
        path: "invoices-create",
        loadChildren: () =>
          import(
            "app/modules/admin/invoice_details/invoice-create/invoice-create.routes"
          ),
      },

      {
        path: "quick-invoices-create",
        loadChildren: () =>
          import(
            "app/modules/admin/invoice_details/quick-invoice-create/quick-invoice-create.routes"
          ),
      },

      {
        path: "invoices-view/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/invoice_details/invoice-create/invoice-create.routes"
          ),
      },

      {
        path: "invoices-print/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/invoice_details/invoice-print/invoice-print.routes"
          ),
      },

      {
        path: "invoices-print-final/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/invoice_details/final-bill/final-bill.routes"
          ),
      },

      {
        path: "invoices-print-customer/:id",
        loadChildren: () =>
          import("app/modules/admin/invoice_details/bill-n/bill-n.routes"),
      },

      {
        path: "owners",
        loadChildren: () =>
          import("app/modules/admin/owners/owners_details/owners.routes"),
      },

      {
        path: "brands",
        loadChildren: () =>
          import(
            "app/modules/admin/vehicle_details/brand_details/brands.routes"
          ),
      },
      {
        path: "models",
        loadChildren: () =>
          import(
            "app/modules/admin/vehicle_details/model_detail/models.routes"
          ),
      },
      {
        path: "vehicles",
        loadChildren: () =>
          import(
            "app/modules/admin/vehicle_details/vehicle_details/vehicles.routes"
          ),
      },
      {
        path: "job-work-items",
        loadChildren: () =>
          import(
            "app/modules/admin/jobcards_details/job-card-product-create/job-cards-product-create.routes"
          ),
      },
      {
        path: "gatepass-print/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/gatepass_details/gatepass-print/gatepass.print.routes"
          ),
      },
      {
        path: "estimate-print/:id",
        loadChildren: () =>
          import(
            "app/modules/admin/estimates_details/pre-estimate-print/pre-estimates.print.routes"
          ),
      },

      //  { path: 'supplier', loadChildren: () => import('app/modules/admin/supplier-details/supplier.routes') },
      {
        path: "grn-print",
        loadChildren: () => import("app/modules/admin/grn-print/modern.routes"),
      },
      {
        path: "supplier",
        loadChildren: () => import("app/modules/supplier/supplier.routes"),
      },
      { path: "grn", loadChildren: () => import("app/modules/grn/grn.routes") },
      {
        path: "grn-create",
        loadChildren: () =>
          import("app/modules/admin/grn-create/grn-create.routes"),
      },
      {
        path: "transaction",
        loadChildren: () => import("app/modules/transaction/transaction.routes"),
      },
            {
        path: "accounttree",
        loadChildren: () => import("app/modules/accounttree/accounttree.routes"),
      },
            {
        path: "accounts",
        loadChildren: () => import("app/modules/accounts/accounts.routes"),
      },
         {
        path: "accountstatement",
        loadChildren: () => import("app/modules/admin/accountstatement/accountstatement.routes"),
      },
      {
        path: "agingreport",
        loadChildren: () => import("app/modules/admin/agingreport/agingreport.routes"),
      },
      {
        path: "agingreport-print",
        loadChildren: () => import("app/modules/admin/agingrportprint/agingrportprint.routes"),
      },{
        path: "trailbalance",
        loadChildren: () => import("app/modules/trailbalance/trailbalance.routes"),
      },
      {
        path: "dayendtransaction",
        loadChildren: () => import("app/modules/dayendtransaction/dayendtransaction.routes"),
      },
      {
        path: "inventory",
        loadChildren: () => import("app/modules/inventory/inventory.routes"),
      },
      {
        path: "bin-card",
        loadChildren: () => import("app/modules/bin-card/bin-card.routes"),
      },
      {
        path: "supplierprofile",
        loadChildren: () =>
          import("app/modules/supplierprofile/supplierprofile.routes"),
      },
      {
        path: "nextpayment",
        loadChildren: () =>
          import("app/modules/nextpayment/nextpayment.routes"),
      },
      {
        path: "category",
        loadChildren: () => import("app/modules/category/category.routes"),
      },
      {
        path: "bin-card-print",
        loadChildren: () =>
          import("app/modules/admin/bincard-print/bincard-print.routes"),
      },
       {
        path: "inventory-export",
        loadChildren: () =>
          import("app/modules/inventory-export/inventory-export.routes"),
      },
    ],
  },
];
