import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobEstimateDetailComponent } from './job-estimate-detail.component';

describe('JobEstimate Management Detail Component', () => {
  let comp: JobEstimateDetailComponent;
  let fixture: ComponentFixture<JobEstimateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEstimateDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-estimate-detail.component').then(m => m.JobEstimateDetailComponent),
              resolve: { jobEstimate: () => of({ id: 25602 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JobEstimateDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobEstimateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobEstimate on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobEstimateDetailComponent);

      // THEN
      expect(instance.jobEstimate()).toEqual(expect.objectContaining({ id: 25602 }));
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
