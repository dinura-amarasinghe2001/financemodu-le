import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-card.test-samples';

import { JobCardFormService } from './job-card-form.service';

describe('JobCard Form Service', () => {
  let service: JobCardFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobCardFormService);
  });

  describe('Service methods', () => {
    describe('createJobCardFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createJobCardFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            estimateID: expect.any(Object),
            insuranceCompany: expect.any(Object),
            serviceAdvisor: expect.any(Object),
            serviceAdvisorID: expect.any(Object),
            numberOfPanels: expect.any(Object),
            fuelLevel: expect.any(Object),
            meterReading: expect.any(Object),
            startDate: expect.any(Object),
            jobCardNumber: expect.any(Object),
            jobCompleteDate: expect.any(Object),
            boothDate: expect.any(Object),
            opsUnitID: expect.any(Object),
            tinkeringStartDateTime: expect.any(Object),
            tinkeringEndDateTime: expect.any(Object),
            paintStartDateTime: expect.any(Object),
            paintEndDateTime: expect.any(Object),
            qcStartDateTime: expect.any(Object),
            qcEndDateTime: expect.any(Object),
            sparePartStartDateTime: expect.any(Object),
            sparePartEndDateTime: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });

      it('passing IJobCard should create a new form with FormGroup', () => {
        const formGroup = service.createJobCardFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vehicleID: expect.any(Object),
            vehicleBrand: expect.any(Object),
            vehicleModel: expect.any(Object),
            vehicleLicenseNumber: expect.any(Object),
            vehicleOwnerID: expect.any(Object),
            vehicleOwnerName: expect.any(Object),
            vehicleOwnerContactNumber1: expect.any(Object),
            vehicleOwnerContactNumber2: expect.any(Object),
            estimateID: expect.any(Object),
            insuranceCompany: expect.any(Object),
            serviceAdvisor: expect.any(Object),
            serviceAdvisorID: expect.any(Object),
            numberOfPanels: expect.any(Object),
            fuelLevel: expect.any(Object),
            meterReading: expect.any(Object),
            startDate: expect.any(Object),
            jobCardNumber: expect.any(Object),
            jobCompleteDate: expect.any(Object),
            boothDate: expect.any(Object),
            opsUnitID: expect.any(Object),
            tinkeringStartDateTime: expect.any(Object),
            tinkeringEndDateTime: expect.any(Object),
            paintStartDateTime: expect.any(Object),
            paintEndDateTime: expect.any(Object),
            qcStartDateTime: expect.any(Object),
            qcEndDateTime: expect.any(Object),
            sparePartStartDateTime: expect.any(Object),
            sparePartEndDateTime: expect.any(Object),
            createdBy: expect.any(Object),
            createdDate: expect.any(Object),
            lastModifiedBy: expect.any(Object),
            lastModifiedDate: expect.any(Object),
          }),
        );
      });
    });

    describe('getJobCard', () => {
      it('should return NewJobCard for default JobCard initial value', () => {
        const formGroup = service.createJobCardFormGroup(sampleWithNewData);

        const jobCard = service.getJobCard(formGroup) as any;

        expect(jobCard).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobCard for empty JobCard initial value', () => {
        const formGroup = service.createJobCardFormGroup();

        const jobCard = service.getJobCard(formGroup) as any;

        expect(jobCard).toMatchObject({});
      });

      it('should return IJobCard', () => {
        const formGroup = service.createJobCardFormGroup(sampleWithRequiredData);

        const jobCard = service.getJobCard(formGroup) as any;

        expect(jobCard).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IJobCard should not enable id FormControl', () => {
        const formGroup = service.createJobCardFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewJobCard should disable id FormControl', () => {
        const formGroup = service.createJobCardFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
