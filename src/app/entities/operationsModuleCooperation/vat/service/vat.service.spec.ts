import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IVat } from '../vat.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../vat.test-samples';

import { VatService } from './vat.service';

const requireRestSample: IVat = {
  ...sampleWithRequiredData,
};

describe('Vat Service', () => {
  let service: VatService;
  let httpMock: HttpTestingController;
  let expectedResult: IVat | IVat[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VatService);
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

    it('should create a Vat', () => {
      const vat = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vat', () => {
      const vat = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vat).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vat', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vat', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vat', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a Vat', () => {
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

    describe('addVatToCollectionIfMissing', () => {
      it('should add a Vat to an empty array', () => {
        const vat: IVat = sampleWithRequiredData;
        expectedResult = service.addVatToCollectionIfMissing([], vat);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vat);
      });

      it('should not add a Vat to an array that contains it', () => {
        const vat: IVat = sampleWithRequiredData;
        const vatCollection: IVat[] = [
          {
            ...vat,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVatToCollectionIfMissing(vatCollection, vat);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vat to an array that doesn't contain it", () => {
        const vat: IVat = sampleWithRequiredData;
        const vatCollection: IVat[] = [sampleWithPartialData];
        expectedResult = service.addVatToCollectionIfMissing(vatCollection, vat);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vat);
      });

      it('should add only unique Vat to an array', () => {
        const vatArray: IVat[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vatCollection: IVat[] = [sampleWithRequiredData];
        expectedResult = service.addVatToCollectionIfMissing(vatCollection, ...vatArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vat: IVat = sampleWithRequiredData;
        const vat2: IVat = sampleWithPartialData;
        expectedResult = service.addVatToCollectionIfMissing([], vat, vat2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vat);
        expect(expectedResult).toContain(vat2);
      });

      it('should accept null and undefined values', () => {
        const vat: IVat = sampleWithRequiredData;
        expectedResult = service.addVatToCollectionIfMissing([], null, vat, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vat);
      });

      it('should return initial array if no Vat is added', () => {
        const vatCollection: IVat[] = [sampleWithRequiredData];
        expectedResult = service.addVatToCollectionIfMissing(vatCollection, undefined, null);
        expect(expectedResult).toEqual(vatCollection);
      });
    });

    describe('compareVat', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVat(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 20394 };
        const entity2 = null;

        const compareResult1 = service.compareVat(entity1, entity2);
        const compareResult2 = service.compareVat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 20394 };
        const entity2 = { id: 11094 };

        const compareResult1 = service.compareVat(entity1, entity2);
        const compareResult2 = service.compareVat(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 20394 };
        const entity2 = { id: 20394 };

        const compareResult1 = service.compareVat(entity1, entity2);
        const compareResult2 = service.compareVat(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
