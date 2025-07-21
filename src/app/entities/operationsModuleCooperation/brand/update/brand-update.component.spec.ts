import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { BrandService } from '../service/brand.service';
import { IBrand } from '../brand.model';
import { BrandFormService } from './brand-form.service';

import { BrandUpdateComponent } from './brand-update.component';

describe('Brand Management Update Component', () => {
  let comp: BrandUpdateComponent;
  let fixture: ComponentFixture<BrandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let brandFormService: BrandFormService;
  let brandService: BrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrandUpdateComponent],
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
      .overrideTemplate(BrandUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BrandUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    brandFormService = TestBed.inject(BrandFormService);
    brandService = TestBed.inject(BrandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const brand: IBrand = { id: 6898 };

      activatedRoute.data = of({ brand });
      comp.ngOnInit();

      expect(comp.brand).toEqual(brand);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBrand>>();
      const brand = { id: 7763 };
      jest.spyOn(brandFormService, 'getBrand').mockReturnValue(brand);
      jest.spyOn(brandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ brand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: brand }));
      saveSubject.complete();

      // THEN
      expect(brandFormService.getBrand).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(brandService.update).toHaveBeenCalledWith(expect.objectContaining(brand));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBrand>>();
      const brand = { id: 7763 };
      jest.spyOn(brandFormService, 'getBrand').mockReturnValue({ id: null });
      jest.spyOn(brandService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ brand: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: brand }));
      saveSubject.complete();

      // THEN
      expect(brandFormService.getBrand).toHaveBeenCalled();
      expect(brandService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBrand>>();
      const brand = { id: 7763 };
      jest.spyOn(brandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ brand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(brandService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
