import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { ITenant } from 'app/entities/tenantControlModule/tenant/tenant.model';
import { TenantService } from 'app/entities/tenantControlModule/tenant/service/tenant.service';
import { OperationalUnitService } from '../service/operational-unit.service';
import { IOperationalUnit } from '../operational-unit.model';
import { OperationalUnitFormService } from './operational-unit-form.service';

import { OperationalUnitUpdateComponent } from './operational-unit-update.component';

describe('OperationalUnit Management Update Component', () => {
  let comp: OperationalUnitUpdateComponent;
  let fixture: ComponentFixture<OperationalUnitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let operationalUnitFormService: OperationalUnitFormService;
  let operationalUnitService: OperationalUnitService;
  let tenantService: TenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OperationalUnitUpdateComponent],
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
      .overrideTemplate(OperationalUnitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OperationalUnitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    operationalUnitFormService = TestBed.inject(OperationalUnitFormService);
    operationalUnitService = TestBed.inject(OperationalUnitService);
    tenantService = TestBed.inject(TenantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Tenant query and add missing value', () => {
      const operationalUnit: IOperationalUnit = { id: 19869 };
      const tenant: ITenant = { id: 2662 };
      operationalUnit.tenant = tenant;

      const tenantCollection: ITenant[] = [{ id: 2662 }];
      jest.spyOn(tenantService, 'query').mockReturnValue(of(new HttpResponse({ body: tenantCollection })));
      const additionalTenants = [tenant];
      const expectedCollection: ITenant[] = [...additionalTenants, ...tenantCollection];
      jest.spyOn(tenantService, 'addTenantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ operationalUnit });
      comp.ngOnInit();

      expect(tenantService.query).toHaveBeenCalled();
      expect(tenantService.addTenantToCollectionIfMissing).toHaveBeenCalledWith(
        tenantCollection,
        ...additionalTenants.map(expect.objectContaining),
      );
      expect(comp.tenantsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const operationalUnit: IOperationalUnit = { id: 19869 };
      const tenant: ITenant = { id: 2662 };
      operationalUnit.tenant = tenant;

      activatedRoute.data = of({ operationalUnit });
      comp.ngOnInit();

      expect(comp.tenantsSharedCollection).toContainEqual(tenant);
      expect(comp.operationalUnit).toEqual(operationalUnit);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperationalUnit>>();
      const operationalUnit = { id: 13401 };
      jest.spyOn(operationalUnitFormService, 'getOperationalUnit').mockReturnValue(operationalUnit);
      jest.spyOn(operationalUnitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operationalUnit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operationalUnit }));
      saveSubject.complete();

      // THEN
      expect(operationalUnitFormService.getOperationalUnit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(operationalUnitService.update).toHaveBeenCalledWith(expect.objectContaining(operationalUnit));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperationalUnit>>();
      const operationalUnit = { id: 13401 };
      jest.spyOn(operationalUnitFormService, 'getOperationalUnit').mockReturnValue({ id: null });
      jest.spyOn(operationalUnitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operationalUnit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: operationalUnit }));
      saveSubject.complete();

      // THEN
      expect(operationalUnitFormService.getOperationalUnit).toHaveBeenCalled();
      expect(operationalUnitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IOperationalUnit>>();
      const operationalUnit = { id: 13401 };
      jest.spyOn(operationalUnitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ operationalUnit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(operationalUnitService.update).toHaveBeenCalled();
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
