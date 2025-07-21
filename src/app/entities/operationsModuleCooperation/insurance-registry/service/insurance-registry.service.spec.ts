import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IInsuranceRegistry } from '../insurance-registry.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../insurance-registry.test-samples';

import { InsuranceRegistryService, RestInsuranceRegistry } from './insurance-registry.service';

const requireRestSample: RestInsuranceRegistry = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('InsuranceRegistry Service', () => {
  let service: InsuranceRegistryService;
  let httpMock: HttpTestingController;
  let expectedResult: IInsuranceRegistry | IInsuranceRegistry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(InsuranceRegistryService);
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

    it('should create a InsuranceRegistry', () => {
      const insuranceRegistry = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(insuranceRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InsuranceRegistry', () => {
      const insuranceRegistry = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(insuranceRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InsuranceRegistry', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InsuranceRegistry', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InsuranceRegistry', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a InsuranceRegistry', () => {
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

    describe('addInsuranceRegistryToCollectionIfMissing', () => {
      it('should add a InsuranceRegistry to an empty array', () => {
        const insuranceRegistry: IInsuranceRegistry = sampleWithRequiredData;
        expectedResult = service.addInsuranceRegistryToCollectionIfMissing([], insuranceRegistry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insuranceRegistry);
      });

      it('should not add a InsuranceRegistry to an array that contains it', () => {
        const insuranceRegistry: IInsuranceRegistry = sampleWithRequiredData;
        const insuranceRegistryCollection: IInsuranceRegistry[] = [
          {
            ...insuranceRegistry,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInsuranceRegistryToCollectionIfMissing(insuranceRegistryCollection, insuranceRegistry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InsuranceRegistry to an array that doesn't contain it", () => {
        const insuranceRegistry: IInsuranceRegistry = sampleWithRequiredData;
        const insuranceRegistryCollection: IInsuranceRegistry[] = [sampleWithPartialData];
        expectedResult = service.addInsuranceRegistryToCollectionIfMissing(insuranceRegistryCollection, insuranceRegistry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insuranceRegistry);
      });

      it('should add only unique InsuranceRegistry to an array', () => {
        const insuranceRegistryArray: IInsuranceRegistry[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const insuranceRegistryCollection: IInsuranceRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addInsuranceRegistryToCollectionIfMissing(insuranceRegistryCollection, ...insuranceRegistryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const insuranceRegistry: IInsuranceRegistry = sampleWithRequiredData;
        const insuranceRegistry2: IInsuranceRegistry = sampleWithPartialData;
        expectedResult = service.addInsuranceRegistryToCollectionIfMissing([], insuranceRegistry, insuranceRegistry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(insuranceRegistry);
        expect(expectedResult).toContain(insuranceRegistry2);
      });

      it('should accept null and undefined values', () => {
        const insuranceRegistry: IInsuranceRegistry = sampleWithRequiredData;
        expectedResult = service.addInsuranceRegistryToCollectionIfMissing([], null, insuranceRegistry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(insuranceRegistry);
      });

      it('should return initial array if no InsuranceRegistry is added', () => {
        const insuranceRegistryCollection: IInsuranceRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addInsuranceRegistryToCollectionIfMissing(insuranceRegistryCollection, undefined, null);
        expect(expectedResult).toEqual(insuranceRegistryCollection);
      });
    });

    describe('compareInsuranceRegistry', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInsuranceRegistry(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 1027 };
        const entity2 = null;

        const compareResult1 = service.compareInsuranceRegistry(entity1, entity2);
        const compareResult2 = service.compareInsuranceRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 1027 };
        const entity2 = { id: 4538 };

        const compareResult1 = service.compareInsuranceRegistry(entity1, entity2);
        const compareResult2 = service.compareInsuranceRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 1027 };
        const entity2 = { id: 1027 };

        const compareResult1 = service.compareInsuranceRegistry(entity1, entity2);
        const compareResult2 = service.compareInsuranceRegistry(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
