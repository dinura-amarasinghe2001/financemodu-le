import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IBrand } from 'app/entities/operationsModuleCooperation/brand/brand.model';
import { BrandService } from 'app/entities/operationsModuleCooperation/brand/service/brand.service';
import { VehicleModelService } from '../service/vehicle-model.service';
import { IVehicleModel } from '../vehicle-model.model';
import { VehicleModelFormService } from './vehicle-model-form.service';

import { VehicleModelUpdateComponent } from './vehicle-model-update.component';

describe('VehicleModel Management Update Component', () => {
  let comp: VehicleModelUpdateComponent;
  let fixture: ComponentFixture<VehicleModelUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vehicleModelFormService: VehicleModelFormService;
  let vehicleModelService: VehicleModelService;
  let brandService: BrandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehicleModelUpdateComponent],
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
      .overrideTemplate(VehicleModelUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehicleModelUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vehicleModelFormService = TestBed.inject(VehicleModelFormService);
    vehicleModelService = TestBed.inject(VehicleModelService);
    brandService = TestBed.inject(BrandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Brand query and add missing value', () => {
      const vehicleModel: IVehicleModel = { id: 16214 };
      const brand: IBrand = { id: 7763 };
      vehicleModel.brand = brand;

      const brandCollection: IBrand[] = [{ id: 7763 }];
      jest.spyOn(brandService, 'query').mockReturnValue(of(new HttpResponse({ body: brandCollection })));
      const additionalBrands = [brand];
      const expectedCollection: IBrand[] = [...additionalBrands, ...brandCollection];
      jest.spyOn(brandService, 'addBrandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vehicleModel });
      comp.ngOnInit();

      expect(brandService.query).toHaveBeenCalled();
      expect(brandService.addBrandToCollectionIfMissing).toHaveBeenCalledWith(
        brandCollection,
        ...additionalBrands.map(expect.objectContaining),
      );
      expect(comp.brandsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const vehicleModel: IVehicleModel = { id: 16214 };
      const brand: IBrand = { id: 7763 };
      vehicleModel.brand = brand;

      activatedRoute.data = of({ vehicleModel });
      comp.ngOnInit();

      expect(comp.brandsSharedCollection).toContainEqual(brand);
      expect(comp.vehicleModel).toEqual(vehicleModel);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleModel>>();
      const vehicleModel = { id: 21042 };
      jest.spyOn(vehicleModelFormService, 'getVehicleModel').mockReturnValue(vehicleModel);
      jest.spyOn(vehicleModelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleModel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleModel }));
      saveSubject.complete();

      // THEN
      expect(vehicleModelFormService.getVehicleModel).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vehicleModelService.update).toHaveBeenCalledWith(expect.objectContaining(vehicleModel));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleModel>>();
      const vehicleModel = { id: 21042 };
      jest.spyOn(vehicleModelFormService, 'getVehicleModel').mockReturnValue({ id: null });
      jest.spyOn(vehicleModelService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleModel: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleModel }));
      saveSubject.complete();

      // THEN
      expect(vehicleModelFormService.getVehicleModel).toHaveBeenCalled();
      expect(vehicleModelService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleModel>>();
      const vehicleModel = { id: 21042 };
      jest.spyOn(vehicleModelService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleModel });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vehicleModelService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareBrand', () => {
      it('should forward to brandService', () => {
        const entity = { id: 7763 };
        const entity2 = { id: 6898 };
        jest.spyOn(brandService, 'compareBrand');
        comp.compareBrand(entity, entity2);
        expect(brandService.compareBrand).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
