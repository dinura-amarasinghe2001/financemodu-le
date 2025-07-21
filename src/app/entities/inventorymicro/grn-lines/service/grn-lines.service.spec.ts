import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGRNLines } from '../grn-lines.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../grn-lines.test-samples';

import { GRNLinesService, RestGRNLines } from './grn-lines.service';

const requireRestSample: RestGRNLines = {
  ...sampleWithRequiredData,
  lmd: sampleWithRequiredData.lmd?.toJSON(),
};

describe('GRNLines Service', () => {
  let service: GRNLinesService;
  let httpMock: HttpTestingController;
  let expectedResult: IGRNLines | IGRNLines[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GRNLinesService);
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

    it('should create a GRNLines', () => {
      const gRNLines = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gRNLines).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GRNLines', () => {
      const gRNLines = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gRNLines).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GRNLines', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GRNLines', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GRNLines', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a GRNLines', () => {
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

    describe('addGRNLinesToCollectionIfMissing', () => {
      it('should add a GRNLines to an empty array', () => {
        const gRNLines: IGRNLines = sampleWithRequiredData;
        expectedResult = service.addGRNLinesToCollectionIfMissing([], gRNLines);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gRNLines);
      });

      it('should not add a GRNLines to an array that contains it', () => {
        const gRNLines: IGRNLines = sampleWithRequiredData;
        const gRNLinesCollection: IGRNLines[] = [
          {
            ...gRNLines,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGRNLinesToCollectionIfMissing(gRNLinesCollection, gRNLines);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GRNLines to an array that doesn't contain it", () => {
        const gRNLines: IGRNLines = sampleWithRequiredData;
        const gRNLinesCollection: IGRNLines[] = [sampleWithPartialData];
        expectedResult = service.addGRNLinesToCollectionIfMissing(gRNLinesCollection, gRNLines);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gRNLines);
      });

      it('should add only unique GRNLines to an array', () => {
        const gRNLinesArray: IGRNLines[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gRNLinesCollection: IGRNLines[] = [sampleWithRequiredData];
        expectedResult = service.addGRNLinesToCollectionIfMissing(gRNLinesCollection, ...gRNLinesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gRNLines: IGRNLines = sampleWithRequiredData;
        const gRNLines2: IGRNLines = sampleWithPartialData;
        expectedResult = service.addGRNLinesToCollectionIfMissing([], gRNLines, gRNLines2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gRNLines);
        expect(expectedResult).toContain(gRNLines2);
      });

      it('should accept null and undefined values', () => {
        const gRNLines: IGRNLines = sampleWithRequiredData;
        expectedResult = service.addGRNLinesToCollectionIfMissing([], null, gRNLines, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gRNLines);
      });

      it('should return initial array if no GRNLines is added', () => {
        const gRNLinesCollection: IGRNLines[] = [sampleWithRequiredData];
        expectedResult = service.addGRNLinesToCollectionIfMissing(gRNLinesCollection, undefined, null);
        expect(expectedResult).toEqual(gRNLinesCollection);
      });
    });

    describe('compareGRNLines', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGRNLines(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 1249 };
        const entity2 = null;

        const compareResult1 = service.compareGRNLines(entity1, entity2);
        const compareResult2 = service.compareGRNLines(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 1249 };
        const entity2 = { id: 19021 };

        const compareResult1 = service.compareGRNLines(entity1, entity2);
        const compareResult2 = service.compareGRNLines(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 1249 };
        const entity2 = { id: 1249 };

        const compareResult1 = service.compareGRNLines(entity1, entity2);
        const compareResult2 = service.compareGRNLines(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
