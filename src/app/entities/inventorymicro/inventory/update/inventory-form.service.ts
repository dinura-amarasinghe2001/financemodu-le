import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IInventory, NewInventory } from '../inventory.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInventory for edit and NewInventoryFormGroupInput for create.
 */
type InventoryFormGroupInput = IInventory | PartialWithRequiredKeyOf<NewInventory>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IInventory | NewInventory> = Omit<T, 'lmd'> & {
  lmd?: string | null;
};

type InventoryFormRawValue = FormValueOf<IInventory>;

type NewInventoryFormRawValue = FormValueOf<NewInventory>;

type InventoryFormDefaults = Pick<
  NewInventory,
  'id' | 'isAssemblyUnit' | 'lmd' | 'hasBatches' | 'activeItem' | 'isRegistered' | 'notInInvoice'
>;

type InventoryFormGroupContent = {
  id: FormControl<InventoryFormRawValue['id'] | NewInventory['id']>;
  code: FormControl<InventoryFormRawValue['code']>;
  partNumber: FormControl<InventoryFormRawValue['partNumber']>;
  name: FormControl<InventoryFormRawValue['name']>;
  description: FormControl<InventoryFormRawValue['description']>;
  type: FormControl<InventoryFormRawValue['type']>;
  classification1: FormControl<InventoryFormRawValue['classification1']>;
  classification2: FormControl<InventoryFormRawValue['classification2']>;
  classification3: FormControl<InventoryFormRawValue['classification3']>;
  classification4: FormControl<InventoryFormRawValue['classification4']>;
  classification5: FormControl<InventoryFormRawValue['classification5']>;
  unitOfMeasurement: FormControl<InventoryFormRawValue['unitOfMeasurement']>;
  decimalPlaces: FormControl<InventoryFormRawValue['decimalPlaces']>;
  isAssemblyUnit: FormControl<InventoryFormRawValue['isAssemblyUnit']>;
  assemblyUnitOf: FormControl<InventoryFormRawValue['assemblyUnitOf']>;
  reOrderLevel: FormControl<InventoryFormRawValue['reOrderLevel']>;
  lastCost: FormControl<InventoryFormRawValue['lastCost']>;
  lastSellingPrice: FormControl<InventoryFormRawValue['lastSellingPrice']>;
  lmu: FormControl<InventoryFormRawValue['lmu']>;
  lmd: FormControl<InventoryFormRawValue['lmd']>;
  availableQuantity: FormControl<InventoryFormRawValue['availableQuantity']>;
  hasBatches: FormControl<InventoryFormRawValue['hasBatches']>;
  itemSpecFilePath: FormControl<InventoryFormRawValue['itemSpecFilePath']>;
  itemImagePath: FormControl<InventoryFormRawValue['itemImagePath']>;
  returnPrice: FormControl<InventoryFormRawValue['returnPrice']>;
  activeItem: FormControl<InventoryFormRawValue['activeItem']>;
  minStock: FormControl<InventoryFormRawValue['minStock']>;
  maxStock: FormControl<InventoryFormRawValue['maxStock']>;
  dailyAverage: FormControl<InventoryFormRawValue['dailyAverage']>;
  bufferLevel: FormControl<InventoryFormRawValue['bufferLevel']>;
  leadTime: FormControl<InventoryFormRawValue['leadTime']>;
  bufferTime: FormControl<InventoryFormRawValue['bufferTime']>;
  saftyDays: FormControl<InventoryFormRawValue['saftyDays']>;
  accountCode: FormControl<InventoryFormRawValue['accountCode']>;
  accountId: FormControl<InventoryFormRawValue['accountId']>;
  casePackQty: FormControl<InventoryFormRawValue['casePackQty']>;
  isRegistered: FormControl<InventoryFormRawValue['isRegistered']>;
  defaultStockLocationId: FormControl<InventoryFormRawValue['defaultStockLocationId']>;
  rackNo: FormControl<InventoryFormRawValue['rackNo']>;
  commissionEmpId: FormControl<InventoryFormRawValue['commissionEmpId']>;
  checkTypeId: FormControl<InventoryFormRawValue['checkTypeId']>;
  checkType: FormControl<InventoryFormRawValue['checkType']>;
  reOrderQty: FormControl<InventoryFormRawValue['reOrderQty']>;
  notInInvoice: FormControl<InventoryFormRawValue['notInInvoice']>;
};

