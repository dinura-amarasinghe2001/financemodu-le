import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IVehicleModel } from 'app/entities/operationsModule/vehicle-model/vehicle-model.model';
import { VehicleModelService } from 'app/entities/operationsModule/vehicle-model/service/vehicle-model.service';
import { VehicleTreatmentRegistryService } from '../service/vehicle-treatment-registry.service';
import { IVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';
import { VehicleTreatmentRegistryFormService } from './vehicle-treatment-registry-form.service';

import { VehicleTreatmentRegistryUpdateComponent } from './vehicle-treatment-registry-update.component';

describe('VehicleTreatmentRegistry Management Update Component', () => {
  let comp: VehicleTreatmentRegistryUpdateComponent;
  let fixture: ComponentFixture<VehicleTreatmentRegistryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vehicleTreatmentRegistryFormService: VehicleTreatmentRegistryFormService;
  let vehicleTreatmentRegistryService: VehicleTreatmentRegistryService;
  let vehicleModelService: VehicleModelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehicleTreatmentRegistryUpdateComponent],
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
      .overrideTemplate(VehicleTreatmentRegistryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehicleTreatmentRegistryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vehicleTreatmentRegistryFormService = TestBed.inject(VehicleTreatmentRegistryFormService);
    vehicleTreatmentRegistryService = TestBed.inject(VehicleTreatmentRegistryService);
    vehicleModelService = TestBed.inject(VehicleModelService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call VehicleModel query and add missing value', () => {
      const vehicleTreatmentRegistry: IVehicleTreatmentRegistry = { id: 30356 };
      const vehicleModel: IVehicleModel = { id: 21042 };
      vehicleTreatmentRegistry.vehicleModel = vehicleModel;

      const vehicleModelCollection: IVehicleModel[] = [{ id: 21042 }];
      jest.spyOn(vehicleModelService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleModelCollection })));
      const additionalVehicleModels = [vehicleModel];
      const expectedCollection: IVehicleModel[] = [...additionalVehicleModels, ...vehicleModelCollection];
      jest.spyOn(vehicleModelService, 'addVehicleModelToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ vehicleTreatmentRegistry });
      comp.ngOnInit();

      expect(vehicleModelService.query).toHaveBeenCalled();
      expect(vehicleModelService.addVehicleModelToCollectionIfMissing).toHaveBeenCalledWith(
        vehicleModelCollection,
        ...additionalVehicleModels.map(expect.objectContaining),
      );
      expect(comp.vehicleModelsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const vehicleTreatmentRegistry: IVehicleTreatmentRegistry = { id: 30356 };
      const vehicleModel: IVehicleModel = { id: 21042 };
      vehicleTreatmentRegistry.vehicleModel = vehicleModel;

      activatedRoute.data = of({ vehicleTreatmentRegistry });
      comp.ngOnInit();

      expect(comp.vehicleModelsSharedCollection).toContainEqual(vehicleModel);
      expect(comp.vehicleTreatmentRegistry).toEqual(vehicleTreatmentRegistry);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleTreatmentRegistry>>();
      const vehicleTreatmentRegistry = { id: 18463 };
      jest.spyOn(vehicleTreatmentRegistryFormService, 'getVehicleTreatmentRegistry').mockReturnValue(vehicleTreatmentRegistry);
      jest.spyOn(vehicleTreatmentRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleTreatmentRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleTreatmentRegistry }));
      saveSubject.complete();

      // THEN
      expect(vehicleTreatmentRegistryFormService.getVehicleTreatmentRegistry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vehicleTreatmentRegistryService.update).toHaveBeenCalledWith(expect.objectContaining(vehicleTreatmentRegistry));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleTreatmentRegistry>>();
      const vehicleTreatmentRegistry = { id: 18463 };
      jest.spyOn(vehicleTreatmentRegistryFormService, 'getVehicleTreatmentRegistry').mockReturnValue({ id: null });
      jest.spyOn(vehicleTreatmentRegistryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleTreatmentRegistry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleTreatmentRegistry }));
      saveSubject.complete();

      // THEN
      expect(vehicleTreatmentRegistryFormService.getVehicleTreatmentRegistry).toHaveBeenCalled();
      expect(vehicleTreatmentRegistryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleTreatmentRegistry>>();
      const vehicleTreatmentRegistry = { id: 18463 };
      jest.spyOn(vehicleTreatmentRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleTreatmentRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vehicleTreatmentRegistryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVehicleModel', () => {
      it('should forward to vehicleModelService', () => {
        const entity = { id: 21042 };
        const entity2 = { id: 16214 };
        jest.spyOn(vehicleModelService, 'compareVehicleModel');
        comp.compareVehicleModel(entity, entity2);
        expect(vehicleModelService.compareVehicleModel).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
