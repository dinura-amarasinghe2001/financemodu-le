import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../account-type.test-samples';

import { AccountTypeFormService } from './account-type-form.service';

describe('AccountType Form Service', () => {
  let service: AccountTypeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountTypeFormService);
  });

  describe('Service methods', () => {
    describe('createAccountTypeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAccountTypeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            opsUnitID: expect.any(Object),
            type: expect.any(Object),
            code: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            accountTypeValue: expect.any(Object),
            canEdit: expect.any(Object),
          }),
        );
      });

      it('passing IAccountType should create a new form with FormGroup', () => {
        const formGroup = service.createAccountTypeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            opsUnitID: expect.any(Object),
            type: expect.any(Object),
            code: expect.any(Object),
            lmu: expect.any(Object),
            lmd: expect.any(Object),
            accountTypeValue: expect.any(Object),
            canEdit: expect.any(Object),
          }),
        );
      });
    });

    describe('getAccountType', () => {
      it('should return NewAccountType for default AccountType initial value', () => {
        const formGroup = service.createAccountTypeFormGroup(sampleWithNewData);

        const accountType = service.getAccountType(formGroup) as any;

        expect(accountType).toMatchObject(sampleWithNewData);
      });

      it('should return NewAccountType for empty AccountType initial value', () => {
        const formGroup = service.createAccountTypeFormGroup();

        const accountType = service.getAccountType(formGroup) as any;

        expect(accountType).toMatchObject({});
      });

      it('should return IAccountType', () => {
        const formGroup = service.createAccountTypeFormGroup(sampleWithRequiredData);

        const accountType = service.getAccountType(formGroup) as any;

        expect(accountType).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAccountType should not enable id FormControl', () => {
        const formGroup = service.createAccountTypeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAccountType should disable id FormControl', () => {
        const formGroup = service.createAccountTypeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
