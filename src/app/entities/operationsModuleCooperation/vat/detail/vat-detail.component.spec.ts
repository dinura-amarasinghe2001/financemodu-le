import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { VatDetailComponent } from './vat-detail.component';

describe('Vat Management Detail Component', () => {
  let comp: VatDetailComponent;
  let fixture: ComponentFixture<VatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VatDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./vat-detail.component').then(m => m.VatDetailComponent),
              resolve: { vat: () => of({ id: 20394 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VatDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load vat on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VatDetailComponent);

      // THEN
      expect(instance.vat()).toEqual(expect.objectContaining({ id: 20394 }));
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
