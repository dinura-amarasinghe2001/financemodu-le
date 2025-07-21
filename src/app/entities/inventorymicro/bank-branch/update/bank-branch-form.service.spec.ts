import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../bank-branch.test-samples';

import { BankBranchFormService } from './bank-branch-form.service';

describe('BankBranch Form Service', () => {
  let service: BankBranchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankBranchFormService);
  });

  describe('Service methods', () => {
    describe('createBankBranchFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBankBranchFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            iD: expect.any(Object),
            name: expect.any(Object),
            bankID: expect.any(Object),
          }),
        );
      });

      it('passing IBankBranch should create a new form with FormGroup', () => {
        const formGroup = service.createBankBranchFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            iD: expect.any(Object),
            name: expect.any(Object),
            bankID: expect.any(Object),
          }),
        );
      });
    });

    describe('getBankBranch', () => {
      it('should return NewBankBranch for default BankBranch initial value', () => {
        const formGroup = service.createBankBranchFormGroup(sampleWithNewData);

        const bankBranch = service.getBankBranch(formGroup) as any;

        expect(bankBranch).toMatchObject(sampleWithNewData);
      });

      it('should return NewBankBranch for empty BankBranch initial value', () => {
        const formGroup = service.createBankBranchFormGroup();

        const bankBranch = service.getBankBranch(formGroup) as any;

        expect(bankBranch).toMatchObject({});
      });

      it('should return IBankBranch', () => {
        const formGroup = service.createBankBranchFormGroup(sampleWithRequiredData);

        const bankBranch = service.getBankBranch(formGroup) as any;

        expect(bankBranch).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IBankBranch should not enable id FormControl', () => {
        const formGroup = service.createBankBranchFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewBankBranch should disable id FormControl', () => {
        const formGroup = service.createBankBranchFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
