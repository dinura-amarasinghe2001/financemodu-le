import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IOperationalUnit } from 'app/entities/tenantControlModule/operational-unit/operational-unit.model';
import { OperationalUnitService } from 'app/entities/tenantControlModule/operational-unit/service/operational-unit.service';
import { EnabledERPModuleService } from '../service/enabled-erp-module.service';
import { IEnabledERPModule } from '../enabled-erp-module.model';
import { EnabledERPModuleFormService } from './enabled-erp-module-form.service';

import { EnabledERPModuleUpdateComponent } from './enabled-erp-module-update.component';

describe('EnabledERPModule Management Update Component', () => {
  let comp: EnabledERPModuleUpdateComponent;
  let fixture: ComponentFixture<EnabledERPModuleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let enabledERPModuleFormService: EnabledERPModuleFormService;
  let enabledERPModuleService: EnabledERPModuleService;
  let operationalUnitService: OperationalUnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EnabledERPModuleUpdateComponent],
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
      .overrideTemplate(EnabledERPModuleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EnabledERPModuleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    enabledERPModuleFormService = TestBed.inject(EnabledERPModuleFormService);
    enabledERPModuleService = TestBed.inject(EnabledERPModuleService);
    operationalUnitService = TestBed.inject(OperationalUnitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call OperationalUnit query and add missing value', () => {
      const enabledERPModule: IEnabledERPModule = { id: 2252 };
      const operationalUnit: IOperationalUnit = { id: 13401 };
      enabledERPModule.operationalUnit = operationalUnit;

      const operationalUnitCollection: IOperationalUnit[] = [{ id: 13401 }];
      jest.spyOn(operationalUnitService, 'query').mockReturnValue(of(new HttpResponse({ body: operationalUnitCollection })));
      const additionalOperationalUnits = [operationalUnit];
      const expectedCollection: IOperationalUnit[] = [...additionalOperationalUnits, ...operationalUnitCollection];
      jest.spyOn(operationalUnitService, 'addOperationalUnitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ enabledERPModule });
      comp.ngOnInit();

      expect(operationalUnitService.query).toHaveBeenCalled();
      expect(operationalUnitService.addOperationalUnitToCollectionIfMissing).toHaveBeenCalledWith(
        operationalUnitCollection,
        ...additionalOperationalUnits.map(expect.objectContaining),
      );
      expect(comp.operationalUnitsSharedCollection).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const enabledERPModule: IEnabledERPModule = { id: 2252 };
      const operationalUnit: IOperationalUnit = { id: 13401 };
      enabledERPModule.operationalUnit = operationalUnit;

      activatedRoute.data = of({ enabledERPModule });
      comp.ngOnInit();

      expect(comp.operationalUnitsSharedCollection).toContainEqual(operationalUnit);
      expect(comp.enabledERPModule).toEqual(enabledERPModule);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnabledERPModule>>();
      const enabledERPModule = { id: 169 };
      jest.spyOn(enabledERPModuleFormService, 'getEnabledERPModule').mockReturnValue(enabledERPModule);
      jest.spyOn(enabledERPModuleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enabledERPModule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: enabledERPModule }));
      saveSubject.complete();

      // THEN
      expect(enabledERPModuleFormService.getEnabledERPModule).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(enabledERPModuleService.update).toHaveBeenCalledWith(expect.objectContaining(enabledERPModule));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnabledERPModule>>();
      const enabledERPModule = { id: 169 };
      jest.spyOn(enabledERPModuleFormService, 'getEnabledERPModule').mockReturnValue({ id: null });
      jest.spyOn(enabledERPModuleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enabledERPModule: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: enabledERPModule }));
      saveSubject.complete();

      // THEN
      expect(enabledERPModuleFormService.getEnabledERPModule).toHaveBeenCalled();
      expect(enabledERPModuleService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEnabledERPModule>>();
      const enabledERPModule = { id: 169 };
      jest.spyOn(enabledERPModuleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enabledERPModule });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(enabledERPModuleService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOperationalUnit', () => {
      it('should forward to operationalUnitService', () => {
        const entity = { id: 13401 };
        const entity2 = { id: 19869 };
        jest.spyOn(operationalUnitService, 'compareOperationalUnit');
        comp.compareOperationalUnit(entity, entity2);
        expect(operationalUnitService.compareOperationalUnit).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
