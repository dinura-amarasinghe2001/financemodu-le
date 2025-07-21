import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { TheInventoryBatchesService } from '../service/the-inventory-batches.service';
import { ITheInventoryBatches } from '../the-inventory-batches.model';
import { TheInventoryBatchesFormService } from './the-inventory-batches-form.service';

import { TheInventoryBatchesUpdateComponent } from './the-inventory-batches-update.component';

describe('TheInventoryBatches Management Update Component', () => {
  let comp: TheInventoryBatchesUpdateComponent;
  let fixture: ComponentFixture<TheInventoryBatchesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let theInventoryBatchesFormService: TheInventoryBatchesFormService;
  let theInventoryBatchesService: TheInventoryBatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TheInventoryBatchesUpdateComponent],
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
      .overrideTemplate(TheInventoryBatchesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TheInventoryBatchesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    theInventoryBatchesFormService = TestBed.inject(TheInventoryBatchesFormService);
    theInventoryBatchesService = TestBed.inject(TheInventoryBatchesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const theInventoryBatches: ITheInventoryBatches = { id: 10142 };

      activatedRoute.data = of({ theInventoryBatches });
      comp.ngOnInit();

      expect(comp.theInventoryBatches).toEqual(theInventoryBatches);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITheInventoryBatches>>();
      const theInventoryBatches = { id: 22239 };
      jest.spyOn(theInventoryBatchesFormService, 'getTheInventoryBatches').mockReturnValue(theInventoryBatches);
      jest.spyOn(theInventoryBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ theInventoryBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: theInventoryBatches }));
      saveSubject.complete();

      // THEN
      expect(theInventoryBatchesFormService.getTheInventoryBatches).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(theInventoryBatchesService.update).toHaveBeenCalledWith(expect.objectContaining(theInventoryBatches));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITheInventoryBatches>>();
      const theInventoryBatches = { id: 22239 };
      jest.spyOn(theInventoryBatchesFormService, 'getTheInventoryBatches').mockReturnValue({ id: null });
      jest.spyOn(theInventoryBatchesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ theInventoryBatches: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: theInventoryBatches }));
      saveSubject.complete();

      // THEN
      expect(theInventoryBatchesFormService.getTheInventoryBatches).toHaveBeenCalled();
      expect(theInventoryBatchesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITheInventoryBatches>>();
      const theInventoryBatches = { id: 22239 };
      jest.spyOn(theInventoryBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ theInventoryBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(theInventoryBatchesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
