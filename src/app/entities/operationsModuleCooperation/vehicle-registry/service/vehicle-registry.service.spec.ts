import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IVehicleRegistry } from '../vehicle-registry.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../vehicle-registry.test-samples';

import { RestVehicleRegistry, VehicleRegistryService } from './vehicle-registry.service';

const requireRestSample: RestVehicleRegistry = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('VehicleRegistry Service', () => {
  let service: VehicleRegistryService;
  let httpMock: HttpTestingController;
  let expectedResult: IVehicleRegistry | IVehicleRegistry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VehicleRegistryService);
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

    it('should create a VehicleRegistry', () => {
      const vehicleRegistry = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vehicleRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VehicleRegistry', () => {
      const vehicleRegistry = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vehicleRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VehicleRegistry', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VehicleRegistry', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VehicleRegistry', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a VehicleRegistry', () => {
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

    describe('addVehicleRegistryToCollectionIfMissing', () => {
      it('should add a VehicleRegistry to an empty array', () => {
        const vehicleRegistry: IVehicleRegistry = sampleWithRequiredData;
        expectedResult = service.addVehicleRegistryToCollectionIfMissing([], vehicleRegistry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleRegistry);
      });

      it('should not add a VehicleRegistry to an array that contains it', () => {
        const vehicleRegistry: IVehicleRegistry = sampleWithRequiredData;
        const vehicleRegistryCollection: IVehicleRegistry[] = [
          {
            ...vehicleRegistry,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVehicleRegistryToCollectionIfMissing(vehicleRegistryCollection, vehicleRegistry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VehicleRegistry to an array that doesn't contain it", () => {
        const vehicleRegistry: IVehicleRegistry = sampleWithRequiredData;
        const vehicleRegistryCollection: IVehicleRegistry[] = [sampleWithPartialData];
        expectedResult = service.addVehicleRegistryToCollectionIfMissing(vehicleRegistryCollection, vehicleRegistry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleRegistry);
      });

      it('should add only unique VehicleRegistry to an array', () => {
        const vehicleRegistryArray: IVehicleRegistry[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vehicleRegistryCollection: IVehicleRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleRegistryToCollectionIfMissing(vehicleRegistryCollection, ...vehicleRegistryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vehicleRegistry: IVehicleRegistry = sampleWithRequiredData;
        const vehicleRegistry2: IVehicleRegistry = sampleWithPartialData;
        expectedResult = service.addVehicleRegistryToCollectionIfMissing([], vehicleRegistry, vehicleRegistry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleRegistry);
        expect(expectedResult).toContain(vehicleRegistry2);
      });

      it('should accept null and undefined values', () => {
        const vehicleRegistry: IVehicleRegistry = sampleWithRequiredData;
        expectedResult = service.addVehicleRegistryToCollectionIfMissing([], null, vehicleRegistry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleRegistry);
      });

      it('should return initial array if no VehicleRegistry is added', () => {
        const vehicleRegistryCollection: IVehicleRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleRegistryToCollectionIfMissing(vehicleRegistryCollection, undefined, null);
        expect(expectedResult).toEqual(vehicleRegistryCollection);
      });
    });

    describe('compareVehicleRegistry', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVehicleRegistry(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 17213 };
        const entity2 = null;

        const compareResult1 = service.compareVehicleRegistry(entity1, entity2);
        const compareResult2 = service.compareVehicleRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 17213 };
        const entity2 = { id: 27787 };

        const compareResult1 = service.compareVehicleRegistry(entity1, entity2);
        const compareResult2 = service.compareVehicleRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 17213 };
        const entity2 = { id: 17213 };

        const compareResult1 = service.compareVehicleRegistry(entity1, entity2);
        const compareResult2 = service.compareVehicleRegistry(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
