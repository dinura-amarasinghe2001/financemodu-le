import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IVehicleRegistry } from 'app/entities/operationsModule/vehicle-registry/vehicle-registry.model';
import { VehicleRegistryService } from 'app/entities/operationsModule/vehicle-registry/service/vehicle-registry.service';
import { IClientRegistry } from 'app/entities/operationsModule/client-registry/client-registry.model';
import { ClientRegistryService } from 'app/entities/operationsModule/client-registry/service/client-registry.service';
import { IAppointment } from '../appointment.model';
import { AppointmentService } from '../service/appointment.service';
import { AppointmentFormService } from './appointment-form.service';

import { AppointmentUpdateComponent } from './appointment-update.component';

describe('Appointment Management Update Component', () => {
  let comp: AppointmentUpdateComponent;
  let fixture: ComponentFixture<AppointmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let appointmentFormService: AppointmentFormService;
  let appointmentService: AppointmentService;
  let vehicleRegistryService: VehicleRegistryService;
  let clientRegistryService: ClientRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppointmentUpdateComponent],
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
      .overrideTemplate(AppointmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppointmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    appointmentFormService = TestBed.inject(AppointmentFormService);
    appointmentService = TestBed.inject(AppointmentService);
    vehicleRegistryService = TestBed.inject(VehicleRegistryService);
    clientRegistryService = TestBed.inject(ClientRegistryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call vehicleRegistry query and add missing value', () => {
      const appointment: IAppointment = { id: 584 };
      const vehicleRegistry: IVehicleRegistry = { id: 17213 };
      appointment.vehicleRegistry = vehicleRegistry;

      const vehicleRegistryCollection: IVehicleRegistry[] = [{ id: 17213 }];
      jest.spyOn(vehicleRegistryService, 'query').mockReturnValue(of(new HttpResponse({ body: vehicleRegistryCollection })));
      const expectedCollection: IVehicleRegistry[] = [vehicleRegistry, ...vehicleRegistryCollection];
      jest.spyOn(vehicleRegistryService, 'addVehicleRegistryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      expect(vehicleRegistryService.query).toHaveBeenCalled();
      expect(vehicleRegistryService.addVehicleRegistryToCollectionIfMissing).toHaveBeenCalledWith(
        vehicleRegistryCollection,
        vehicleRegistry,
      );
      expect(comp.vehicleRegistriesCollection).toEqual(expectedCollection);
    });

    it('should call clientRegistry query and add missing value', () => {
      const appointment: IAppointment = { id: 584 };
      const clientRegistry: IClientRegistry = { id: 7412 };
      appointment.clientRegistry = clientRegistry;

      const clientRegistryCollection: IClientRegistry[] = [{ id: 7412 }];
      jest.spyOn(clientRegistryService, 'query').mockReturnValue(of(new HttpResponse({ body: clientRegistryCollection })));
      const expectedCollection: IClientRegistry[] = [clientRegistry, ...clientRegistryCollection];
      jest.spyOn(clientRegistryService, 'addClientRegistryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      expect(clientRegistryService.query).toHaveBeenCalled();
      expect(clientRegistryService.addClientRegistryToCollectionIfMissing).toHaveBeenCalledWith(clientRegistryCollection, clientRegistry);
      expect(comp.clientRegistriesCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const appointment: IAppointment = { id: 584 };
      const vehicleRegistry: IVehicleRegistry = { id: 17213 };
      appointment.vehicleRegistry = vehicleRegistry;
      const clientRegistry: IClientRegistry = { id: 7412 };
      appointment.clientRegistry = clientRegistry;

      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      expect(comp.vehicleRegistriesCollection).toContainEqual(vehicleRegistry);
      expect(comp.clientRegistriesCollection).toContainEqual(clientRegistry);
      expect(comp.appointment).toEqual(appointment);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppointment>>();
      const appointment = { id: 3011 };
      jest.spyOn(appointmentFormService, 'getAppointment').mockReturnValue(appointment);
      jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appointment }));
      saveSubject.complete();

      // THEN
      expect(appointmentFormService.getAppointment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(appointmentService.update).toHaveBeenCalledWith(expect.objectContaining(appointment));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppointment>>();
      const appointment = { id: 3011 };
      jest.spyOn(appointmentFormService, 'getAppointment').mockReturnValue({ id: null });
      jest.spyOn(appointmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: appointment }));
      saveSubject.complete();

      // THEN
      expect(appointmentFormService.getAppointment).toHaveBeenCalled();
      expect(appointmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAppointment>>();
      const appointment = { id: 3011 };
      jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ appointment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(appointmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVehicleRegistry', () => {
      it('should forward to vehicleRegistryService', () => {
        const entity = { id: 17213 };
        const entity2 = { id: 27787 };
        jest.spyOn(vehicleRegistryService, 'compareVehicleRegistry');
        comp.compareVehicleRegistry(entity, entity2);
        expect(vehicleRegistryService.compareVehicleRegistry).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClientRegistry', () => {
      it('should forward to clientRegistryService', () => {
        const entity = { id: 7412 };
        const entity2 = { id: 23373 };
        jest.spyOn(clientRegistryService, 'compareClientRegistry');
        comp.compareClientRegistry(entity, entity2);
        expect(clientRegistryService.compareClientRegistry).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
