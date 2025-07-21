import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../grn-lines.test-samples';

import { GRNLinesFormService } from './grn-lines-form.service';

describe('GRNLines Form Service', () => {
  let service: GRNLinesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GRNLinesFormService);
  });

  describe('Service methods', () => {
    describe('createGRNLinesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGRNLinesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grnId: expect.any(Object),
            lineId: expect.any(Object),
            itemId: expect.any(Object),
            itemCode: expect.any(Object),
            itemName: expect.any(Object),
            description: expect.any(Object),
            unitOfMeasurement: expect.any(Object),
            quantity: expect.any(Object),
            receivedQuantity: expect.any(Object),
            price: expect.any(Object),
            totalAmount: expect.any(Object),
            lineTotal: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            inspected: expect.any(Object),
            passQty: expect.any(Object),
            currentReceivedQty: expect.any(Object),
            totalPassedQty: expect.any(Object),
            isInventoryUpdate: expect.any(Object),
            inventoryQty: expect.any(Object),
            totalInventoryQty: expect.any(Object),
          }),
        );
      });

      it('passing IGRNLines should create a new form with FormGroup', () => {
        const formGroup = service.createGRNLinesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            grnId: expect.any(Object),
            lineId: expect.any(Object),
            itemId: expect.any(Object),
            itemCode: expect.any(Object),
            itemName: expect.any(Object),
            description: expect.any(Object),
            unitOfMeasurement: expect.any(Object),
            quantity: expect.any(Object),
            receivedQuantity: expect.any(Object),
            price: expect.any(Object),
            totalAmount: expect.any(Object),
            lineTotal: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            inspected: expect.any(Object),
            passQty: expect.any(Object),
            currentReceivedQty: expect.any(Object),
            totalPassedQty: expect.any(Object),
            isInventoryUpdate: expect.any(Object),
            inventoryQty: expect.any(Object),
            totalInventoryQty: expect.any(Object),
          }),
        );
      });
    });

    describe('getGRNLines', () => {
      it('should return NewGRNLines for default GRNLines initial value', () => {
        const formGroup = service.createGRNLinesFormGroup(sampleWithNewData);

        const gRNLines = service.getGRNLines(formGroup) as any;

        expect(gRNLines).toMatchObject(sampleWithNewData);
      });

      it('should return NewGRNLines for empty GRNLines initial value', () => {
        const formGroup = service.createGRNLinesFormGroup();

        const gRNLines = service.getGRNLines(formGroup) as any;

        expect(gRNLines).toMatchObject({});
      });

      it('should return IGRNLines', () => {
        const formGroup = service.createGRNLinesFormGroup(sampleWithRequiredData);

        const gRNLines = service.getGRNLines(formGroup) as any;

        expect(gRNLines).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGRNLines should not enable id FormControl', () => {
        const formGroup = service.createGRNLinesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGRNLines should disable id FormControl', () => {
        const formGroup = service.createGRNLinesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
