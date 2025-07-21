import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ISupplierBank } from '../supplier-bank.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../supplier-bank.test-samples';

import { RestSupplierBank, SupplierBankService } from './supplier-bank.service';

const requireRestSample: RestSupplierBank = {
  ...sampleWithRequiredData,
  lmd: sampleWithRequiredData.lmd?.toJSON(),
};

describe('SupplierBank Service', () => {
  let service: SupplierBankService;
  let httpMock: HttpTestingController;
  let expectedResult: ISupplierBank | ISupplierBank[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(SupplierBankService);
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

    it('should create a SupplierBank', () => {
      const supplierBank = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(supplierBank).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SupplierBank', () => {
      const supplierBank = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(supplierBank).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SupplierBank', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SupplierBank', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SupplierBank', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a SupplierBank', () => {
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

    describe('addSupplierBankToCollectionIfMissing', () => {
      it('should add a SupplierBank to an empty array', () => {
        const supplierBank: ISupplierBank = sampleWithRequiredData;
        expectedResult = service.addSupplierBankToCollectionIfMissing([], supplierBank);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(supplierBank);
      });

      it('should not add a SupplierBank to an array that contains it', () => {
        const supplierBank: ISupplierBank = sampleWithRequiredData;
        const supplierBankCollection: ISupplierBank[] = [
          {
            ...supplierBank,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSupplierBankToCollectionIfMissing(supplierBankCollection, supplierBank);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SupplierBank to an array that doesn't contain it", () => {
        const supplierBank: ISupplierBank = sampleWithRequiredData;
        const supplierBankCollection: ISupplierBank[] = [sampleWithPartialData];
        expectedResult = service.addSupplierBankToCollectionIfMissing(supplierBankCollection, supplierBank);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(supplierBank);
      });

      it('should add only unique SupplierBank to an array', () => {
        const supplierBankArray: ISupplierBank[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const supplierBankCollection: ISupplierBank[] = [sampleWithRequiredData];
        expectedResult = service.addSupplierBankToCollectionIfMissing(supplierBankCollection, ...supplierBankArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const supplierBank: ISupplierBank = sampleWithRequiredData;
        const supplierBank2: ISupplierBank = sampleWithPartialData;
        expectedResult = service.addSupplierBankToCollectionIfMissing([], supplierBank, supplierBank2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(supplierBank);
        expect(expectedResult).toContain(supplierBank2);
      });

      it('should accept null and undefined values', () => {
        const supplierBank: ISupplierBank = sampleWithRequiredData;
        expectedResult = service.addSupplierBankToCollectionIfMissing([], null, supplierBank, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(supplierBank);
      });

      it('should return initial array if no SupplierBank is added', () => {
        const supplierBankCollection: ISupplierBank[] = [sampleWithRequiredData];
        expectedResult = service.addSupplierBankToCollectionIfMissing(supplierBankCollection, undefined, null);
        expect(expectedResult).toEqual(supplierBankCollection);
      });
    });

    describe('compareSupplierBank', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSupplierBank(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 18075 };
        const entity2 = null;

        const compareResult1 = service.compareSupplierBank(entity1, entity2);
        const compareResult2 = service.compareSupplierBank(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 18075 };
        const entity2 = { id: 12824 };

        const compareResult1 = service.compareSupplierBank(entity1, entity2);
        const compareResult2 = service.compareSupplierBank(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 18075 };
        const entity2 = { id: 18075 };

        const compareResult1 = service.compareSupplierBank(entity1, entity2);
        const compareResult2 = service.compareSupplierBank(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
