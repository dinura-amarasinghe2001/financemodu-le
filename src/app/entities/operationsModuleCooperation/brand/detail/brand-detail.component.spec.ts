import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { BrandDetailComponent } from './brand-detail.component';

describe('Brand Management Detail Component', () => {
  let comp: BrandDetailComponent;
  let fixture: ComponentFixture<BrandDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./brand-detail.component').then(m => m.BrandDetailComponent),
              resolve: { brand: () => of({ id: 7763 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BrandDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load brand on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BrandDetailComponent);

      // THEN
      expect(instance.brand()).toEqual(expect.objectContaining({ id: 7763 }));
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
