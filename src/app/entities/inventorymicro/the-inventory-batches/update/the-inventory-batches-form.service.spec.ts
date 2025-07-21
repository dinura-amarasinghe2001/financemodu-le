import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../the-inventory-batches.test-samples';

import { TheInventoryBatchesFormService } from './the-inventory-batches-form.service';

describe('TheInventoryBatches Form Service', () => {
  let service: TheInventoryBatchesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheInventoryBatchesFormService);
  });

  describe('Service methods', () => {
    describe('createTheInventoryBatchesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTheInventoryBatchesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemId: expect.any(Object),
            grnId: expect.any(Object),
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

      it('passing ITheInventoryBatches should create a new form with FormGroup', () => {
        const formGroup = service.createTheInventoryBatchesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemId: expect.any(Object),
            grnId: expect.any(Object),
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

    describe('getTheInventoryBatches', () => {
      it('should return NewTheInventoryBatches for default TheInventoryBatches initial value', () => {
        const formGroup = service.createTheInventoryBatchesFormGroup(sampleWithNewData);

        const theInventoryBatches = service.getTheInventoryBatches(formGroup) as any;

        expect(theInventoryBatches).toMatchObject(sampleWithNewData);
      });

      it('should return NewTheInventoryBatches for empty TheInventoryBatches initial value', () => {
        const formGroup = service.createTheInventoryBatchesFormGroup();

        const theInventoryBatches = service.getTheInventoryBatches(formGroup) as any;

        expect(theInventoryBatches).toMatchObject({});
      });

      it('should return ITheInventoryBatches', () => {
        const formGroup = service.createTheInventoryBatchesFormGroup(sampleWithRequiredData);

        const theInventoryBatches = service.getTheInventoryBatches(formGroup) as any;

        expect(theInventoryBatches).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITheInventoryBatches should not enable id FormControl', () => {
        const formGroup = service.createTheInventoryBatchesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTheInventoryBatches should disable id FormControl', () => {
        const formGroup = service.createTheInventoryBatchesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
