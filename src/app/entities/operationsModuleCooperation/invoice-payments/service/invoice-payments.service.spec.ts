import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IInvoicePayments } from '../invoice-payments.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../invoice-payments.test-samples';

import { InvoicePaymentsService, RestInvoicePayments } from './invoice-payments.service';

const requireRestSample: RestInvoicePayments = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('InvoicePayments Service', () => {
  let service: InvoicePaymentsService;
  let httpMock: HttpTestingController;
  let expectedResult: IInvoicePayments | IInvoicePayments[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(InvoicePaymentsService);
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

    it('should create a InvoicePayments', () => {
      const invoicePayments = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(invoicePayments).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InvoicePayments', () => {
      const invoicePayments = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(invoicePayments).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InvoicePayments', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InvoicePayments', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InvoicePayments', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a InvoicePayments', () => {
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

    describe('addInvoicePaymentsToCollectionIfMissing', () => {
      it('should add a InvoicePayments to an empty array', () => {
        const invoicePayments: IInvoicePayments = sampleWithRequiredData;
        expectedResult = service.addInvoicePaymentsToCollectionIfMissing([], invoicePayments);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(invoicePayments);
      });

      it('should not add a InvoicePayments to an array that contains it', () => {
        const invoicePayments: IInvoicePayments = sampleWithRequiredData;
        const invoicePaymentsCollection: IInvoicePayments[] = [
          {
            ...invoicePayments,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInvoicePaymentsToCollectionIfMissing(invoicePaymentsCollection, invoicePayments);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InvoicePayments to an array that doesn't contain it", () => {
        const invoicePayments: IInvoicePayments = sampleWithRequiredData;
        const invoicePaymentsCollection: IInvoicePayments[] = [sampleWithPartialData];
        expectedResult = service.addInvoicePaymentsToCollectionIfMissing(invoicePaymentsCollection, invoicePayments);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(invoicePayments);
      });

      it('should add only unique InvoicePayments to an array', () => {
        const invoicePaymentsArray: IInvoicePayments[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const invoicePaymentsCollection: IInvoicePayments[] = [sampleWithRequiredData];
        expectedResult = service.addInvoicePaymentsToCollectionIfMissing(invoicePaymentsCollection, ...invoicePaymentsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const invoicePayments: IInvoicePayments = sampleWithRequiredData;
        const invoicePayments2: IInvoicePayments = sampleWithPartialData;
        expectedResult = service.addInvoicePaymentsToCollectionIfMissing([], invoicePayments, invoicePayments2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(invoicePayments);
        expect(expectedResult).toContain(invoicePayments2);
      });

      it('should accept null and undefined values', () => {
        const invoicePayments: IInvoicePayments = sampleWithRequiredData;
        expectedResult = service.addInvoicePaymentsToCollectionIfMissing([], null, invoicePayments, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(invoicePayments);
      });

      it('should return initial array if no InvoicePayments is added', () => {
        const invoicePaymentsCollection: IInvoicePayments[] = [sampleWithRequiredData];
        expectedResult = service.addInvoicePaymentsToCollectionIfMissing(invoicePaymentsCollection, undefined, null);
        expect(expectedResult).toEqual(invoicePaymentsCollection);
      });
    });

    describe('compareInvoicePayments', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInvoicePayments(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 1733 };
        const entity2 = null;

        const compareResult1 = service.compareInvoicePayments(entity1, entity2);
        const compareResult2 = service.compareInvoicePayments(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 1733 };
        const entity2 = { id: 28754 };

        const compareResult1 = service.compareInvoicePayments(entity1, entity2);
        const compareResult2 = service.compareInvoicePayments(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 1733 };
        const entity2 = { id: 1733 };

        const compareResult1 = service.compareInvoicePayments(entity1, entity2);
        const compareResult2 = service.compareInvoicePayments(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
