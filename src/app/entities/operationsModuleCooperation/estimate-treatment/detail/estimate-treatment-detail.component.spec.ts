import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstimateTreatmentDetailComponent } from './estimate-treatment-detail.component';

describe('EstimateTreatment Management Detail Component', () => {
  let comp: EstimateTreatmentDetailComponent;
  let fixture: ComponentFixture<EstimateTreatmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimateTreatmentDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./estimate-treatment-detail.component').then(m => m.EstimateTreatmentDetailComponent),
              resolve: { estimateTreatment: () => of({ id: 15317 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EstimateTreatmentDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateTreatmentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load estimateTreatment on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EstimateTreatmentDetailComponent);

      // THEN
      expect(instance.estimateTreatment()).toEqual(expect.objectContaining({ id: 15317 }));
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
