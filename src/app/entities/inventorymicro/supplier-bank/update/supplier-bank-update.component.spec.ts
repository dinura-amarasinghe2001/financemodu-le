import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { SupplierBankService } from '../service/supplier-bank.service';
import { ISupplierBank } from '../supplier-bank.model';
import { SupplierBankFormService } from './supplier-bank-form.service';

import { SupplierBankUpdateComponent } from './supplier-bank-update.component';

describe('SupplierBank Management Update Component', () => {
  let comp: SupplierBankUpdateComponent;
  let fixture: ComponentFixture<SupplierBankUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let supplierBankFormService: SupplierBankFormService;
  let supplierBankService: SupplierBankService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SupplierBankUpdateComponent],
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
      .overrideTemplate(SupplierBankUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SupplierBankUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    supplierBankFormService = TestBed.inject(SupplierBankFormService);
    supplierBankService = TestBed.inject(SupplierBankService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const supplierBank: ISupplierBank = { id: 12824 };

      activatedRoute.data = of({ supplierBank });
      comp.ngOnInit();

      expect(comp.supplierBank).toEqual(supplierBank);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplierBank>>();
      const supplierBank = { id: 18075 };
      jest.spyOn(supplierBankFormService, 'getSupplierBank').mockReturnValue(supplierBank);
      jest.spyOn(supplierBankService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplierBank });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supplierBank }));
      saveSubject.complete();

      // THEN
      expect(supplierBankFormService.getSupplierBank).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(supplierBankService.update).toHaveBeenCalledWith(expect.objectContaining(supplierBank));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplierBank>>();
      const supplierBank = { id: 18075 };
      jest.spyOn(supplierBankFormService, 'getSupplierBank').mockReturnValue({ id: null });
      jest.spyOn(supplierBankService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplierBank: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: supplierBank }));
      saveSubject.complete();

      // THEN
      expect(supplierBankFormService.getSupplierBank).toHaveBeenCalled();
      expect(supplierBankService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISupplierBank>>();
      const supplierBank = { id: 18075 };
      jest.spyOn(supplierBankService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ supplierBank });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(supplierBankService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
