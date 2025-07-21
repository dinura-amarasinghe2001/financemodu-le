import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ClientRegistryService } from '../service/client-registry.service';
import { IClientRegistry } from '../client-registry.model';
import { ClientRegistryFormService } from './client-registry-form.service';

import { ClientRegistryUpdateComponent } from './client-registry-update.component';

describe('ClientRegistry Management Update Component', () => {
  let comp: ClientRegistryUpdateComponent;
  let fixture: ComponentFixture<ClientRegistryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clientRegistryFormService: ClientRegistryFormService;
  let clientRegistryService: ClientRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClientRegistryUpdateComponent],
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
      .overrideTemplate(ClientRegistryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClientRegistryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clientRegistryFormService = TestBed.inject(ClientRegistryFormService);
    clientRegistryService = TestBed.inject(ClientRegistryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const clientRegistry: IClientRegistry = { id: 23373 };

      activatedRoute.data = of({ clientRegistry });
      comp.ngOnInit();

      expect(comp.clientRegistry).toEqual(clientRegistry);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientRegistry>>();
      const clientRegistry = { id: 7412 };
      jest.spyOn(clientRegistryFormService, 'getClientRegistry').mockReturnValue(clientRegistry);
      jest.spyOn(clientRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientRegistry }));
      saveSubject.complete();

      // THEN
      expect(clientRegistryFormService.getClientRegistry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clientRegistryService.update).toHaveBeenCalledWith(expect.objectContaining(clientRegistry));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientRegistry>>();
      const clientRegistry = { id: 7412 };
      jest.spyOn(clientRegistryFormService, 'getClientRegistry').mockReturnValue({ id: null });
      jest.spyOn(clientRegistryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientRegistry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: clientRegistry }));
      saveSubject.complete();

      // THEN
      expect(clientRegistryFormService.getClientRegistry).toHaveBeenCalled();
      expect(clientRegistryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClientRegistry>>();
      const clientRegistry = { id: 7412 };
      jest.spyOn(clientRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ clientRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clientRegistryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
