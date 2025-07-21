import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IJobEstimateWorkLog } from 'app/entities/operationsModule/job-estimate-work-log/job-estimate-work-log.model';
import { JobEstimateWorkLogService } from 'app/entities/operationsModule/job-estimate-work-log/service/job-estimate-work-log.service';
import { JobEstimateWorkProductsService } from '../service/job-estimate-work-products.service';
import { IJobEstimateWorkProducts } from '../job-estimate-work-products.model';
import { JobEstimateWorkProductsFormService } from './job-estimate-work-products-form.service';

import { JobEstimateWorkProductsUpdateComponent } from './job-estimate-work-products-update.component';

describe('JobEstimateWorkProducts Management Update Component', () => {
  let comp: JobEstimateWorkProductsUpdateComponent;
  let fixture: ComponentFixture<JobEstimateWorkProductsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobEstimateWorkProductsFormService: JobEstimateWorkProductsFormService;
  let jobEstimateWorkProductsService: JobEstimateWorkProductsService;
  let jobEstimateWorkLogService: JobEstimateWorkLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobEstimateWorkProductsUpdateComponent],
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
      .overrideTemplate(JobEstimateWorkProductsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobEstimateWorkProductsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobEstimateWorkProductsFormService = TestBed.inject(JobEstimateWorkProductsFormService);
    jobEstimateWorkProductsService = TestBed.inject(JobEstimateWorkProductsService);
    jobEstimateWorkLogService = TestBed.inject(JobEstimateWorkLogService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call JobEstimateWorkLog query and add missing value', () => {
      const jobEstimateWorkProducts: IJobEstimateWorkProducts = { id: 253 };
      const jobEstimateWorkLog: IJobEstimateWorkLog = { id: 23087 };
      jobEstimateWorkProducts.jobEstimateWorkLog = jobEstimateWorkLog;

      const jobEstimateWorkLogCollection: IJobEstimateWorkLog[] = [{ id: 23087 }];
      jest.spyOn(jobEstimateWorkLogService, 'query').mockReturnValue(of(new HttpResponse({ body: jobEstimateWorkLogCollection })));
      const additionalJobEstimateWorkLogs = [jobEstimateWorkLog];
      const expectedCollection: IJobEstimateWorkLog[] = [...additionalJobEstimateWorkLogs, ...jobEstimateWorkLogCollection];
      jest.spyOn(jobEstimateWorkLogService, 'addJobEstimateWorkLogToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobEstimateWorkProducts });
      comp.ngOnInit();

      expect(jobEstimateWorkLogService.query).toHaveBeenCalled();
      expect(jobEstimateWorkLogService.addJobEstimateWorkLogToCollectionIfMissing).toHaveBeenCalledWith(
        jobEstimateWorkLogCollection,
        ...additionalJobEstimateWorkLogs.map(expect.objectContaining),
      );
      expect(comp.jobEstimateWorkLogsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const jobEstimateWorkProducts: IJobEstimateWorkProducts = { id: 253 };
      const jobEstimateWorkLog: IJobEstimateWorkLog = { id: 23087 };
      jobEstimateWorkProducts.jobEstimateWorkLog = jobEstimateWorkLog;

      activatedRoute.data = of({ jobEstimateWorkProducts });
      comp.ngOnInit();

      expect(comp.jobEstimateWorkLogsSharedCollection).toContainEqual(jobEstimateWorkLog);
      expect(comp.jobEstimateWorkProducts).toEqual(jobEstimateWorkProducts);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimateWorkProducts>>();
      const jobEstimateWorkProducts = { id: 12305 };
      jest.spyOn(jobEstimateWorkProductsFormService, 'getJobEstimateWorkProducts').mockReturnValue(jobEstimateWorkProducts);
      jest.spyOn(jobEstimateWorkProductsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimateWorkProducts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobEstimateWorkProducts }));
      saveSubject.complete();

      // THEN
      expect(jobEstimateWorkProductsFormService.getJobEstimateWorkProducts).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobEstimateWorkProductsService.update).toHaveBeenCalledWith(expect.objectContaining(jobEstimateWorkProducts));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimateWorkProducts>>();
      const jobEstimateWorkProducts = { id: 12305 };
      jest.spyOn(jobEstimateWorkProductsFormService, 'getJobEstimateWorkProducts').mockReturnValue({ id: null });
      jest.spyOn(jobEstimateWorkProductsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimateWorkProducts: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobEstimateWorkProducts }));
      saveSubject.complete();

      // THEN
      expect(jobEstimateWorkProductsFormService.getJobEstimateWorkProducts).toHaveBeenCalled();
      expect(jobEstimateWorkProductsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimateWorkProducts>>();
      const jobEstimateWorkProducts = { id: 12305 };
      jest.spyOn(jobEstimateWorkProductsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimateWorkProducts });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobEstimateWorkProductsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJobEstimateWorkLog', () => {
      it('should forward to jobEstimateWorkLogService', () => {
        const entity = { id: 23087 };
        const entity2 = { id: 32561 };
        jest.spyOn(jobEstimateWorkLogService, 'compareJobEstimateWorkLog');
        comp.compareJobEstimateWorkLog(entity, entity2);
        expect(jobEstimateWorkLogService.compareJobEstimateWorkLog).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
