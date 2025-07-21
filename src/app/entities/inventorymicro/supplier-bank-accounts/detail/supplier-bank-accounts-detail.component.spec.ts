import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { SupplierBankAccountsDetailComponent } from './supplier-bank-accounts-detail.component';

describe('SupplierBankAccounts Management Detail Component', () => {
  let comp: SupplierBankAccountsDetailComponent;
  let fixture: ComponentFixture<SupplierBankAccountsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierBankAccountsDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./supplier-bank-accounts-detail.component').then(m => m.SupplierBankAccountsDetailComponent),
              resolve: { supplierBankAccounts: () => of({ id: 26973 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(SupplierBankAccountsDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierBankAccountsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load supplierBankAccounts on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', SupplierBankAccountsDetailComponent);

      // THEN
      expect(instance.supplierBankAccounts()).toEqual(expect.objectContaining({ id: 26973 }));
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
