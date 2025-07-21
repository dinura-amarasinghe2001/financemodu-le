import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGRN } from '../grn.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../grn.test-samples';

import { GRNService, RestGRN } from './grn.service';

const requireRestSample: RestGRN = {
  ...sampleWithRequiredData,
  grnDate: sampleWithRequiredData.grnDate?.toJSON(),
  lmd: sampleWithRequiredData.lmd?.toJSON(),
  supplierInvoiceDate: sampleWithRequiredData.supplierInvoiceDate?.toJSON(),
};

describe('GRN Service', () => {
  let service: GRNService;
  let httpMock: HttpTestingController;
  let expectedResult: IGRN | IGRN[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GRNService);
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

    it('should create a GRN', () => {
      const gRN = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gRN).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GRN', () => {
      const gRN = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gRN).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GRN', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GRN', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GRN', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a GRN', () => {
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

    describe('addGRNToCollectionIfMissing', () => {
      it('should add a GRN to an empty array', () => {
        const gRN: IGRN = sampleWithRequiredData;
        expectedResult = service.addGRNToCollectionIfMissing([], gRN);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gRN);
      });

      it('should not add a GRN to an array that contains it', () => {
        const gRN: IGRN = sampleWithRequiredData;
        const gRNCollection: IGRN[] = [
          {
            ...gRN,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGRNToCollectionIfMissing(gRNCollection, gRN);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GRN to an array that doesn't contain it", () => {
        const gRN: IGRN = sampleWithRequiredData;
        const gRNCollection: IGRN[] = [sampleWithPartialData];
        expectedResult = service.addGRNToCollectionIfMissing(gRNCollection, gRN);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gRN);
      });

      it('should add only unique GRN to an array', () => {
        const gRNArray: IGRN[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gRNCollection: IGRN[] = [sampleWithRequiredData];
        expectedResult = service.addGRNToCollectionIfMissing(gRNCollection, ...gRNArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gRN: IGRN = sampleWithRequiredData;
        const gRN2: IGRN = sampleWithPartialData;
        expectedResult = service.addGRNToCollectionIfMissing([], gRN, gRN2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gRN);
        expect(expectedResult).toContain(gRN2);
      });

      it('should accept null and undefined values', () => {
        const gRN: IGRN = sampleWithRequiredData;
        expectedResult = service.addGRNToCollectionIfMissing([], null, gRN, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gRN);
      });

      it('should return initial array if no GRN is added', () => {
        const gRNCollection: IGRN[] = [sampleWithRequiredData];
        expectedResult = service.addGRNToCollectionIfMissing(gRNCollection, undefined, null);
        expect(expectedResult).toEqual(gRNCollection);
      });
    });

    describe('compareGRN', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGRN(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 11626 };
        const entity2 = null;

        const compareResult1 = service.compareGRN(entity1, entity2);
        const compareResult2 = service.compareGRN(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 11626 };
        const entity2 = { id: 21025 };

        const compareResult1 = service.compareGRN(entity1, entity2);
        const compareResult2 = service.compareGRN(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 11626 };
        const entity2 = { id: 11626 };

        const compareResult1 = service.compareGRN(entity1, entity2);
        const compareResult2 = service.compareGRN(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
