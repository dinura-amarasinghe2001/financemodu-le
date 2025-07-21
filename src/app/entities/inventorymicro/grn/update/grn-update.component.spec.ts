import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { GRNService } from '../service/grn.service';
import { IGRN } from '../grn.model';
import { GRNFormService } from './grn-form.service';

import { GRNUpdateComponent } from './grn-update.component';

describe('GRN Management Update Component', () => {
  let comp: GRNUpdateComponent;
  let fixture: ComponentFixture<GRNUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gRNFormService: GRNFormService;
  let gRNService: GRNService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GRNUpdateComponent],
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
      .overrideTemplate(GRNUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GRNUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gRNFormService = TestBed.inject(GRNFormService);
    gRNService = TestBed.inject(GRNService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const gRN: IGRN = { id: 21025 };

      activatedRoute.data = of({ gRN });
      comp.ngOnInit();

      expect(comp.gRN).toEqual(gRN);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRN>>();
      const gRN = { id: 11626 };
      jest.spyOn(gRNFormService, 'getGRN').mockReturnValue(gRN);
      jest.spyOn(gRNService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gRN }));
      saveSubject.complete();

      // THEN
      expect(gRNFormService.getGRN).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gRNService.update).toHaveBeenCalledWith(expect.objectContaining(gRN));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRN>>();
      const gRN = { id: 11626 };
      jest.spyOn(gRNFormService, 'getGRN').mockReturnValue({ id: null });
      jest.spyOn(gRNService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRN: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gRN }));
      saveSubject.complete();

      // THEN
      expect(gRNFormService.getGRN).toHaveBeenCalled();
      expect(gRNService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGRN>>();
      const gRN = { id: 11626 };
      jest.spyOn(gRNService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gRN });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gRNService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
