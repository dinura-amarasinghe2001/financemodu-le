import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IJobCard } from 'app/entities/operationsModule/job-card/job-card.model';
import { JobCardService } from 'app/entities/operationsModule/job-card/service/job-card.service';
import { GatePassService } from '../service/gate-pass.service';
import { IGatePass } from '../gate-pass.model';
import { GatePassFormService } from './gate-pass-form.service';

import { GatePassUpdateComponent } from './gate-pass-update.component';

describe('GatePass Management Update Component', () => {
  let comp: GatePassUpdateComponent;
  let fixture: ComponentFixture<GatePassUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gatePassFormService: GatePassFormService;
  let gatePassService: GatePassService;
  let jobCardService: JobCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GatePassUpdateComponent],
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
      .overrideTemplate(GatePassUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GatePassUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gatePassFormService = TestBed.inject(GatePassFormService);
    gatePassService = TestBed.inject(GatePassService);
    jobCardService = TestBed.inject(JobCardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call jobCard query and add missing value', () => {
      const gatePass: IGatePass = { id: 17115 };
      const jobCard: IJobCard = { id: 17032 };
      gatePass.jobCard = jobCard;

      const jobCardCollection: IJobCard[] = [{ id: 17032 }];
      jest.spyOn(jobCardService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCardCollection })));
      const expectedCollection: IJobCard[] = [jobCard, ...jobCardCollection];
      jest.spyOn(jobCardService, 'addJobCardToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gatePass });
      comp.ngOnInit();

      expect(jobCardService.query).toHaveBeenCalled();
      expect(jobCardService.addJobCardToCollectionIfMissing).toHaveBeenCalledWith(jobCardCollection, jobCard);
      expect(comp.jobCardsCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const gatePass: IGatePass = { id: 17115 };
      const jobCard: IJobCard = { id: 17032 };
      gatePass.jobCard = jobCard;

      activatedRoute.data = of({ gatePass });
      comp.ngOnInit();

      expect(comp.jobCardsCollection).toContainEqual(jobCard);
      expect(comp.gatePass).toEqual(gatePass);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGatePass>>();
      const gatePass = { id: 23675 };
      jest.spyOn(gatePassFormService, 'getGatePass').mockReturnValue(gatePass);
      jest.spyOn(gatePassService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gatePass });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gatePass }));
      saveSubject.complete();

      // THEN
      expect(gatePassFormService.getGatePass).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gatePassService.update).toHaveBeenCalledWith(expect.objectContaining(gatePass));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGatePass>>();
      const gatePass = { id: 23675 };
      jest.spyOn(gatePassFormService, 'getGatePass').mockReturnValue({ id: null });
      jest.spyOn(gatePassService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gatePass: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gatePass }));
      saveSubject.complete();

      // THEN
      expect(gatePassFormService.getGatePass).toHaveBeenCalled();
      expect(gatePassService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGatePass>>();
      const gatePass = { id: 23675 };
      jest.spyOn(gatePassService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gatePass });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gatePassService.update).toHaveBeenCalled();
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
