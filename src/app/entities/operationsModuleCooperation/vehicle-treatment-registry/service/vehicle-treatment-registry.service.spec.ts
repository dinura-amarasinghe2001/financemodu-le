import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IVehicleTreatmentRegistry } from '../vehicle-treatment-registry.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../vehicle-treatment-registry.test-samples';

import { RestVehicleTreatmentRegistry, VehicleTreatmentRegistryService } from './vehicle-treatment-registry.service';

const requireRestSample: RestVehicleTreatmentRegistry = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('VehicleTreatmentRegistry Service', () => {
  let service: VehicleTreatmentRegistryService;
  let httpMock: HttpTestingController;
  let expectedResult: IVehicleTreatmentRegistry | IVehicleTreatmentRegistry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VehicleTreatmentRegistryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a VehicleTreatmentRegistry', () => {
      const vehicleTreatmentRegistry = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vehicleTreatmentRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VehicleTreatmentRegistry', () => {
      const vehicleTreatmentRegistry = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vehicleTreatmentRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VehicleTreatmentRegistry', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VehicleTreatmentRegistry', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VehicleTreatmentRegistry', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a VehicleTreatmentRegistry', () => {
      const queryObject: any = {
        page: 0,
        size: 20,
        query: '',
        sort: [],
      };
      service.search(queryObject).subscribe(() => expectedResult);

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
      expect(expectedResult).toBe(null);
    });

    describe('addVehicleTreatmentRegistryToCollectionIfMissing', () => {
      it('should add a VehicleTreatmentRegistry to an empty array', () => {
        const vehicleTreatmentRegistry: IVehicleTreatmentRegistry = sampleWithRequiredData;
        expectedResult = service.addVehicleTreatmentRegistryToCollectionIfMissing([], vehicleTreatmentRegistry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleTreatmentRegistry);
      });

      it('should not add a VehicleTreatmentRegistry to an array that contains it', () => {
        const vehicleTreatmentRegistry: IVehicleTreatmentRegistry = sampleWithRequiredData;
        const vehicleTreatmentRegistryCollection: IVehicleTreatmentRegistry[] = [
          {
            ...vehicleTreatmentRegistry,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVehicleTreatmentRegistryToCollectionIfMissing(
          vehicleTreatmentRegistryCollection,
          vehicleTreatmentRegistry,
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VehicleTreatmentRegistry to an array that doesn't contain it", () => {
        const vehicleTreatmentRegistry: IVehicleTreatmentRegistry = sampleWithRequiredData;
        const vehicleTreatmentRegistryCollection: IVehicleTreatmentRegistry[] = [sampleWithPartialData];
        expectedResult = service.addVehicleTreatmentRegistryToCollectionIfMissing(
          vehicleTreatmentRegistryCollection,
          vehicleTreatmentRegistry,
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleTreatmentRegistry);
      });

      it('should add only unique VehicleTreatmentRegistry to an array', () => {
        const vehicleTreatmentRegistryArray: IVehicleTreatmentRegistry[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const vehicleTreatmentRegistryCollection: IVehicleTreatmentRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleTreatmentRegistryToCollectionIfMissing(
          vehicleTreatmentRegistryCollection,
          ...vehicleTreatmentRegistryArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vehicleTreatmentRegistry: IVehicleTreatmentRegistry = sampleWithRequiredData;
        const vehicleTreatmentRegistry2: IVehicleTreatmentRegistry = sampleWithPartialData;
        expectedResult = service.addVehicleTreatmentRegistryToCollectionIfMissing([], vehicleTreatmentRegistry, vehicleTreatmentRegistry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleTreatmentRegistry);
        expect(expectedResult).toContain(vehicleTreatmentRegistry2);
      });

      it('should accept null and undefined values', () => {
        const vehicleTreatmentRegistry: IVehicleTreatmentRegistry = sampleWithRequiredData;
        expectedResult = service.addVehicleTreatmentRegistryToCollectionIfMissing([], null, vehicleTreatmentRegistry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleTreatmentRegistry);
      });

      it('should return initial array if no VehicleTreatmentRegistry is added', () => {
        const vehicleTreatmentRegistryCollection: IVehicleTreatmentRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleTreatmentRegistryToCollectionIfMissing(vehicleTreatmentRegistryCollection, undefined, null);
        expect(expectedResult).toEqual(vehicleTreatmentRegistryCollection);
      });
    });

    describe('compareVehicleTreatmentRegistry', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVehicleTreatmentRegistry(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 18463 };
        const entity2 = null;

        const compareResult1 = service.compareVehicleTreatmentRegistry(entity1, entity2);
        const compareResult2 = service.compareVehicleTreatmentRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 18463 };
        const entity2 = { id: 30356 };

        const compareResult1 = service.compareVehicleTreatmentRegistry(entity1, entity2);
        const compareResult2 = service.compareVehicleTreatmentRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 18463 };
        const entity2 = { id: 18463 };

        const compareResult1 = service.compareVehicleTreatmentRegistry(entity1, entity2);
        const compareResult2 = service.compareVehicleTreatmentRegistry(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
