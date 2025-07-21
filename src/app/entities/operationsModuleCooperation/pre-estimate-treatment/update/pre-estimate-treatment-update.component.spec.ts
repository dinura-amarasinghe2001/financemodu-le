import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IPreEstimate } from 'app/entities/operationsModule/pre-estimate/pre-estimate.model';
import { PreEstimateService } from 'app/entities/operationsModule/pre-estimate/service/pre-estimate.service';
import { PreEstimateTreatmentService } from '../service/pre-estimate-treatment.service';
import { IPreEstimateTreatment } from '../pre-estimate-treatment.model';
import { PreEstimateTreatmentFormService } from './pre-estimate-treatment-form.service';

import { PreEstimateTreatmentUpdateComponent } from './pre-estimate-treatment-update.component';

describe('PreEstimateTreatment Management Update Component', () => {
  let comp: PreEstimateTreatmentUpdateComponent;
  let fixture: ComponentFixture<PreEstimateTreatmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let preEstimateTreatmentFormService: PreEstimateTreatmentFormService;
  let preEstimateTreatmentService: PreEstimateTreatmentService;
  let preEstimateService: PreEstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreEstimateTreatmentUpdateComponent],
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
      .overrideTemplate(PreEstimateTreatmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PreEstimateTreatmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    preEstimateTreatmentFormService = TestBed.inject(PreEstimateTreatmentFormService);
    preEstimateTreatmentService = TestBed.inject(PreEstimateTreatmentService);
    preEstimateService = TestBed.inject(PreEstimateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call PreEstimate query and add missing value', () => {
      const preEstimateTreatment: IPreEstimateTreatment = { id: 27853 };
      const preEstimate: IPreEstimate = { id: 4197 };
      preEstimateTreatment.preEstimate = preEstimate;

      const preEstimateCollection: IPreEstimate[] = [{ id: 4197 }];
      jest.spyOn(preEstimateService, 'query').mockReturnValue(of(new HttpResponse({ body: preEstimateCollection })));
      const additionalPreEstimates = [preEstimate];
      const expectedCollection: IPreEstimate[] = [...additionalPreEstimates, ...preEstimateCollection];
      jest.spyOn(preEstimateService, 'addPreEstimateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ preEstimateTreatment });
      comp.ngOnInit();

      expect(preEstimateService.query).toHaveBeenCalled();
      expect(preEstimateService.addPreEstimateToCollectionIfMissing).toHaveBeenCalledWith(
        preEstimateCollection,
        ...additionalPreEstimates.map(expect.objectContaining),
      );
      expect(comp.preEstimatesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const preEstimateTreatment: IPreEstimateTreatment = { id: 27853 };
      const preEstimate: IPreEstimate = { id: 4197 };
      preEstimateTreatment.preEstimate = preEstimate;

      activatedRoute.data = of({ preEstimateTreatment });
      comp.ngOnInit();

      expect(comp.preEstimatesSharedCollection).toContainEqual(preEstimate);
      expect(comp.preEstimateTreatment).toEqual(preEstimateTreatment);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreEstimateTreatment>>();
      const preEstimateTreatment = { id: 4710 };
      jest.spyOn(preEstimateTreatmentFormService, 'getPreEstimateTreatment').mockReturnValue(preEstimateTreatment);
      jest.spyOn(preEstimateTreatmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preEstimateTreatment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: preEstimateTreatment }));
      saveSubject.complete();

      // THEN
      expect(preEstimateTreatmentFormService.getPreEstimateTreatment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(preEstimateTreatmentService.update).toHaveBeenCalledWith(expect.objectContaining(preEstimateTreatment));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreEstimateTreatment>>();
      const preEstimateTreatment = { id: 4710 };
      jest.spyOn(preEstimateTreatmentFormService, 'getPreEstimateTreatment').mockReturnValue({ id: null });
      jest.spyOn(preEstimateTreatmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preEstimateTreatment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: preEstimateTreatment }));
      saveSubject.complete();

      // THEN
      expect(preEstimateTreatmentFormService.getPreEstimateTreatment).toHaveBeenCalled();
      expect(preEstimateTreatmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreEstimateTreatment>>();
      const preEstimateTreatment = { id: 4710 };
      jest.spyOn(preEstimateTreatmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preEstimateTreatment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(preEstimateTreatmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePreEstimate', () => {
      it('should forward to preEstimateService', () => {
        const entity = { id: 4197 };
        const entity2 = { id: 13604 };
        jest.spyOn(preEstimateService, 'comparePreEstimate');
        comp.comparePreEstimate(entity, entity2);
        expect(preEstimateService.comparePreEstimate).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
