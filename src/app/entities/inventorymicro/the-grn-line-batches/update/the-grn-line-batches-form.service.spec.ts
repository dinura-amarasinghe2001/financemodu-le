import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../the-grn-line-batches.test-samples';

import { TheGRNLineBatchesFormService } from './the-grn-line-batches-form.service';

describe('TheGRNLineBatches Form Service', () => {
  let service: TheGRNLineBatchesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TheGRNLineBatchesFormService);
  });

  describe('Service methods', () => {
    describe('createTheGRNLineBatchesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTheGRNLineBatchesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grnId: expect.any(Object),
            lineId: expect.any(Object),
            batchLineId: expect.any(Object),
            itemId: expect.any(Object),
            code: expect.any(Object),
            txDate: expect.any(Object),
            manufactureDate: expect.any(Object),
            expiredDate: expect.any(Object),
            qty: expect.any(Object),
            cost: expect.any(Object),
            price: expect.any(Object),
            costWithoutVat: expect.any(Object),
            priceWithoutVat: expect.any(Object),
            hasVat: expect.any(Object),
            supplierDiscount: expect.any(Object),
            notes: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            batchId: expect.any(Object),
            qtyIn: expect.any(Object),
            qtyOut: expect.any(Object),
            batchLineTotal: expect.any(Object),
            inspected: expect.any(Object),
            passQty: expect.any(Object),
            currentReceivedQty: expect.any(Object),
            totalPassedQty: expect.any(Object),
            isInventoryUpdate: expect.any(Object),
            inventoryQty: expect.any(Object),
            totalInventoryQty: expect.any(Object),
            returnPrice: expect.any(Object),
          }),
        );
      });

      it('passing ITheGRNLineBatches should create a new form with FormGroup', () => {
        const formGroup = service.createTheGRNLineBatchesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grnId: expect.any(Object),
            lineId: expect.any(Object),
            batchLineId: expect.any(Object),
            itemId: expect.any(Object),
            code: expect.any(Object),
            txDate: expect.any(Object),
            manufactureDate: expect.any(Object),
            expiredDate: expect.any(Object),
            qty: expect.any(Object),
            cost: expect.any(Object),
            price: expect.any(Object),
            costWithoutVat: expect.any(Object),
            priceWithoutVat: expect.any(Object),
            hasVat: expect.any(Object),
            supplierDiscount: expect.any(Object),
            notes: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            batchId: expect.any(Object),
            qtyIn: expect.any(Object),
            qtyOut: expect.any(Object),
            batchLineTotal: expect.any(Object),
            inspected: expect.any(Object),
            passQty: expect.any(Object),
            currentReceivedQty: expect.any(Object),
            totalPassedQty: expect.any(Object),
            isInventoryUpdate: expect.any(Object),
            inventoryQty: expect.any(Object),
            totalInventoryQty: expect.any(Object),
            returnPrice: expect.any(Object),
          }),
        );
      });
    });

    describe('getTheGRNLineBatches', () => {
      it('should return NewTheGRNLineBatches for default TheGRNLineBatches initial value', () => {
        const formGroup = service.createTheGRNLineBatchesFormGroup(sampleWithNewData);

        const theGRNLineBatches = service.getTheGRNLineBatches(formGroup) as any;

        expect(theGRNLineBatches).toMatchObject(sampleWithNewData);
      });

      it('should return NewTheGRNLineBatches for empty TheGRNLineBatches initial value', () => {
        const formGroup = service.createTheGRNLineBatchesFormGroup();

        const theGRNLineBatches = service.getTheGRNLineBatches(formGroup) as any;

        expect(theGRNLineBatches).toMatchObject({});
      });

      it('should return ITheGRNLineBatches', () => {
        const formGroup = service.createTheGRNLineBatchesFormGroup(sampleWithRequiredData);

        const theGRNLineBatches = service.getTheGRNLineBatches(formGroup) as any;

        expect(theGRNLineBatches).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITheGRNLineBatches should not enable id FormControl', () => {
        const formGroup = service.createTheGRNLineBatchesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTheGRNLineBatches should disable id FormControl', () => {
        const formGroup = service.createTheGRNLineBatchesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
