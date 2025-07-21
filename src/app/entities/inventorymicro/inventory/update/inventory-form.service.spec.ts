import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../inventory.test-samples';

import { InventoryFormService } from './inventory-form.service';

describe('Inventory Form Service', () => {
  let service: InventoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryFormService);
  });

  describe('Service methods', () => {
    describe('createInventoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInventoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            partNumber: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            type: expect.any(Object),
            classification1: expect.any(Object),
            classification2: expect.any(Object),
            classification3: expect.any(Object),
            classification4: expect.any(Object),
            classification5: expect.any(Object),
            unitOfMeasurement: expect.any(Object),
            decimalPlaces: expect.any(Object),
            isAssemblyUnit: expect.any(Object),
            assemblyUnitOf: expect.any(Object),
            reOrderLevel: expect.any(Object),
            lastCost: expect.any(Object),
            lastSellingPrice: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            availableQuantity: expect.any(Object),
            hasBatches: expect.any(Object),
            itemSpecFilePath: expect.any(Object),
            itemImagePath: expect.any(Object),
            returnPrice: expect.any(Object),
            activeItem: expect.any(Object),
            minStock: expect.any(Object),
            maxStock: expect.any(Object),
            dailyAverage: expect.any(Object),
            bufferLevel: expect.any(Object),
            leadTime: expect.any(Object),
            bufferTime: expect.any(Object),
            saftyDays: expect.any(Object),
            accountCode: expect.any(Object),
            accountId: expect.any(Object),
            casePackQty: expect.any(Object),
            isRegistered: expect.any(Object),
            defaultStockLocationId: expect.any(Object),
            rackNo: expect.any(Object),
            commissionEmpId: expect.any(Object),
            checkTypeId: expect.any(Object),
            checkType: expect.any(Object),
            reOrderQty: expect.any(Object),
            notInInvoice: expect.any(Object),
          }),
        );
      });

      it('passing IInventory should create a new form with FormGroup', () => {
        const formGroup = service.createInventoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            code: expect.any(Object),
            partNumber: expect.any(Object),
            name: expect.any(Object),
            description: expect.any(Object),
            type: expect.any(Object),
            classification1: expect.any(Object),
            classification2: expect.any(Object),
            classification3: expect.any(Object),
            classification4: expect.any(Object),
            classification5: expect.any(Object),
            unitOfMeasurement: expect.any(Object),
            decimalPlaces: expect.any(Object),
            isAssemblyUnit: expect.any(Object),
            assemblyUnitOf: expect.any(Object),
            reOrderLevel: expect.any(Object),
            lastCost: expect.any(Object),
            lastSellingPrice: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            availableQuantity: expect.any(Object),
            hasBatches: expect.any(Object),
            itemSpecFilePath: expect.any(Object),
            itemImagePath: expect.any(Object),
            returnPrice: expect.any(Object),
            activeItem: expect.any(Object),
            minStock: expect.any(Object),
            maxStock: expect.any(Object),
            dailyAverage: expect.any(Object),
            bufferLevel: expect.any(Object),
            leadTime: expect.any(Object),
            bufferTime: expect.any(Object),
            saftyDays: expect.any(Object),
            accountCode: expect.any(Object),
            accountId: expect.any(Object),
            casePackQty: expect.any(Object),
            isRegistered: expect.any(Object),
            defaultStockLocationId: expect.any(Object),
            rackNo: expect.any(Object),
            commissionEmpId: expect.any(Object),
            checkTypeId: expect.any(Object),
            checkType: expect.any(Object),
            reOrderQty: expect.any(Object),
            notInInvoice: expect.any(Object),
          }),
        );
      });
    });

    describe('getInventory', () => {
      it('should return NewInventory for default Inventory initial value', () => {
        const formGroup = service.createInventoryFormGroup(sampleWithNewData);

        const inventory = service.getInventory(formGroup) as any;

        expect(inventory).toMatchObject(sampleWithNewData);
      });

      it('should return NewInventory for empty Inventory initial value', () => {
        const formGroup = service.createInventoryFormGroup();

        const inventory = service.getInventory(formGroup) as any;

        expect(inventory).toMatchObject({});
      });

      it('should return IInventory', () => {
        const formGroup = service.createInventoryFormGroup(sampleWithRequiredData);

        const inventory = service.getInventory(formGroup) as any;

        expect(inventory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInventory should not enable id FormControl', () => {
        const formGroup = service.createInventoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInventory should disable id FormControl', () => {
        const formGroup = service.createInventoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
