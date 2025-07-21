import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { GRNLineBatchesService } from '../service/grn-line-batches.service';
import { IGRNLineBatches } from '../grn-line-batches.model';
import { GRNLineBatchesFormService } from './grn-line-batches-form.service';

import { GRNLineBatchesUpdateComponent } from './grn-line-batches-update.component';

describe('GRNLineBatches Management Update Component', () => {
  let comp: GRNLineBatchesUpdateComponent;
  let fixture: ComponentFixture<GRNLineBatchesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gRNLineBatchesFormService: GRNLineBatchesFormService;
  let gRNLineBatchesService: GRNLineBatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GRNLineBatchesUpdateComponent],
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
      .overrideTemplate(GRNLineBatchesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GRNLineBatchesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gRNLineBatchesFormService = TestBed.inject(GRNLineBatchesFormService);
    gRNLineBatchesService = TestBed.inject(GRNLineBatchesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const gRNLineBatches: IGRNLineBatches = { id: 3940 };

      activatedRoute.data = of({ gRNLineBatches });
      comp.ngOnInit();

      expect(comp.gRNLineBatches).toEqual(gRNLineBatches);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRNLineBatches>>();
      const gRNLineBatches = { id: 25524 };
      jest.spyOn(gRNLineBatchesFormService, 'getGRNLineBatches').mockReturnValue(gRNLineBatches);
      jest.spyOn(gRNLineBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRNLineBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gRNLineBatches }));
      saveSubject.complete();

      // THEN
      expect(gRNLineBatchesFormService.getGRNLineBatches).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gRNLineBatchesService.update).toHaveBeenCalledWith(expect.objectContaining(gRNLineBatches));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRNLineBatches>>();
      const gRNLineBatches = { id: 25524 };
      jest.spyOn(gRNLineBatchesFormService, 'getGRNLineBatches').mockReturnValue({ id: null });
      jest.spyOn(gRNLineBatchesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRNLineBatches: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gRNLineBatches }));
      saveSubject.complete();

      // THEN
      expect(gRNLineBatchesFormService.getGRNLineBatches).toHaveBeenCalled();
      expect(gRNLineBatchesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRNLineBatches>>();
      const gRNLineBatches = { id: 25524 };
      jest.spyOn(gRNLineBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRNLineBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gRNLineBatchesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
