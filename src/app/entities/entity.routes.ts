import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'flag',
    data: { pageTitle: 'Flags' },
    loadChildren: () => import('./tenantControlModule/flag/flag.routes'),
  },
  {
    path: 'tenant',
    data: { pageTitle: 'Tenants' },
    loadChildren: () => import('./tenantControlModule/tenant/tenant.routes'),
  },
  {
    path: 'operational-unit',
    data: { pageTitle: 'OperationalUnits' },
    loadChildren: () => import('./tenantControlModule/operational-unit/operational-unit.routes'),
  },
  {
    path: 'enabled-erp-module',
    data: { pageTitle: 'EnabledERPModules' },
    loadChildren: () => import('./tenantControlModule/enabled-erp-module/enabled-erp-module.routes'),
  },
  {
    path: 'brand',
    data: { pageTitle: 'Brands' },
    loadChildren: () => import('./operationsModuleCooperation/brand/brand.routes'),
  },
  {
    path: 'vehicle-model',
    data: { pageTitle: 'VehicleModels' },
    loadChildren: () => import('./operationsModuleCooperation/vehicle-model/vehicle-model.routes'),
  },
  {
    path: 'vehicle-treatment-registry',
    data: { pageTitle: 'VehicleTreatmentRegistries' },
    loadChildren: () => import('./operationsModuleCooperation/vehicle-treatment-registry/vehicle-treatment-registry.routes'),
  },
  {
    path: 'vehicle-registry',
    data: { pageTitle: 'VehicleRegistries' },
    loadChildren: () => import('./operationsModuleCooperation/vehicle-registry/vehicle-registry.routes'),
  },
  {
    path: 'client-registry',
    data: { pageTitle: 'ClientRegistries' },
    loadChildren: () => import('./operationsModuleCooperation/client-registry/client-registry.routes'),
  },
  {
    path: 'appointment',
    data: { pageTitle: 'Appointments' },
    loadChildren: () => import('./operationsModuleCooperation/appointment/appointment.routes'),
  },
  {
    path: 'insurance-registry',
    data: { pageTitle: 'InsuranceRegistries' },
    loadChildren: () => import('./operationsModuleCooperation/insurance-registry/insurance-registry.routes'),
  },
  {
    path: 'job-card',
    data: { pageTitle: 'JobCards' },
    loadChildren: () => import('./operationsModuleCooperation/job-card/job-card.routes'),
  },
  {
    path: 'job-item-time-estimation',
    data: { pageTitle: 'JobItemTimeEstimations' },
    loadChildren: () => import('./operationsModuleCooperation/job-item-time-estimation/job-item-time-estimation.routes'),
  },
  {
    path: 'job-estimate',
    data: { pageTitle: 'JobEstimates' },
    loadChildren: () => import('./operationsModuleCooperation/job-estimate/job-estimate.routes'),
  },
  {
    path: 'pre-estimate',
    data: { pageTitle: 'PreEstimates' },
    loadChildren: () => import('./operationsModuleCooperation/pre-estimate/pre-estimate.routes'),
  },
  {
    path: 'pre-estimate-treatment',
    data: { pageTitle: 'PreEstimateTreatments' },
    loadChildren: () => import('./operationsModuleCooperation/pre-estimate-treatment/pre-estimate-treatment.routes'),
  },
  {
    path: 'estimate',
    data: { pageTitle: 'Estimates' },
    loadChildren: () => import('./operationsModuleCooperation/estimate/estimate.routes'),
  },
  {
    path: 'estimate-treatment',
    data: { pageTitle: 'EstimateTreatments' },
    loadChildren: () => import('./operationsModuleCooperation/estimate-treatment/estimate-treatment.routes'),
  },
  {
    path: 'gate-pass',
    data: { pageTitle: 'GatePasses' },
    loadChildren: () => import('./operationsModuleCooperation/gate-pass/gate-pass.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
