import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IOperationalUnit } from '../operational-unit.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../operational-unit.test-samples';

import { OperationalUnitService, RestOperationalUnit } from './operational-unit.service';

const requireRestSample: RestOperationalUnit = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('OperationalUnit Service', () => {
  let service: OperationalUnitService;
  let httpMock: HttpTestingController;
  let expectedResult: IOperationalUnit | IOperationalUnit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(OperationalUnitService);
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

    it('should create a OperationalUnit', () => {
      const operationalUnit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(operationalUnit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OperationalUnit', () => {
      const operationalUnit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(operationalUnit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OperationalUnit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OperationalUnit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OperationalUnit', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a OperationalUnit', () => {
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

    describe('addOperationalUnitToCollectionIfMissing', () => {
      it('should add a OperationalUnit to an empty array', () => {
        const operationalUnit: IOperationalUnit = sampleWithRequiredData;
        expectedResult = service.addOperationalUnitToCollectionIfMissing([], operationalUnit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operationalUnit);
      });

      it('should not add a OperationalUnit to an array that contains it', () => {
        const operationalUnit: IOperationalUnit = sampleWithRequiredData;
        const operationalUnitCollection: IOperationalUnit[] = [
          {
            ...operationalUnit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOperationalUnitToCollectionIfMissing(operationalUnitCollection, operationalUnit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OperationalUnit to an array that doesn't contain it", () => {
        const operationalUnit: IOperationalUnit = sampleWithRequiredData;
        const operationalUnitCollection: IOperationalUnit[] = [sampleWithPartialData];
        expectedResult = service.addOperationalUnitToCollectionIfMissing(operationalUnitCollection, operationalUnit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operationalUnit);
      });

      it('should add only unique OperationalUnit to an array', () => {
        const operationalUnitArray: IOperationalUnit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const operationalUnitCollection: IOperationalUnit[] = [sampleWithRequiredData];
        expectedResult = service.addOperationalUnitToCollectionIfMissing(operationalUnitCollection, ...operationalUnitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const operationalUnit: IOperationalUnit = sampleWithRequiredData;
        const operationalUnit2: IOperationalUnit = sampleWithPartialData;
        expectedResult = service.addOperationalUnitToCollectionIfMissing([], operationalUnit, operationalUnit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operationalUnit);
        expect(expectedResult).toContain(operationalUnit2);
      });

      it('should accept null and undefined values', () => {
        const operationalUnit: IOperationalUnit = sampleWithRequiredData;
        expectedResult = service.addOperationalUnitToCollectionIfMissing([], null, operationalUnit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operationalUnit);
      });

      it('should return initial array if no OperationalUnit is added', () => {
        const operationalUnitCollection: IOperationalUnit[] = [sampleWithRequiredData];
        expectedResult = service.addOperationalUnitToCollectionIfMissing(operationalUnitCollection, undefined, null);
        expect(expectedResult).toEqual(operationalUnitCollection);
      });
    });

    describe('compareOperationalUnit', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOperationalUnit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 13401 };
        const entity2 = null;

        const compareResult1 = service.compareOperationalUnit(entity1, entity2);
        const compareResult2 = service.compareOperationalUnit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 13401 };
        const entity2 = { id: 19869 };

        const compareResult1 = service.compareOperationalUnit(entity1, entity2);
        const compareResult2 = service.compareOperationalUnit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 13401 };
        const entity2 = { id: 13401 };

        const compareResult1 = service.compareOperationalUnit(entity1, entity2);
        const compareResult2 = service.compareOperationalUnit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
