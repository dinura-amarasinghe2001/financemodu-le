import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGRNLineBatches } from '../grn-line-batches.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../grn-line-batches.test-samples';

import { GRNLineBatchesService, RestGRNLineBatches } from './grn-line-batches.service';

const requireRestSample: RestGRNLineBatches = {
  ...sampleWithRequiredData,
  txDate: sampleWithRequiredData.txDate?.toJSON(),
  manufactureDate: sampleWithRequiredData.manufactureDate?.toJSON(),
  expiredDate: sampleWithRequiredData.expiredDate?.toJSON(),
  lmd: sampleWithRequiredData.lmd?.toJSON(),
};

describe('GRNLineBatches Service', () => {
  let service: GRNLineBatchesService;
  let httpMock: HttpTestingController;
  let expectedResult: IGRNLineBatches | IGRNLineBatches[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GRNLineBatchesService);
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

    it('should create a GRNLineBatches', () => {
      const gRNLineBatches = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gRNLineBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GRNLineBatches', () => {
      const gRNLineBatches = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gRNLineBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GRNLineBatches', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GRNLineBatches', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GRNLineBatches', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a GRNLineBatches', () => {
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

    describe('addGRNLineBatchesToCollectionIfMissing', () => {
      it('should add a GRNLineBatches to an empty array', () => {
        const gRNLineBatches: IGRNLineBatches = sampleWithRequiredData;
        expectedResult = service.addGRNLineBatchesToCollectionIfMissing([], gRNLineBatches);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gRNLineBatches);
      });

      it('should not add a GRNLineBatches to an array that contains it', () => {
        const gRNLineBatches: IGRNLineBatches = sampleWithRequiredData;
        const gRNLineBatchesCollection: IGRNLineBatches[] = [
          {
            ...gRNLineBatches,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGRNLineBatchesToCollectionIfMissing(gRNLineBatchesCollection, gRNLineBatches);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GRNLineBatches to an array that doesn't contain it", () => {
        const gRNLineBatches: IGRNLineBatches = sampleWithRequiredData;
        const gRNLineBatchesCollection: IGRNLineBatches[] = [sampleWithPartialData];
        expectedResult = service.addGRNLineBatchesToCollectionIfMissing(gRNLineBatchesCollection, gRNLineBatches);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gRNLineBatches);
      });

      it('should add only unique GRNLineBatches to an array', () => {
        const gRNLineBatchesArray: IGRNLineBatches[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gRNLineBatchesCollection: IGRNLineBatches[] = [sampleWithRequiredData];
        expectedResult = service.addGRNLineBatchesToCollectionIfMissing(gRNLineBatchesCollection, ...gRNLineBatchesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gRNLineBatches: IGRNLineBatches = sampleWithRequiredData;
        const gRNLineBatches2: IGRNLineBatches = sampleWithPartialData;
        expectedResult = service.addGRNLineBatchesToCollectionIfMissing([], gRNLineBatches, gRNLineBatches2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gRNLineBatches);
        expect(expectedResult).toContain(gRNLineBatches2);
      });

      it('should accept null and undefined values', () => {
        const gRNLineBatches: IGRNLineBatches = sampleWithRequiredData;
        expectedResult = service.addGRNLineBatchesToCollectionIfMissing([], null, gRNLineBatches, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gRNLineBatches);
      });

      it('should return initial array if no GRNLineBatches is added', () => {
        const gRNLineBatchesCollection: IGRNLineBatches[] = [sampleWithRequiredData];
        expectedResult = service.addGRNLineBatchesToCollectionIfMissing(gRNLineBatchesCollection, undefined, null);
        expect(expectedResult).toEqual(gRNLineBatchesCollection);
      });
    });

    describe('compareGRNLineBatches', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGRNLineBatches(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25524 };
        const entity2 = null;

        const compareResult1 = service.compareGRNLineBatches(entity1, entity2);
        const compareResult2 = service.compareGRNLineBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25524 };
        const entity2 = { id: 3940 };

        const compareResult1 = service.compareGRNLineBatches(entity1, entity2);
        const compareResult2 = service.compareGRNLineBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25524 };
        const entity2 = { id: 25524 };

        const compareResult1 = service.compareGRNLineBatches(entity1, entity2);
        const compareResult2 = service.compareGRNLineBatches(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
