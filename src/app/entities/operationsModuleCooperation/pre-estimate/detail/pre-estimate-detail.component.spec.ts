import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { PreEstimateDetailComponent } from './pre-estimate-detail.component';

describe('PreEstimate Management Detail Component', () => {
  let comp: PreEstimateDetailComponent;
  let fixture: ComponentFixture<PreEstimateDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreEstimateDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./pre-estimate-detail.component').then(m => m.PreEstimateDetailComponent),
              resolve: { preEstimate: () => of({ id: 4197 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(PreEstimateDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreEstimateDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load preEstimate on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', PreEstimateDetailComponent);

      // THEN
      expect(instance.preEstimate()).toEqual(expect.objectContaining({ id: 4197 }));
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
