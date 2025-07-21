import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { SupplierBankAccountsService } from '../service/supplier-bank-accounts.service';
import { ISupplierBankAccounts } from '../supplier-bank-accounts.model';
import { SupplierBankAccountsFormService } from './supplier-bank-accounts-form.service';

import { SupplierBankAccountsUpdateComponent } from './supplier-bank-accounts-update.component';

describe('SupplierBankAccounts Management Update Component', () => {
  let comp: SupplierBankAccountsUpdateComponent;
  let fixture: ComponentFixture<SupplierBankAccountsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let supplierBankAccountsFormService: SupplierBankAccountsFormService;
  let supplierBankAccountsService: SupplierBankAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SupplierBankAccountsUpdateComponent],
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
      .overrideTemplate(SupplierBankAccountsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupplierBankAccountsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    supplierBankAccountsFormService = TestBed.inject(SupplierBankAccountsFormService);
    supplierBankAccountsService = TestBed.inject(SupplierBankAccountsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const supplierBankAccounts: ISupplierBankAccounts = { id: 31950 };

      activatedRoute.data = of({ supplierBankAccounts });
      comp.ngOnInit();

      expect(comp.supplierBankAccounts).toEqual(supplierBankAccounts);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplierBankAccounts>>();
      const supplierBankAccounts = { id: 26973 };
      jest.spyOn(supplierBankAccountsFormService, 'getSupplierBankAccounts').mockReturnValue(supplierBankAccounts);
      jest.spyOn(supplierBankAccountsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplierBankAccounts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supplierBankAccounts }));
      saveSubject.complete();

      // THEN
      expect(supplierBankAccountsFormService.getSupplierBankAccounts).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(supplierBankAccountsService.update).toHaveBeenCalledWith(expect.objectContaining(supplierBankAccounts));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplierBankAccounts>>();
      const supplierBankAccounts = { id: 26973 };
      jest.spyOn(supplierBankAccountsFormService, 'getSupplierBankAccounts').mockReturnValue({ id: null });
      jest.spyOn(supplierBankAccountsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplierBankAccounts: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supplierBankAccounts }));
      saveSubject.complete();

      // THEN
      expect(supplierBankAccountsFormService.getSupplierBankAccounts).toHaveBeenCalled();
      expect(supplierBankAccountsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplierBankAccounts>>();
      const supplierBankAccounts = { id: 26973 };
      jest.spyOn(supplierBankAccountsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplierBankAccounts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(supplierBankAccountsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
