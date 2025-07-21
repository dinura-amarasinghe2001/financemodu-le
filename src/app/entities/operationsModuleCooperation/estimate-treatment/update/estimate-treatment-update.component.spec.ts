import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEstimate } from 'app/entities/operationsModule/estimate/estimate.model';
import { EstimateService } from 'app/entities/operationsModule/estimate/service/estimate.service';
import { EstimateTreatmentService } from '../service/estimate-treatment.service';
import { IEstimateTreatment } from '../estimate-treatment.model';
import { EstimateTreatmentFormService } from './estimate-treatment-form.service';

import { EstimateTreatmentUpdateComponent } from './estimate-treatment-update.component';

describe('EstimateTreatment Management Update Component', () => {
  let comp: EstimateTreatmentUpdateComponent;
  let fixture: ComponentFixture<EstimateTreatmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estimateTreatmentFormService: EstimateTreatmentFormService;
  let estimateTreatmentService: EstimateTreatmentService;
  let estimateService: EstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EstimateTreatmentUpdateComponent],
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
      .overrideTemplate(EstimateTreatmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstimateTreatmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estimateTreatmentFormService = TestBed.inject(EstimateTreatmentFormService);
    estimateTreatmentService = TestBed.inject(EstimateTreatmentService);
    estimateService = TestBed.inject(EstimateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Estimate query and add missing value', () => {
      const estimateTreatment: IEstimateTreatment = { id: 25790 };
      const estimate: IEstimate = { id: 10142 };
      estimateTreatment.estimate = estimate;

      const estimateCollection: IEstimate[] = [{ id: 10142 }];
      jest.spyOn(estimateService, 'query').mockReturnValue(of(new HttpResponse({ body: estimateCollection })));
      const additionalEstimates = [estimate];
      const expectedCollection: IEstimate[] = [...additionalEstimates, ...estimateCollection];
      jest.spyOn(estimateService, 'addEstimateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ estimateTreatment });
      comp.ngOnInit();

      expect(estimateService.query).toHaveBeenCalled();
      expect(estimateService.addEstimateToCollectionIfMissing).toHaveBeenCalledWith(
        estimateCollection,
        ...additionalEstimates.map(expect.objectContaining),
      );
      expect(comp.estimatesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const estimateTreatment: IEstimateTreatment = { id: 25790 };
      const estimate: IEstimate = { id: 10142 };
      estimateTreatment.estimate = estimate;

      activatedRoute.data = of({ estimateTreatment });
      comp.ngOnInit();

      expect(comp.estimatesSharedCollection).toContainEqual(estimate);
      expect(comp.estimateTreatment).toEqual(estimateTreatment);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimateTreatment>>();
      const estimateTreatment = { id: 15317 };
      jest.spyOn(estimateTreatmentFormService, 'getEstimateTreatment').mockReturnValue(estimateTreatment);
      jest.spyOn(estimateTreatmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimateTreatment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimateTreatment }));
      saveSubject.complete();

      // THEN
      expect(estimateTreatmentFormService.getEstimateTreatment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(estimateTreatmentService.update).toHaveBeenCalledWith(expect.objectContaining(estimateTreatment));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimateTreatment>>();
      const estimateTreatment = { id: 15317 };
      jest.spyOn(estimateTreatmentFormService, 'getEstimateTreatment').mockReturnValue({ id: null });
      jest.spyOn(estimateTreatmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimateTreatment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimateTreatment }));
      saveSubject.complete();

      // THEN
      expect(estimateTreatmentFormService.getEstimateTreatment).toHaveBeenCalled();
      expect(estimateTreatmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEstimateTreatment>>();
      const estimateTreatment = { id: 15317 };
      jest.spyOn(estimateTreatmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimateTreatment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estimateTreatmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEstimate', () => {
      it('should forward to estimateService', () => {
        const entity = { id: 10142 };
        const entity2 = { id: 13288 };
        jest.spyOn(estimateService, 'compareEstimate');
        comp.compareEstimate(entity, entity2);
        expect(estimateService.compareEstimate).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