export type InventoryFormGroup = FormGroup<InventoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InventoryFormService {
  createInventoryFormGroup(inventory: InventoryFormGroupInput = { id: null }): InventoryFormGroup {
    const inventoryRawValue = this.convertInventoryToInventoryRawValue({
      ...this.getFormDefaults(),
      ...inventory,
    });
    return new FormGroup<InventoryFormGroupContent>({
      id: new FormControl(
        { value: inventoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      code: new FormControl(inventoryRawValue.code),
      partNumber: new FormControl(inventoryRawValue.partNumber),
      name: new FormControl(inventoryRawValue.name),
      description: new FormControl(inventoryRawValue.description),
      type: new FormControl(inventoryRawValue.type),
      classification1: new FormControl(inventoryRawValue.classification1),
      classification2: new FormControl(inventoryRawValue.classification2),
      classification3: new FormControl(inventoryRawValue.classification3),
      classification4: new FormControl(inventoryRawValue.classification4),
      classification5: new FormControl(inventoryRawValue.classification5),
      unitOfMeasurement: new FormControl(inventoryRawValue.unitOfMeasurement),
      decimalPlaces: new FormControl(inventoryRawValue.decimalPlaces),
      isAssemblyUnit: new FormControl(inventoryRawValue.isAssemblyUnit),
      assemblyUnitOf: new FormControl(inventoryRawValue.assemblyUnitOf),
      reOrderLevel: new FormControl(inventoryRawValue.reOrderLevel),
      lastCost: new FormControl(inventoryRawValue.lastCost),
      lastSellingPrice: new FormControl(inventoryRawValue.lastSellingPrice),
      lmu: new FormControl(inventoryRawValue.lmu),
      lmd: new FormControl(inventoryRawValue.lmd),
      availableQuantity: new FormControl(inventoryRawValue.availableQuantity),
      hasBatches: new FormControl(inventoryRawValue.hasBatches),
      itemSpecFilePath: new FormControl(inventoryRawValue.itemSpecFilePath),
      itemImagePath: new FormControl(inventoryRawValue.itemImagePath),
      returnPrice: new FormControl(inventoryRawValue.returnPrice),
      activeItem: new FormControl(inventoryRawValue.activeItem),
      minStock: new FormControl(inventoryRawValue.minStock),
      maxStock: new FormControl(inventoryRawValue.maxStock),
      dailyAverage: new FormControl(inventoryRawValue.dailyAverage),
      bufferLevel: new FormControl(inventoryRawValue.bufferLevel),
      leadTime: new FormControl(inventoryRawValue.leadTime),
      bufferTime: new FormControl(inventoryRawValue.bufferTime),
      saftyDays: new FormControl(inventoryRawValue.saftyDays),
      accountCode: new FormControl(inventoryRawValue.accountCode),
      accountId: new FormControl(inventoryRawValue.accountId),
      casePackQty: new FormControl(inventoryRawValue.casePackQty),
      isRegistered: new FormControl(inventoryRawValue.isRegistered),
      defaultStockLocationId: new FormControl(inventoryRawValue.defaultStockLocationId),
      rackNo: new FormControl(inventoryRawValue.rackNo),
      commissionEmpId: new FormControl(inventoryRawValue.commissionEmpId),
      checkTypeId: new FormControl(inventoryRawValue.checkTypeId),
      checkType: new FormControl(inventoryRawValue.checkType),
      reOrderQty: new FormControl(inventoryRawValue.reOrderQty),
      notInInvoice: new FormControl(inventoryRawValue.notInInvoice),
    });
  }

  getInventory(form: InventoryFormGroup): IInventory | NewInventory {
    return this.convertInventoryRawValueToInventory(form.getRawValue() as InventoryFormRawValue | NewInventoryFormRawValue);
  }

  resetForm(form: InventoryFormGroup, inventory: InventoryFormGroupInput): void {
    const inventoryRawValue = this.convertInventoryToInventoryRawValue({ ...this.getFormDefaults(), ...inventory });
    form.reset(
      {
        ...inventoryRawValue,
        id: { value: inventoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InventoryFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      isAssemblyUnit: false,
      lmd: currentTime,
      hasBatches: false,
      activeItem: false,
      isRegistered: false,
      notInInvoice: false,
    };
  }

  private convertInventoryRawValueToInventory(rawInventory: InventoryFormRawValue | NewInventoryFormRawValue): IInventory | NewInventory {
    return {
      ...rawInventory,
      lmd: dayjs(rawInventory.lmd, DATE_TIME_FORMAT),
    };
  }

  private convertInventoryToInventoryRawValue(
    inventory: IInventory | (Partial<NewInventory> & InventoryFormDefaults),
  ): InventoryFormRawValue | PartialWithRequiredKeyOf<NewInventoryFormRawValue> {
    return {
      ...inventory,
      lmd: inventory.lmd ? inventory.lmd.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
