import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EstimateDetailComponent } from './estimate-detail.component';

describe('Estimate Management Detail Component', () => {
  let comp: EstimateDetailComponent;
  let fixture: ComponentFixture<EstimateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstimateDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./estimate-detail.component').then(m => m.EstimateDetailComponent),
              resolve: { estimate: () => of({ id: 10142 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EstimateDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load estimate on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EstimateDetailComponent);

      // THEN
      expect(instance.estimate()).toEqual(expect.objectContaining({ id: 10142 }));
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
