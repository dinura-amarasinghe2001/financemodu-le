import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { InventoryBatchesService } from '../service/inventory-batches.service';
import { IInventoryBatches } from '../inventory-batches.model';
import { InventoryBatchesFormService } from './inventory-batches-form.service';

import { InventoryBatchesUpdateComponent } from './inventory-batches-update.component';

describe('InventoryBatches Management Update Component', () => {
  let comp: InventoryBatchesUpdateComponent;
  let fixture: ComponentFixture<InventoryBatchesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let inventoryBatchesFormService: InventoryBatchesFormService;
  let inventoryBatchesService: InventoryBatchesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InventoryBatchesUpdateComponent],
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
      .overrideTemplate(InventoryBatchesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InventoryBatchesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    inventoryBatchesFormService = TestBed.inject(InventoryBatchesFormService);
    inventoryBatchesService = TestBed.inject(InventoryBatchesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const inventoryBatches: IInventoryBatches = { id: 12226 };

      activatedRoute.data = of({ inventoryBatches });
      comp.ngOnInit();

      expect(comp.inventoryBatches).toEqual(inventoryBatches);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInventoryBatches>>();
      const inventoryBatches = { id: 11939 };
      jest.spyOn(inventoryBatchesFormService, 'getInventoryBatches').mockReturnValue(inventoryBatches);
      jest.spyOn(inventoryBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inventoryBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inventoryBatches }));
      saveSubject.complete();

      // THEN
      expect(inventoryBatchesFormService.getInventoryBatches).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(inventoryBatchesService.update).toHaveBeenCalledWith(expect.objectContaining(inventoryBatches));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInventoryBatches>>();
      const inventoryBatches = { id: 11939 };
      jest.spyOn(inventoryBatchesFormService, 'getInventoryBatches').mockReturnValue({ id: null });
      jest.spyOn(inventoryBatchesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inventoryBatches: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: inventoryBatches }));
      saveSubject.complete();

      // THEN
      expect(inventoryBatchesFormService.getInventoryBatches).toHaveBeenCalled();
      expect(inventoryBatchesService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInventoryBatches>>();
      const inventoryBatches = { id: 11939 };
      jest.spyOn(inventoryBatchesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ inventoryBatches });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(inventoryBatchesService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
