import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { PreEstimateService } from '../service/pre-estimate.service';
import { IPreEstimate } from '../pre-estimate.model';
import { PreEstimateFormService } from './pre-estimate-form.service';

import { PreEstimateUpdateComponent } from './pre-estimate-update.component';

describe('PreEstimate Management Update Component', () => {
  let comp: PreEstimateUpdateComponent;
  let fixture: ComponentFixture<PreEstimateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let preEstimateFormService: PreEstimateFormService;
  let preEstimateService: PreEstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreEstimateUpdateComponent],
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
      .overrideTemplate(PreEstimateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PreEstimateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    preEstimateFormService = TestBed.inject(PreEstimateFormService);
    preEstimateService = TestBed.inject(PreEstimateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const preEstimate: IPreEstimate = { id: 13604 };

      activatedRoute.data = of({ preEstimate });
      comp.ngOnInit();

      expect(comp.preEstimate).toEqual(preEstimate);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreEstimate>>();
      const preEstimate = { id: 4197 };
      jest.spyOn(preEstimateFormService, 'getPreEstimate').mockReturnValue(preEstimate);
      jest.spyOn(preEstimateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preEstimate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: preEstimate }));
      saveSubject.complete();

      // THEN
      expect(preEstimateFormService.getPreEstimate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(preEstimateService.update).toHaveBeenCalledWith(expect.objectContaining(preEstimate));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreEstimate>>();
      const preEstimate = { id: 4197 };
      jest.spyOn(preEstimateFormService, 'getPreEstimate').mockReturnValue({ id: null });
      jest.spyOn(preEstimateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preEstimate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: preEstimate }));
      saveSubject.complete();

      // THEN
      expect(preEstimateFormService.getPreEstimate).toHaveBeenCalled();
      expect(preEstimateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPreEstimate>>();
      const preEstimate = { id: 4197 };
      jest.spyOn(preEstimateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ preEstimate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(preEstimateService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
