import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITheInventoryBatches } from '../the-inventory-batches.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../the-inventory-batches.test-samples';

import { RestTheInventoryBatches, TheInventoryBatchesService } from './the-inventory-batches.service';

const requireRestSample: RestTheInventoryBatches = {
  ...sampleWithRequiredData,
  txDate: sampleWithRequiredData.txDate?.toJSON(),
  lmd: sampleWithRequiredData.lmd?.toJSON(),
  manufactureDate: sampleWithRequiredData.manufactureDate?.toJSON(),
  expireDate: sampleWithRequiredData.expireDate?.toJSON(),
  addedDate: sampleWithRequiredData.addedDate?.toJSON(),
};

describe('TheInventoryBatches Service', () => {
  let service: TheInventoryBatchesService;
  let httpMock: HttpTestingController;
  let expectedResult: ITheInventoryBatches | ITheInventoryBatches[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TheInventoryBatchesService);
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

    it('should create a TheInventoryBatches', () => {
      const theInventoryBatches = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(theInventoryBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TheInventoryBatches', () => {
      const theInventoryBatches = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(theInventoryBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TheInventoryBatches', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TheInventoryBatches', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TheInventoryBatches', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a TheInventoryBatches', () => {
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

    describe('addTheInventoryBatchesToCollectionIfMissing', () => {
      it('should add a TheInventoryBatches to an empty array', () => {
        const theInventoryBatches: ITheInventoryBatches = sampleWithRequiredData;
        expectedResult = service.addTheInventoryBatchesToCollectionIfMissing([], theInventoryBatches);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(theInventoryBatches);
      });

      it('should not add a TheInventoryBatches to an array that contains it', () => {
        const theInventoryBatches: ITheInventoryBatches = sampleWithRequiredData;
        const theInventoryBatchesCollection: ITheInventoryBatches[] = [
          {
            ...theInventoryBatches,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTheInventoryBatchesToCollectionIfMissing(theInventoryBatchesCollection, theInventoryBatches);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TheInventoryBatches to an array that doesn't contain it", () => {
        const theInventoryBatches: ITheInventoryBatches = sampleWithRequiredData;
        const theInventoryBatchesCollection: ITheInventoryBatches[] = [sampleWithPartialData];
        expectedResult = service.addTheInventoryBatchesToCollectionIfMissing(theInventoryBatchesCollection, theInventoryBatches);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(theInventoryBatches);
      });

      it('should add only unique TheInventoryBatches to an array', () => {
        const theInventoryBatchesArray: ITheInventoryBatches[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const theInventoryBatchesCollection: ITheInventoryBatches[] = [sampleWithRequiredData];
        expectedResult = service.addTheInventoryBatchesToCollectionIfMissing(theInventoryBatchesCollection, ...theInventoryBatchesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const theInventoryBatches: ITheInventoryBatches = sampleWithRequiredData;
        const theInventoryBatches2: ITheInventoryBatches = sampleWithPartialData;
        expectedResult = service.addTheInventoryBatchesToCollectionIfMissing([], theInventoryBatches, theInventoryBatches2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(theInventoryBatches);
        expect(expectedResult).toContain(theInventoryBatches2);
      });

      it('should accept null and undefined values', () => {
        const theInventoryBatches: ITheInventoryBatches = sampleWithRequiredData;
        expectedResult = service.addTheInventoryBatchesToCollectionIfMissing([], null, theInventoryBatches, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(theInventoryBatches);
      });

      it('should return initial array if no TheInventoryBatches is added', () => {
        const theInventoryBatchesCollection: ITheInventoryBatches[] = [sampleWithRequiredData];
        expectedResult = service.addTheInventoryBatchesToCollectionIfMissing(theInventoryBatchesCollection, undefined, null);
        expect(expectedResult).toEqual(theInventoryBatchesCollection);
      });
    });

    describe('compareTheInventoryBatches', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTheInventoryBatches(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 22239 };
        const entity2 = null;

        const compareResult1 = service.compareTheInventoryBatches(entity1, entity2);
        const compareResult2 = service.compareTheInventoryBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 22239 };
        const entity2 = { id: 10142 };

        const compareResult1 = service.compareTheInventoryBatches(entity1, entity2);
        const compareResult2 = service.compareTheInventoryBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 22239 };
        const entity2 = { id: 22239 };

        const compareResult1 = service.compareTheInventoryBatches(entity1, entity2);
        const compareResult2 = service.compareTheInventoryBatches(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
