import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { JobCardService } from '../service/job-card.service';
import { IJobCard } from '../job-card.model';
import { JobCardFormService } from './job-card-form.service';

import { JobCardUpdateComponent } from './job-card-update.component';

describe('JobCard Management Update Component', () => {
  let comp: JobCardUpdateComponent;
  let fixture: ComponentFixture<JobCardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let jobCardFormService: JobCardFormService;
  let jobCardService: JobCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobCardUpdateComponent],
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
      .overrideTemplate(JobCardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(JobCardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobCardFormService = TestBed.inject(JobCardFormService);
    jobCardService = TestBed.inject(JobCardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const jobCard: IJobCard = { id: 22665 };

      activatedRoute.data = of({ jobCard });
      comp.ngOnInit();

      expect(comp.jobCard).toEqual(jobCard);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCard>>();
      const jobCard = { id: 17032 };
      jest.spyOn(jobCardFormService, 'getJobCard').mockReturnValue(jobCard);
      jest.spyOn(jobCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCard }));
      saveSubject.complete();

      // THEN
      expect(jobCardFormService.getJobCard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobCardService.update).toHaveBeenCalledWith(expect.objectContaining(jobCard));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCard>>();
      const jobCard = { id: 17032 };
      jest.spyOn(jobCardFormService, 'getJobCard').mockReturnValue({ id: null });
      jest.spyOn(jobCardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobCard }));
      saveSubject.complete();

      // THEN
      expect(jobCardFormService.getJobCard).toHaveBeenCalled();
      expect(jobCardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobCard>>();
      const jobCard = { id: 17032 };
      jest.spyOn(jobCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobCardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
