import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GatePassDetailComponent } from './gate-pass-detail.component';

describe('GatePass Management Detail Component', () => {
  let comp: GatePassDetailComponent;
  let fixture: ComponentFixture<GatePassDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatePassDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./gate-pass-detail.component').then(m => m.GatePassDetailComponent),
              resolve: { gatePass: () => of({ id: 23675 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GatePassDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GatePassDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gatePass on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GatePassDetailComponent);

      // THEN
      expect(instance.gatePass()).toEqual(expect.objectContaining({ id: 23675 }));
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
