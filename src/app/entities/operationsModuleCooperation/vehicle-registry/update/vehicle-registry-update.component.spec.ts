import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { VehicleRegistryService } from '../service/vehicle-registry.service';
import { IVehicleRegistry } from '../vehicle-registry.model';
import { VehicleRegistryFormService } from './vehicle-registry-form.service';

import { VehicleRegistryUpdateComponent } from './vehicle-registry-update.component';

describe('VehicleRegistry Management Update Component', () => {
  let comp: VehicleRegistryUpdateComponent;
  let fixture: ComponentFixture<VehicleRegistryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vehicleRegistryFormService: VehicleRegistryFormService;
  let vehicleRegistryService: VehicleRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehicleRegistryUpdateComponent],
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
      .overrideTemplate(VehicleRegistryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehicleRegistryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vehicleRegistryFormService = TestBed.inject(VehicleRegistryFormService);
    vehicleRegistryService = TestBed.inject(VehicleRegistryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const vehicleRegistry: IVehicleRegistry = { id: 27787 };

      activatedRoute.data = of({ vehicleRegistry });
      comp.ngOnInit();

      expect(comp.vehicleRegistry).toEqual(vehicleRegistry);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleRegistry>>();
      const vehicleRegistry = { id: 17213 };
      jest.spyOn(vehicleRegistryFormService, 'getVehicleRegistry').mockReturnValue(vehicleRegistry);
      jest.spyOn(vehicleRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleRegistry }));
      saveSubject.complete();

      // THEN
      expect(vehicleRegistryFormService.getVehicleRegistry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vehicleRegistryService.update).toHaveBeenCalledWith(expect.objectContaining(vehicleRegistry));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleRegistry>>();
      const vehicleRegistry = { id: 17213 };
      jest.spyOn(vehicleRegistryFormService, 'getVehicleRegistry').mockReturnValue({ id: null });
      jest.spyOn(vehicleRegistryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleRegistry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehicleRegistry }));
      saveSubject.complete();

      // THEN
      expect(vehicleRegistryFormService.getVehicleRegistry).toHaveBeenCalled();
      expect(vehicleRegistryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehicleRegistry>>();
      const vehicleRegistry = { id: 17213 };
      jest.spyOn(vehicleRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehicleRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vehicleRegistryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
