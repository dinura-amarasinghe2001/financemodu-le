import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobEstimateWorkProductsDetailComponent } from './job-estimate-work-products-detail.component';

describe('JobEstimateWorkProducts Management Detail Component', () => {
  let comp: JobEstimateWorkProductsDetailComponent;
  let fixture: ComponentFixture<JobEstimateWorkProductsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEstimateWorkProductsDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () =>
                import('./job-estimate-work-products-detail.component').then(m => m.JobEstimateWorkProductsDetailComponent),
              resolve: { jobEstimateWorkProducts: () => of({ id: 12305 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JobEstimateWorkProductsDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobEstimateWorkProductsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobEstimateWorkProducts on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobEstimateWorkProductsDetailComponent);

      // THEN
      expect(instance.jobEstimateWorkProducts()).toEqual(expect.objectContaining({ id: 12305 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
