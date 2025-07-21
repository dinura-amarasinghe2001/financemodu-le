import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../inventory-batches.test-samples';

import { InventoryBatchesFormService } from './inventory-batches-form.service';

describe('InventoryBatches Form Service', () => {
  let service: InventoryBatchesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryBatchesFormService);
  });

  describe('Service methods', () => {
    describe('createInventoryBatchesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInventoryBatchesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemId: expect.any(Object),
            code: expect.any(Object),
            txDate: expect.any(Object),
            cost: expect.any(Object),
            price: expect.any(Object),
            costWithoutVat: expect.any(Object),
            priceWithoutVat: expect.any(Object),
            notes: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            lineId: expect.any(Object),
            manufactureDate: expect.any(Object),
            expireDate: expect.any(Object),
            quantity: expect.any(Object),
            addedDate: expect.any(Object),
            costTotal: expect.any(Object),
            returnPrice: expect.any(Object),
          }),
        );
      });

      it('passing IInventoryBatches should create a new form with FormGroup', () => {
        const formGroup = service.createInventoryBatchesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemId: expect.any(Object),
            code: expect.any(Object),
            txDate: expect.any(Object),
            cost: expect.any(Object),
            price: expect.any(Object),
            costWithoutVat: expect.any(Object),
            priceWithoutVat: expect.any(Object),
            notes: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            lineId: expect.any(Object),
            manufactureDate: expect.any(Object),
            expireDate: expect.any(Object),
            quantity: expect.any(Object),
            addedDate: expect.any(Object),
            costTotal: expect.any(Object),
            returnPrice: expect.any(Object),
          }),
        );
      });
    });

    describe('getInventoryBatches', () => {
      it('should return NewInventoryBatches for default InventoryBatches initial value', () => {
        const formGroup = service.createInventoryBatchesFormGroup(sampleWithNewData);

        const inventoryBatches = service.getInventoryBatches(formGroup) as any;

        expect(inventoryBatches).toMatchObject(sampleWithNewData);
      });

      it('should return NewInventoryBatches for empty InventoryBatches initial value', () => {
        const formGroup = service.createInventoryBatchesFormGroup();

        const inventoryBatches = service.getInventoryBatches(formGroup) as any;

        expect(inventoryBatches).toMatchObject({});
      });

      it('should return IInventoryBatches', () => {
        const formGroup = service.createInventoryBatchesFormGroup(sampleWithRequiredData);

        const inventoryBatches = service.getInventoryBatches(formGroup) as any;

        expect(inventoryBatches).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInventoryBatches should not enable id FormControl', () => {
        const formGroup = service.createInventoryBatchesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInventoryBatches should disable id FormControl', () => {
        const formGroup = service.createInventoryBatchesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
