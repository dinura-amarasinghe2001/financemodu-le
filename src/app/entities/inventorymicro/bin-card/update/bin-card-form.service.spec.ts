import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../bin-card.test-samples';

import { BinCardFormService } from './bin-card-form.service';

describe('BinCard Form Service', () => {
  let service: BinCardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BinCardFormService);
  });

  describe('Service methods', () => {
    describe('createBinCardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBinCardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemId: expect.any(Object),
            itemCode: expect.any(Object),
            reference: expect.any(Object),
            txDate: expect.any(Object),
            qtyIn: expect.any(Object),
            qtyOut: expect.any(Object),
            price: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            referenceCode: expect.any(Object),
            recordDate: expect.any(Object),
            batchId: expect.any(Object),
            locationId: expect.any(Object),
            locationCode: expect.any(Object),
            opening: expect.any(Object),
            description: expect.any(Object),
            referenceDoc: expect.any(Object),
          }),
        );
      });

      it('passing IBinCard should create a new form with FormGroup', () => {
        const formGroup = service.createBinCardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            itemId: expect.any(Object),
            itemCode: expect.any(Object),
            reference: expect.any(Object),
            txDate: expect.any(Object),
            qtyIn: expect.any(Object),
            qtyOut: expect.any(Object),
            price: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            referenceCode: expect.any(Object),
            recordDate: expect.any(Object),
            batchId: expect.any(Object),
            locationId: expect.any(Object),
            locationCode: expect.any(Object),
            opening: expect.any(Object),
            description: expect.any(Object),
            referenceDoc: expect.any(Object),
          }),
        );
      });
    });

    describe('getBinCard', () => {
      it('should return NewBinCard for default BinCard initial value', () => {
        const formGroup = service.createBinCardFormGroup(sampleWithNewData);

        const binCard = service.getBinCard(formGroup) as any;

        expect(binCard).toMatchObject(sampleWithNewData);
      });

      it('should return NewBinCard for empty BinCard initial value', () => {
        const formGroup = service.createBinCardFormGroup();

        const binCard = service.getBinCard(formGroup) as any;

        expect(binCard).toMatchObject({});
      });

      it('should return IBinCard', () => {
        const formGroup = service.createBinCardFormGroup(sampleWithRequiredData);

        const binCard = service.getBinCard(formGroup) as any;

        expect(binCard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBinCard should not enable id FormControl', () => {
        const formGroup = service.createBinCardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBinCard should disable id FormControl', () => {
        const formGroup = service.createBinCardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
