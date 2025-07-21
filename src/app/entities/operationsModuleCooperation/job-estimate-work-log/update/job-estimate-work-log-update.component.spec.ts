import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IJobEstimate } from 'app/entities/operationsModule/job-estimate/job-estimate.model';
import { JobEstimateService } from 'app/entities/operationsModule/job-estimate/service/job-estimate.service';
import { JobEstimateWorkLogService } from '../service/job-estimate-work-log.service';
import { IJobEstimateWorkLog } from '../job-estimate-work-log.model';
import { JobEstimateWorkLogFormService } from './job-estimate-work-log-form.service';

import { JobEstimateWorkLogUpdateComponent } from './job-estimate-work-log-update.component';

describe('JobEstimateWorkLog Management Update Component', () => {
  let comp: JobEstimateWorkLogUpdateComponent;
  let fixture: ComponentFixture<JobEstimateWorkLogUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobEstimateWorkLogFormService: JobEstimateWorkLogFormService;
  let jobEstimateWorkLogService: JobEstimateWorkLogService;
  let jobEstimateService: JobEstimateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobEstimateWorkLogUpdateComponent],
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
      .overrideTemplate(JobEstimateWorkLogUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobEstimateWorkLogUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobEstimateWorkLogFormService = TestBed.inject(JobEstimateWorkLogFormService);
    jobEstimateWorkLogService = TestBed.inject(JobEstimateWorkLogService);
    jobEstimateService = TestBed.inject(JobEstimateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call JobEstimate query and add missing value', () => {
      const jobEstimateWorkLog: IJobEstimateWorkLog = { id: 32561 };
      const jobEstimate: IJobEstimate = { id: 25602 };
      jobEstimateWorkLog.jobEstimate = jobEstimate;

      const jobEstimateCollection: IJobEstimate[] = [{ id: 25602 }];
      jest.spyOn(jobEstimateService, 'query').mockReturnValue(of(new HttpResponse({ body: jobEstimateCollection })));
      const additionalJobEstimates = [jobEstimate];
      const expectedCollection: IJobEstimate[] = [...additionalJobEstimates, ...jobEstimateCollection];
      jest.spyOn(jobEstimateService, 'addJobEstimateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobEstimateWorkLog });
      comp.ngOnInit();

      expect(jobEstimateService.query).toHaveBeenCalled();
      expect(jobEstimateService.addJobEstimateToCollectionIfMissing).toHaveBeenCalledWith(
        jobEstimateCollection,
        ...additionalJobEstimates.map(expect.objectContaining),
      );
      expect(comp.jobEstimatesSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const jobEstimateWorkLog: IJobEstimateWorkLog = { id: 32561 };
      const jobEstimate: IJobEstimate = { id: 25602 };
      jobEstimateWorkLog.jobEstimate = jobEstimate;

      activatedRoute.data = of({ jobEstimateWorkLog });
      comp.ngOnInit();

      expect(comp.jobEstimatesSharedCollection).toContainEqual(jobEstimate);
      expect(comp.jobEstimateWorkLog).toEqual(jobEstimateWorkLog);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimateWorkLog>>();
      const jobEstimateWorkLog = { id: 23087 };
      jest.spyOn(jobEstimateWorkLogFormService, 'getJobEstimateWorkLog').mockReturnValue(jobEstimateWorkLog);
      jest.spyOn(jobEstimateWorkLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimateWorkLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobEstimateWorkLog }));
      saveSubject.complete();

      // THEN
      expect(jobEstimateWorkLogFormService.getJobEstimateWorkLog).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobEstimateWorkLogService.update).toHaveBeenCalledWith(expect.objectContaining(jobEstimateWorkLog));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimateWorkLog>>();
      const jobEstimateWorkLog = { id: 23087 };
      jest.spyOn(jobEstimateWorkLogFormService, 'getJobEstimateWorkLog').mockReturnValue({ id: null });
      jest.spyOn(jobEstimateWorkLogService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimateWorkLog: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobEstimateWorkLog }));
      saveSubject.complete();

      // THEN
      expect(jobEstimateWorkLogFormService.getJobEstimateWorkLog).toHaveBeenCalled();
      expect(jobEstimateWorkLogService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimateWorkLog>>();
      const jobEstimateWorkLog = { id: 23087 };
      jest.spyOn(jobEstimateWorkLogService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimateWorkLog });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobEstimateWorkLogService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJobEstimate', () => {
      it('should forward to jobEstimateService', () => {
        const entity = { id: 25602 };
        const entity2 = { id: 15846 };
        jest.spyOn(jobEstimateService, 'compareJobEstimate');
        comp.compareJobEstimate(entity, entity2);
        expect(jobEstimateService.compareJobEstimate).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
