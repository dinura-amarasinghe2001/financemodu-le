import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobItemTimeEstimationDetailComponent } from './job-item-time-estimation-detail.component';

describe('JobItemTimeEstimation Management Detail Component', () => {
  let comp: JobItemTimeEstimationDetailComponent;
  let fixture: ComponentFixture<JobItemTimeEstimationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobItemTimeEstimationDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-item-time-estimation-detail.component').then(m => m.JobItemTimeEstimationDetailComponent),
              resolve: { jobItemTimeEstimation: () => of({ id: 23103 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JobItemTimeEstimationDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobItemTimeEstimationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobItemTimeEstimation on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobItemTimeEstimationDetailComponent);

      // THEN
      expect(instance.jobItemTimeEstimation()).toEqual(expect.objectContaining({ id: 23103 }));
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
