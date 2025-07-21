import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GRNLinesDetailComponent } from './grn-lines-detail.component';

describe('GRNLines Management Detail Component', () => {
  let comp: GRNLinesDetailComponent;
  let fixture: ComponentFixture<GRNLinesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GRNLinesDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./grn-lines-detail.component').then(m => m.GRNLinesDetailComponent),
              resolve: { gRNLines: () => of({ id: 1249 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GRNLinesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GRNLinesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gRNLines on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GRNLinesDetailComponent);

      // THEN
      expect(instance.gRNLines()).toEqual(expect.objectContaining({ id: 1249 }));
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
