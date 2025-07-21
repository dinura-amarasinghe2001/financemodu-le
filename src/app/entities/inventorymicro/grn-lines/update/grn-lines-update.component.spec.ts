import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { GRNLinesService } from '../service/grn-lines.service';
import { IGRNLines } from '../grn-lines.model';
import { GRNLinesFormService } from './grn-lines-form.service';

import { GRNLinesUpdateComponent } from './grn-lines-update.component';

describe('GRNLines Management Update Component', () => {
  let comp: GRNLinesUpdateComponent;
  let fixture: ComponentFixture<GRNLinesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gRNLinesFormService: GRNLinesFormService;
  let gRNLinesService: GRNLinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GRNLinesUpdateComponent],
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
      .overrideTemplate(GRNLinesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GRNLinesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gRNLinesFormService = TestBed.inject(GRNLinesFormService);
    gRNLinesService = TestBed.inject(GRNLinesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const gRNLines: IGRNLines = { id: 19021 };

      activatedRoute.data = of({ gRNLines });
      comp.ngOnInit();

      expect(comp.gRNLines).toEqual(gRNLines);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRNLines>>();
      const gRNLines = { id: 1249 };
      jest.spyOn(gRNLinesFormService, 'getGRNLines').mockReturnValue(gRNLines);
      jest.spyOn(gRNLinesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRNLines });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gRNLines }));
      saveSubject.complete();

      // THEN
      expect(gRNLinesFormService.getGRNLines).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gRNLinesService.update).toHaveBeenCalledWith(expect.objectContaining(gRNLines));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRNLines>>();
      const gRNLines = { id: 1249 };
      jest.spyOn(gRNLinesFormService, 'getGRNLines').mockReturnValue({ id: null });
      jest.spyOn(gRNLinesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRNLines: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gRNLines }));
      saveSubject.complete();

      // THEN
      expect(gRNLinesFormService.getGRNLines).toHaveBeenCalled();
      expect(gRNLinesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRNLines>>();
      const gRNLines = { id: 1249 };
      jest.spyOn(gRNLinesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRNLines });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gRNLinesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
