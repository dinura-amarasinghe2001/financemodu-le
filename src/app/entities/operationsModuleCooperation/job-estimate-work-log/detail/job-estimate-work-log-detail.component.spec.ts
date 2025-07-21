import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobEstimateWorkLogDetailComponent } from './job-estimate-work-log-detail.component';

describe('JobEstimateWorkLog Management Detail Component', () => {
  let comp: JobEstimateWorkLogDetailComponent;
  let fixture: ComponentFixture<JobEstimateWorkLogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobEstimateWorkLogDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-estimate-work-log-detail.component').then(m => m.JobEstimateWorkLogDetailComponent),
              resolve: { jobEstimateWorkLog: () => of({ id: 23087 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JobEstimateWorkLogDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobEstimateWorkLogDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobEstimateWorkLog on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobEstimateWorkLogDetailComponent);

      // THEN
      expect(instance.jobEstimateWorkLog()).toEqual(expect.objectContaining({ id: 23087 }));
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
