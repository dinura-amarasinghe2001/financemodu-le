import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../grn-line-batches.test-samples';

import { GRNLineBatchesFormService } from './grn-line-batches-form.service';

describe('GRNLineBatches Form Service', () => {
  let service: GRNLineBatchesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GRNLineBatchesFormService);
  });

  describe('Service methods', () => {
    describe('createGRNLineBatchesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGRNLineBatchesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
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

      it('passing IGRNLineBatches should create a new form with FormGroup', () => {
        const formGroup = service.createGRNLineBatchesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
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

    describe('getGRNLineBatches', () => {
      it('should return NewGRNLineBatches for default GRNLineBatches initial value', () => {
        const formGroup = service.createGRNLineBatchesFormGroup(sampleWithNewData);

        const gRNLineBatches = service.getGRNLineBatches(formGroup) as any;

        expect(gRNLineBatches).toMatchObject(sampleWithNewData);
      });

      it('should return NewGRNLineBatches for empty GRNLineBatches initial value', () => {
        const formGroup = service.createGRNLineBatchesFormGroup();

        const gRNLineBatches = service.getGRNLineBatches(formGroup) as any;

        expect(gRNLineBatches).toMatchObject({});
      });

      it('should return IGRNLineBatches', () => {
        const formGroup = service.createGRNLineBatchesFormGroup(sampleWithRequiredData);

        const gRNLineBatches = service.getGRNLineBatches(formGroup) as any;

        expect(gRNLineBatches).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGRNLineBatches should not enable id FormControl', () => {
        const formGroup = service.createGRNLineBatchesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGRNLineBatches should disable id FormControl', () => {
        const formGroup = service.createGRNLineBatchesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
