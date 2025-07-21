import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { TheGRNLineBatchesService } from '../service/the-grn-line-batches.service';
import { ITheGRNLineBatches } from '../the-grn-line-batches.model';
import { TheGRNLineBatchesFormService } from './the-grn-line-batches-form.service';

import { TheGRNLineBatchesUpdateComponent } from './the-grn-line-batches-update.component';

describe('TheGRNLineBatches Management Update Component', () => {
  let comp: TheGRNLineBatchesUpdateComponent;
  let fixture: ComponentFixture<TheGRNLineBatchesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let theGRNLineBatchesFormService: TheGRNLineBatchesFormService;
  let theGRNLineBatchesService: TheGRNLineBatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TheGRNLineBatchesUpdateComponent],
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
      .overrideTemplate(TheGRNLineBatchesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TheGRNLineBatchesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    theGRNLineBatchesFormService = TestBed.inject(TheGRNLineBatchesFormService);
    theGRNLineBatchesService = TestBed.inject(TheGRNLineBatchesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const theGRNLineBatches: ITheGRNLineBatches = { id: 28645 };

      activatedRoute.data = of({ theGRNLineBatches });
      comp.ngOnInit();

      expect(comp.theGRNLineBatches).toEqual(theGRNLineBatches);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITheGRNLineBatches>>();
      const theGRNLineBatches = { id: 16379 };
      jest.spyOn(theGRNLineBatchesFormService, 'getTheGRNLineBatches').mockReturnValue(theGRNLineBatches);
      jest.spyOn(theGRNLineBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ theGRNLineBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: theGRNLineBatches }));
      saveSubject.complete();

      // THEN
      expect(theGRNLineBatchesFormService.getTheGRNLineBatches).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(theGRNLineBatchesService.update).toHaveBeenCalledWith(expect.objectContaining(theGRNLineBatches));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITheGRNLineBatches>>();
      const theGRNLineBatches = { id: 16379 };
      jest.spyOn(theGRNLineBatchesFormService, 'getTheGRNLineBatches').mockReturnValue({ id: null });
      jest.spyOn(theGRNLineBatchesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ theGRNLineBatches: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: theGRNLineBatches }));
      saveSubject.complete();

      // THEN
      expect(theGRNLineBatchesFormService.getTheGRNLineBatches).toHaveBeenCalled();
      expect(theGRNLineBatchesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITheGRNLineBatches>>();
      const theGRNLineBatches = { id: 16379 };
      jest.spyOn(theGRNLineBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ theGRNLineBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(theGRNLineBatchesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
