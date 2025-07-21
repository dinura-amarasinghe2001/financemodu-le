import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IInvoice } from 'app/entities/operationsModule/invoice/invoice.model';
import { InvoiceService } from 'app/entities/operationsModule/invoice/service/invoice.service';
import { InvoicePaymentsService } from '../service/invoice-payments.service';
import { IInvoicePayments } from '../invoice-payments.model';
import { InvoicePaymentsFormService } from './invoice-payments-form.service';

import { InvoicePaymentsUpdateComponent } from './invoice-payments-update.component';

describe('InvoicePayments Management Update Component', () => {
  let comp: InvoicePaymentsUpdateComponent;
  let fixture: ComponentFixture<InvoicePaymentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let invoicePaymentsFormService: InvoicePaymentsFormService;
  let invoicePaymentsService: InvoicePaymentsService;
  let invoiceService: InvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InvoicePaymentsUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InvoicePaymentsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvoicePaymentsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    invoicePaymentsFormService = TestBed.inject(InvoicePaymentsFormService);
    invoicePaymentsService = TestBed.inject(InvoicePaymentsService);
    invoiceService = TestBed.inject(InvoiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Invoice query and add missing value', () => {
      const invoicePayments: IInvoicePayments = { id: 28754 };
      const invoice: IInvoice = { id: 1362 };
      invoicePayments.invoice = invoice;

      const invoiceCollection: IInvoice[] = [{ id: 1362 }];
      jest.spyOn(invoiceService, 'query').mockReturnValue(of(new HttpResponse({ body: invoiceCollection })));
      const additionalInvoices = [invoice];
      const expectedCollection: IInvoice[] = [...additionalInvoices, ...invoiceCollection];
      jest.spyOn(invoiceService, 'addInvoiceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ invoicePayments });
      comp.ngOnInit();

      expect(invoiceService.query).toHaveBeenCalled();
      expect(invoiceService.addInvoiceToCollectionIfMissing).toHaveBeenCalledWith(
        invoiceCollection,
        ...additionalInvoices.map(expect.objectContaining),
      );
      expect(comp.invoicesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const invoicePayments: IInvoicePayments = { id: 28754 };
      const invoice: IInvoice = { id: 1362 };
      invoicePayments.invoice = invoice;

      activatedRoute.data = of({ invoicePayments });
      comp.ngOnInit();

      expect(comp.invoicesSharedCollection).toContainEqual(invoice);
      expect(comp.invoicePayments).toEqual(invoicePayments);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoicePayments>>();
      const invoicePayments = { id: 1733 };
      jest.spyOn(invoicePaymentsFormService, 'getInvoicePayments').mockReturnValue(invoicePayments);
      jest.spyOn(invoicePaymentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoicePayments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoicePayments }));
      saveSubject.complete();

      // THEN
      expect(invoicePaymentsFormService.getInvoicePayments).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(invoicePaymentsService.update).toHaveBeenCalledWith(expect.objectContaining(invoicePayments));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoicePayments>>();
      const invoicePayments = { id: 1733 };
      jest.spyOn(invoicePaymentsFormService, 'getInvoicePayments').mockReturnValue({ id: null });
      jest.spyOn(invoicePaymentsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoicePayments: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: invoicePayments }));
      saveSubject.complete();

      // THEN
      expect(invoicePaymentsFormService.getInvoicePayments).toHaveBeenCalled();
      expect(invoicePaymentsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvoicePayments>>();
      const invoicePayments = { id: 1733 };
      jest.spyOn(invoicePaymentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ invoicePayments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(invoicePaymentsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareInvoice', () => {
      it('should forward to invoiceService', () => {
        const entity = { id: 1362 };
        const entity2 = { id: 1801 };
        jest.spyOn(invoiceService, 'compareInvoice');
        comp.compareInvoice(entity, entity2);
        expect(invoiceService.compareInvoice).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
