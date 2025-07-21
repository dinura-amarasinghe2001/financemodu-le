import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PreEstimateTreatmentDetailComponent } from './pre-estimate-treatment-detail.component';

describe('PreEstimateTreatment Management Detail Component', () => {
  let comp: PreEstimateTreatmentDetailComponent;
  let fixture: ComponentFixture<PreEstimateTreatmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreEstimateTreatmentDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./pre-estimate-treatment-detail.component').then(m => m.PreEstimateTreatmentDetailComponent),
              resolve: { preEstimateTreatment: () => of({ id: 4710 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PreEstimateTreatmentDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreEstimateTreatmentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load preEstimateTreatment on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PreEstimateTreatmentDetailComponent);

      // THEN
      expect(instance.preEstimateTreatment()).toEqual(expect.objectContaining({ id: 4710 }));
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
