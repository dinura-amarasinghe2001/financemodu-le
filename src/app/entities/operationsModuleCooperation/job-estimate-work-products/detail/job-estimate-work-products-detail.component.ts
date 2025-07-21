import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IJobEstimateWorkProducts } from '../job-estimate-work-products.model';

@Component({
  selector: 'jhi-job-estimate-work-products-detail',
  templateUrl: './job-estimate-work-products-detail.component.html',
  imports: [SharedModule, RouterModule],
})
export class JobEstimateWorkProductsDetailComponent {
  jobEstimateWorkProducts = input<IJobEstimateWorkProducts | null>(null);

  previousState(): void {
    window.history.back();
  }
}
