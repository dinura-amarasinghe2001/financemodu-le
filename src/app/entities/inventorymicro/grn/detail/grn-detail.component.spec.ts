import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GRNDetailComponent } from './grn-detail.component';

describe('GRN Management Detail Component', () => {
  let comp: GRNDetailComponent;
  let fixture: ComponentFixture<GRNDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GRNDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./grn-detail.component').then(m => m.GRNDetailComponent),
              resolve: { gRN: () => of({ id: 11626 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GRNDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GRNDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gRN on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GRNDetailComponent);

      // THEN
      expect(instance.gRN()).toEqual(expect.objectContaining({ id: 11626 }));
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
