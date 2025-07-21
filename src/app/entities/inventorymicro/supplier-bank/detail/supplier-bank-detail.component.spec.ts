import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { SupplierBankDetailComponent } from './supplier-bank-detail.component';

describe('SupplierBank Management Detail Component', () => {
  let comp: SupplierBankDetailComponent;
  let fixture: ComponentFixture<SupplierBankDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierBankDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./supplier-bank-detail.component').then(m => m.SupplierBankDetailComponent),
              resolve: { supplierBank: () => of({ id: 18075 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SupplierBankDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBankDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load supplierBank on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SupplierBankDetailComponent);

      // THEN
      expect(instance.supplierBank()).toEqual(expect.objectContaining({ id: 18075 }));
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
