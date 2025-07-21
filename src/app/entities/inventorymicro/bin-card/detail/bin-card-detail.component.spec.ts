import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { BinCardDetailComponent } from './bin-card-detail.component';

describe('BinCard Management Detail Component', () => {
  let comp: BinCardDetailComponent;
  let fixture: ComponentFixture<BinCardDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BinCardDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./bin-card-detail.component').then(m => m.BinCardDetailComponent),
              resolve: { binCard: () => of({ id: 25496 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BinCardDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BinCardDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load binCard on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BinCardDetailComponent);

      // THEN
      expect(instance.binCard()).toEqual(expect.objectContaining({ id: 25496 }));
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
