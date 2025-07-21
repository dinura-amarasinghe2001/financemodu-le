import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IBankBranch } from '../bank-branch.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../bank-branch.test-samples';

import { BankBranchService } from './bank-branch.service';

const requireRestSample: IBankBranch = {
  ...sampleWithRequiredData,
};

describe('BankBranch Service', () => {
  let service: BankBranchService;
  let httpMock: HttpTestingController;
  let expectedResult: IBankBranch | IBankBranch[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BankBranchService);
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

    it('should create a BankBranch', () => {
      const bankBranch = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(bankBranch).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BankBranch', () => {
      const bankBranch = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(bankBranch).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BankBranch', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BankBranch', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BankBranch', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a BankBranch', () => {
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

    describe('addBankBranchToCollectionIfMissing', () => {
      it('should add a BankBranch to an empty array', () => {
        const bankBranch: IBankBranch = sampleWithRequiredData;
        expectedResult = service.addBankBranchToCollectionIfMissing([], bankBranch);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankBranch);
      });

      it('should not add a BankBranch to an array that contains it', () => {
        const bankBranch: IBankBranch = sampleWithRequiredData;
        const bankBranchCollection: IBankBranch[] = [
          {
            ...bankBranch,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, bankBranch);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BankBranch to an array that doesn't contain it", () => {
        const bankBranch: IBankBranch = sampleWithRequiredData;
        const bankBranchCollection: IBankBranch[] = [sampleWithPartialData];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, bankBranch);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankBranch);
      });

      it('should add only unique BankBranch to an array', () => {
        const bankBranchArray: IBankBranch[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bankBranchCollection: IBankBranch[] = [sampleWithRequiredData];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, ...bankBranchArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bankBranch: IBankBranch = sampleWithRequiredData;
        const bankBranch2: IBankBranch = sampleWithPartialData;
        expectedResult = service.addBankBranchToCollectionIfMissing([], bankBranch, bankBranch2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankBranch);
        expect(expectedResult).toContain(bankBranch2);
      });

      it('should accept null and undefined values', () => {
        const bankBranch: IBankBranch = sampleWithRequiredData;
        expectedResult = service.addBankBranchToCollectionIfMissing([], null, bankBranch, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankBranch);
      });

      it('should return initial array if no BankBranch is added', () => {
        const bankBranchCollection: IBankBranch[] = [sampleWithRequiredData];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, undefined, null);
        expect(expectedResult).toEqual(bankBranchCollection);
      });
    });

    describe('compareBankBranch', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBankBranch(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 5446 };
        const entity2 = null;

        const compareResult1 = service.compareBankBranch(entity1, entity2);
        const compareResult2 = service.compareBankBranch(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 5446 };
        const entity2 = { id: 31095 };

        const compareResult1 = service.compareBankBranch(entity1, entity2);
        const compareResult2 = service.compareBankBranch(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 5446 };
        const entity2 = { id: 5446 };

        const compareResult1 = service.compareBankBranch(entity1, entity2);
        const compareResult2 = service.compareBankBranch(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
