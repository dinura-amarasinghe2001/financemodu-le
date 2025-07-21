import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { BinCardService } from '../service/bin-card.service';
import { IBinCard } from '../bin-card.model';
import { BinCardFormService } from './bin-card-form.service';

import { BinCardUpdateComponent } from './bin-card-update.component';

describe('BinCard Management Update Component', () => {
  let comp: BinCardUpdateComponent;
  let fixture: ComponentFixture<BinCardUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let binCardFormService: BinCardFormService;
  let binCardService: BinCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BinCardUpdateComponent],
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
      .overrideTemplate(BinCardUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BinCardUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    binCardFormService = TestBed.inject(BinCardFormService);
    binCardService = TestBed.inject(BinCardService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const binCard: IBinCard = { id: 10495 };

      activatedRoute.data = of({ binCard });
      comp.ngOnInit();

      expect(comp.binCard).toEqual(binCard);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBinCard>>();
      const binCard = { id: 25496 };
      jest.spyOn(binCardFormService, 'getBinCard').mockReturnValue(binCard);
      jest.spyOn(binCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ binCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: binCard }));
      saveSubject.complete();

      // THEN
      expect(binCardFormService.getBinCard).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(binCardService.update).toHaveBeenCalledWith(expect.objectContaining(binCard));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBinCard>>();
      const binCard = { id: 25496 };
      jest.spyOn(binCardFormService, 'getBinCard').mockReturnValue({ id: null });
      jest.spyOn(binCardService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ binCard: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: binCard }));
      saveSubject.complete();

      // THEN
      expect(binCardFormService.getBinCard).toHaveBeenCalled();
      expect(binCardService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBinCard>>();
      const binCard = { id: 25496 };
      jest.spyOn(binCardService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ binCard });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(binCardService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
