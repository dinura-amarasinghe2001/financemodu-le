import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { InvoicePaymentsDetailComponent } from './invoice-payments-detail.component';

describe('InvoicePayments Management Detail Component', () => {
  let comp: InvoicePaymentsDetailComponent;
  let fixture: ComponentFixture<InvoicePaymentsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePaymentsDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./invoice-payments-detail.component').then(m => m.InvoicePaymentsDetailComponent),
              resolve: { invoicePayments: () => of({ id: 1733 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InvoicePaymentsDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaymentsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load invoicePayments on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InvoicePaymentsDetailComponent);

      // THEN
      expect(instance.invoicePayments()).toEqual(expect.objectContaining({ id: 1733 }));
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
