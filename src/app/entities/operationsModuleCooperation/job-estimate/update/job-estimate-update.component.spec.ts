import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IJobCard } from 'app/entities/operationsModule/job-card/job-card.model';
import { JobCardService } from 'app/entities/operationsModule/job-card/service/job-card.service';
import { JobEstimateService } from '../service/job-estimate.service';
import { IJobEstimate } from '../job-estimate.model';
import { JobEstimateFormService } from './job-estimate-form.service';

import { JobEstimateUpdateComponent } from './job-estimate-update.component';

describe('JobEstimate Management Update Component', () => {
  let comp: JobEstimateUpdateComponent;
  let fixture: ComponentFixture<JobEstimateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobEstimateFormService: JobEstimateFormService;
  let jobEstimateService: JobEstimateService;
  let jobCardService: JobCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobEstimateUpdateComponent],
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
      .overrideTemplate(JobEstimateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobEstimateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobEstimateFormService = TestBed.inject(JobEstimateFormService);
    jobEstimateService = TestBed.inject(JobEstimateService);
    jobCardService = TestBed.inject(JobCardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call JobCard query and add missing value', () => {
      const jobEstimate: IJobEstimate = { id: 15846 };
      const jobCard: IJobCard = { id: 17032 };
      jobEstimate.jobCard = jobCard;

      const jobCardCollection: IJobCard[] = [{ id: 17032 }];
      jest.spyOn(jobCardService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCardCollection })));
      const additionalJobCards = [jobCard];
      const expectedCollection: IJobCard[] = [...additionalJobCards, ...jobCardCollection];
      jest.spyOn(jobCardService, 'addJobCardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobEstimate });
      comp.ngOnInit();

      expect(jobCardService.query).toHaveBeenCalled();
      expect(jobCardService.addJobCardToCollectionIfMissing).toHaveBeenCalledWith(
        jobCardCollection,
        ...additionalJobCards.map(expect.objectContaining),
      );
      expect(comp.jobCardsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const jobEstimate: IJobEstimate = { id: 15846 };
      const jobCard: IJobCard = { id: 17032 };
      jobEstimate.jobCard = jobCard;

      activatedRoute.data = of({ jobEstimate });
      comp.ngOnInit();

      expect(comp.jobCardsSharedCollection).toContainEqual(jobCard);
      expect(comp.jobEstimate).toEqual(jobEstimate);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimate>>();
      const jobEstimate = { id: 25602 };
      jest.spyOn(jobEstimateFormService, 'getJobEstimate').mockReturnValue(jobEstimate);
      jest.spyOn(jobEstimateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobEstimate }));
      saveSubject.complete();

      // THEN
      expect(jobEstimateFormService.getJobEstimate).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobEstimateService.update).toHaveBeenCalledWith(expect.objectContaining(jobEstimate));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimate>>();
      const jobEstimate = { id: 25602 };
      jest.spyOn(jobEstimateFormService, 'getJobEstimate').mockReturnValue({ id: null });
      jest.spyOn(jobEstimateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimate: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobEstimate }));
      saveSubject.complete();

      // THEN
      expect(jobEstimateFormService.getJobEstimate).toHaveBeenCalled();
      expect(jobEstimateService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobEstimate>>();
      const jobEstimate = { id: 25602 };
      jest.spyOn(jobEstimateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobEstimate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobEstimateService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJobCard', () => {
      it('should forward to jobCardService', () => {
        const entity = { id: 17032 };
        const entity2 = { id: 22665 };
        jest.spyOn(jobCardService, 'compareJobCard');
        comp.compareJobCard(entity, entity2);
        expect(jobCardService.compareJobCard).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
