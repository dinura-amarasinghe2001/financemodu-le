import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../client-registry.test-samples';

import { ClientRegistryFormService } from './client-registry-form.service';

describe('ClientRegistry Form Service', () => {
  let service: ClientRegistryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientRegistryFormService);
  });

  describe('Service methods', () => {
    describe('createClientRegistryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createClientRegistryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            lastVehicleID: expect.any(Object),
            lastReceiptID: expect.any(Object),
            address: expect.any(Object),
            city: expect.any(Object),
            contactNumber1: expect.any(Object),
            contactNumber2: expect.any(Object),
            email: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IClientRegistry should create a new form with FormGroup', () => {
        const formGroup = service.createClientRegistryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            lastVehicleID: expect.any(Object),
            lastReceiptID: expect.any(Object),
            address: expect.any(Object),
            city: expect.any(Object),
            contactNumber1: expect.any(Object),
            contactNumber2: expect.any(Object),
            email: expect.any(Object),
            opsUnitID: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getClientRegistry', () => {
      it('should return NewClientRegistry for default ClientRegistry initial value', () => {
        const formGroup = service.createClientRegistryFormGroup(sampleWithNewData);

        const clientRegistry = service.getClientRegistry(formGroup) as any;

        expect(clientRegistry).toMatchObject(sampleWithNewData);
      });

      it('should return NewClientRegistry for empty ClientRegistry initial value', () => {
        const formGroup = service.createClientRegistryFormGroup();

        const clientRegistry = service.getClientRegistry(formGroup) as any;

        expect(clientRegistry).toMatchObject({});
      });

      it('should return IClientRegistry', () => {
        const formGroup = service.createClientRegistryFormGroup(sampleWithRequiredData);

        const clientRegistry = service.getClientRegistry(formGroup) as any;

        expect(clientRegistry).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IClientRegistry should not enable id FormControl', () => {
        const formGroup = service.createClientRegistryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewClientRegistry should disable id FormControl', () => {
        const formGroup = service.createClientRegistryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
