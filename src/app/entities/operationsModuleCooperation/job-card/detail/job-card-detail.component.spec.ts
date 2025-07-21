import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { JobCardDetailComponent } from './job-card-detail.component';

describe('JobCard Management Detail Component', () => {
  let comp: JobCardDetailComponent;
  let fixture: ComponentFixture<JobCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCardDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-card-detail.component').then(m => m.JobCardDetailComponent),
              resolve: { jobCard: () => of({ id: 17032 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(JobCardDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCardDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobCard on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobCardDetailComponent);

      // THEN
      expect(instance.jobCard()).toEqual(expect.objectContaining({ id: 17032 }));
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
