import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITheGRNLineBatches } from '../the-grn-line-batches.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../the-grn-line-batches.test-samples';

import { RestTheGRNLineBatches, TheGRNLineBatchesService } from './the-grn-line-batches.service';

const requireRestSample: RestTheGRNLineBatches = {
  ...sampleWithRequiredData,
  txDate: sampleWithRequiredData.txDate?.toJSON(),
  manufactureDate: sampleWithRequiredData.manufactureDate?.toJSON(),
  expiredDate: sampleWithRequiredData.expiredDate?.toJSON(),
  lmd: sampleWithRequiredData.lmd?.toJSON(),
};

describe('TheGRNLineBatches Service', () => {
  let service: TheGRNLineBatchesService;
  let httpMock: HttpTestingController;
  let expectedResult: ITheGRNLineBatches | ITheGRNLineBatches[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TheGRNLineBatchesService);
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

    it('should create a TheGRNLineBatches', () => {
      const theGRNLineBatches = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(theGRNLineBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TheGRNLineBatches', () => {
      const theGRNLineBatches = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(theGRNLineBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TheGRNLineBatches', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TheGRNLineBatches', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TheGRNLineBatches', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a TheGRNLineBatches', () => {
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

    describe('addTheGRNLineBatchesToCollectionIfMissing', () => {
      it('should add a TheGRNLineBatches to an empty array', () => {
        const theGRNLineBatches: ITheGRNLineBatches = sampleWithRequiredData;
        expectedResult = service.addTheGRNLineBatchesToCollectionIfMissing([], theGRNLineBatches);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(theGRNLineBatches);
      });

      it('should not add a TheGRNLineBatches to an array that contains it', () => {
        const theGRNLineBatches: ITheGRNLineBatches = sampleWithRequiredData;
        const theGRNLineBatchesCollection: ITheGRNLineBatches[] = [
          {
            ...theGRNLineBatches,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTheGRNLineBatchesToCollectionIfMissing(theGRNLineBatchesCollection, theGRNLineBatches);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TheGRNLineBatches to an array that doesn't contain it", () => {
        const theGRNLineBatches: ITheGRNLineBatches = sampleWithRequiredData;
        const theGRNLineBatchesCollection: ITheGRNLineBatches[] = [sampleWithPartialData];
        expectedResult = service.addTheGRNLineBatchesToCollectionIfMissing(theGRNLineBatchesCollection, theGRNLineBatches);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(theGRNLineBatches);
      });

      it('should add only unique TheGRNLineBatches to an array', () => {
        const theGRNLineBatchesArray: ITheGRNLineBatches[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const theGRNLineBatchesCollection: ITheGRNLineBatches[] = [sampleWithRequiredData];
        expectedResult = service.addTheGRNLineBatchesToCollectionIfMissing(theGRNLineBatchesCollection, ...theGRNLineBatchesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const theGRNLineBatches: ITheGRNLineBatches = sampleWithRequiredData;
        const theGRNLineBatches2: ITheGRNLineBatches = sampleWithPartialData;
        expectedResult = service.addTheGRNLineBatchesToCollectionIfMissing([], theGRNLineBatches, theGRNLineBatches2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(theGRNLineBatches);
        expect(expectedResult).toContain(theGRNLineBatches2);
      });

      it('should accept null and undefined values', () => {
        const theGRNLineBatches: ITheGRNLineBatches = sampleWithRequiredData;
        expectedResult = service.addTheGRNLineBatchesToCollectionIfMissing([], null, theGRNLineBatches, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(theGRNLineBatches);
      });

      it('should return initial array if no TheGRNLineBatches is added', () => {
        const theGRNLineBatchesCollection: ITheGRNLineBatches[] = [sampleWithRequiredData];
        expectedResult = service.addTheGRNLineBatchesToCollectionIfMissing(theGRNLineBatchesCollection, undefined, null);
        expect(expectedResult).toEqual(theGRNLineBatchesCollection);
      });
    });

    describe('compareTheGRNLineBatches', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTheGRNLineBatches(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 16379 };
        const entity2 = null;

        const compareResult1 = service.compareTheGRNLineBatches(entity1, entity2);
        const compareResult2 = service.compareTheGRNLineBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 16379 };
        const entity2 = { id: 28645 };

        const compareResult1 = service.compareTheGRNLineBatches(entity1, entity2);
        const compareResult2 = service.compareTheGRNLineBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 16379 };
        const entity2 = { id: 16379 };

        const compareResult1 = service.compareTheGRNLineBatches(entity1, entity2);
        const compareResult2 = service.compareTheGRNLineBatches(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
