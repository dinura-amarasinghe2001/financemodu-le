import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { EstimateService } from '../service/estimate.service';
import { IEstimate } from '../estimate.model';
import { EstimateFormService } from './estimate-form.service';

import { EstimateUpdateComponent } from './estimate-update.component';

describe('Estimate Management Update Component', () => {
  let comp: EstimateUpdateComponent;
  let fixture: ComponentFixture<EstimateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estimateFormService: EstimateFormService;
  let estimateService: EstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EstimateUpdateComponent],
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
      .overrideTemplate(EstimateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstimateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estimateFormService = TestBed.inject(EstimateFormService);
    estimateService = TestBed.inject(EstimateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const estimate: IEstimate = { id: 13288 };

      activatedRoute.data = of({ estimate });
      comp.ngOnInit();

      expect(comp.estimate).toEqual(estimate);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimate>>();
      const estimate = { id: 10142 };
      jest.spyOn(estimateFormService, 'getEstimate').mockReturnValue(estimate);
      jest.spyOn(estimateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimate }));
      saveSubject.complete();

      // THEN
      expect(estimateFormService.getEstimate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estimateService.update).toHaveBeenCalledWith(expect.objectContaining(estimate));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimate>>();
      const estimate = { id: 10142 };
      jest.spyOn(estimateFormService, 'getEstimate').mockReturnValue({ id: null });
      jest.spyOn(estimateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimate }));
      saveSubject.complete();

      // THEN
      expect(estimateFormService.getEstimate).toHaveBeenCalled();
      expect(estimateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimate>>();
      const estimate = { id: 10142 };
      jest.spyOn(estimateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estimateService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
