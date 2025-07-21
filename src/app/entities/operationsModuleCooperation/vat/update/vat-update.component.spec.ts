import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { VatService } from '../service/vat.service';
import { IVat } from '../vat.model';
import { VatFormService } from './vat-form.service';

import { VatUpdateComponent } from './vat-update.component';

describe('Vat Management Update Component', () => {
  let comp: VatUpdateComponent;
  let fixture: ComponentFixture<VatUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vatFormService: VatFormService;
  let vatService: VatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VatUpdateComponent],
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
      .overrideTemplate(VatUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VatUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vatFormService = TestBed.inject(VatFormService);
    vatService = TestBed.inject(VatService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const vat: IVat = { id: 11094 };

      activatedRoute.data = of({ vat });
      comp.ngOnInit();

      expect(comp.vat).toEqual(vat);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVat>>();
      const vat = { id: 20394 };
      jest.spyOn(vatFormService, 'getVat').mockReturnValue(vat);
      jest.spyOn(vatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vat }));
      saveSubject.complete();

      // THEN
      expect(vatFormService.getVat).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vatService.update).toHaveBeenCalledWith(expect.objectContaining(vat));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVat>>();
      const vat = { id: 20394 };
      jest.spyOn(vatFormService, 'getVat').mockReturnValue({ id: null });
      jest.spyOn(vatService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vat: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vat }));
      saveSubject.complete();

      // THEN
      expect(vatFormService.getVat).toHaveBeenCalled();
      expect(vatService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVat>>();
      const vat = { id: 20394 };
      jest.spyOn(vatService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vat });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vatService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
