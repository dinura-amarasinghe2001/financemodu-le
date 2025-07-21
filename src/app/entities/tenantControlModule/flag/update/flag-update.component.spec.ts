import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITenant } from 'app/entities/tenantControlModule/tenant/tenant.model';
import { TenantService } from 'app/entities/tenantControlModule/tenant/service/tenant.service';
import { FlagService } from '../service/flag.service';
import { IFlag } from '../flag.model';
import { FlagFormService } from './flag-form.service';

import { FlagUpdateComponent } from './flag-update.component';

describe('Flag Management Update Component', () => {
  let comp: FlagUpdateComponent;
  let fixture: ComponentFixture<FlagUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let flagFormService: FlagFormService;
  let flagService: FlagService;
  let tenantService: TenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FlagUpdateComponent],
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
      .overrideTemplate(FlagUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FlagUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    flagFormService = TestBed.inject(FlagFormService);
    flagService = TestBed.inject(FlagService);
    tenantService = TestBed.inject(TenantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Tenant query and add missing value', () => {
      const flag: IFlag = { id: 28792 };
      const tenant: ITenant = { id: 2662 };
      flag.tenant = tenant;

      const tenantCollection: ITenant[] = [{ id: 2662 }];
      jest.spyOn(tenantService, 'query').mockReturnValue(of(new HttpResponse({ body: tenantCollection })));
      const additionalTenants = [tenant];
      const expectedCollection: ITenant[] = [...additionalTenants, ...tenantCollection];
      jest.spyOn(tenantService, 'addTenantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ flag });
      comp.ngOnInit();

      expect(tenantService.query).toHaveBeenCalled();
      expect(tenantService.addTenantToCollectionIfMissing).toHaveBeenCalledWith(
        tenantCollection,
        ...additionalTenants.map(expect.objectContaining),
      );
      expect(comp.tenantsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const flag: IFlag = { id: 28792 };
      const tenant: ITenant = { id: 2662 };
      flag.tenant = tenant;

      activatedRoute.data = of({ flag });
      comp.ngOnInit();

      expect(comp.tenantsSharedCollection).toContainEqual(tenant);
      expect(comp.flag).toEqual(flag);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFlag>>();
      const flag = { id: 25480 };
      jest.spyOn(flagFormService, 'getFlag').mockReturnValue(flag);
      jest.spyOn(flagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: flag }));
      saveSubject.complete();

      // THEN
      expect(flagFormService.getFlag).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(flagService.update).toHaveBeenCalledWith(expect.objectContaining(flag));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFlag>>();
      const flag = { id: 25480 };
      jest.spyOn(flagFormService, 'getFlag').mockReturnValue({ id: null });
      jest.spyOn(flagService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flag: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: flag }));
      saveSubject.complete();

      // THEN
      expect(flagFormService.getFlag).toHaveBeenCalled();
      expect(flagService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFlag>>();
      const flag = { id: 25480 };
      jest.spyOn(flagService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ flag });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(flagService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTenant', () => {
      it('should forward to tenantService', () => {
        const entity = { id: 2662 };
        const entity2 = { id: 17495 };
        jest.spyOn(tenantService, 'compareTenant');
        comp.compareTenant(entity, entity2);
        expect(tenantService.compareTenant).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
