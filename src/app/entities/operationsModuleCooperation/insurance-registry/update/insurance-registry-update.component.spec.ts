import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { InsuranceRegistryService } from '../service/insurance-registry.service';
import { IInsuranceRegistry } from '../insurance-registry.model';
import { InsuranceRegistryFormService } from './insurance-registry-form.service';

import { InsuranceRegistryUpdateComponent } from './insurance-registry-update.component';

describe('InsuranceRegistry Management Update Component', () => {
  let comp: InsuranceRegistryUpdateComponent;
  let fixture: ComponentFixture<InsuranceRegistryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let insuranceRegistryFormService: InsuranceRegistryFormService;
  let insuranceRegistryService: InsuranceRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InsuranceRegistryUpdateComponent],
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
      .overrideTemplate(InsuranceRegistryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InsuranceRegistryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    insuranceRegistryFormService = TestBed.inject(InsuranceRegistryFormService);
    insuranceRegistryService = TestBed.inject(InsuranceRegistryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const insuranceRegistry: IInsuranceRegistry = { id: 4538 };

      activatedRoute.data = of({ insuranceRegistry });
      comp.ngOnInit();

      expect(comp.insuranceRegistry).toEqual(insuranceRegistry);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsuranceRegistry>>();
      const insuranceRegistry = { id: 1027 };
      jest.spyOn(insuranceRegistryFormService, 'getInsuranceRegistry').mockReturnValue(insuranceRegistry);
      jest.spyOn(insuranceRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insuranceRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insuranceRegistry }));
      saveSubject.complete();

      // THEN
      expect(insuranceRegistryFormService.getInsuranceRegistry).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(insuranceRegistryService.update).toHaveBeenCalledWith(expect.objectContaining(insuranceRegistry));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsuranceRegistry>>();
      const insuranceRegistry = { id: 1027 };
      jest.spyOn(insuranceRegistryFormService, 'getInsuranceRegistry').mockReturnValue({ id: null });
      jest.spyOn(insuranceRegistryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insuranceRegistry: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: insuranceRegistry }));
      saveSubject.complete();

      // THEN
      expect(insuranceRegistryFormService.getInsuranceRegistry).toHaveBeenCalled();
      expect(insuranceRegistryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInsuranceRegistry>>();
      const insuranceRegistry = { id: 1027 };
      jest.spyOn(insuranceRegistryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ insuranceRegistry });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(insuranceRegistryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
