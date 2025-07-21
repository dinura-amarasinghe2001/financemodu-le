import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEstimate } from '../estimate.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../estimate.test-samples';

import { EstimateService, RestEstimate } from './estimate.service';

const requireRestSample: RestEstimate = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Estimate Service', () => {
  let service: EstimateService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstimate | IEstimate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EstimateService);
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

    it('should create a Estimate', () => {
      const estimate = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estimate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estimate', () => {
      const estimate = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estimate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estimate', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estimate', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Estimate', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a Estimate', () => {
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

    describe('addEstimateToCollectionIfMissing', () => {
      it('should add a Estimate to an empty array', () => {
        const estimate: IEstimate = sampleWithRequiredData;
        expectedResult = service.addEstimateToCollectionIfMissing([], estimate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimate);
      });

      it('should not add a Estimate to an array that contains it', () => {
        const estimate: IEstimate = sampleWithRequiredData;
        const estimateCollection: IEstimate[] = [
          {
            ...estimate,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstimateToCollectionIfMissing(estimateCollection, estimate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estimate to an array that doesn't contain it", () => {
        const estimate: IEstimate = sampleWithRequiredData;
        const estimateCollection: IEstimate[] = [sampleWithPartialData];
        expectedResult = service.addEstimateToCollectionIfMissing(estimateCollection, estimate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimate);
      });

      it('should add only unique Estimate to an array', () => {
        const estimateArray: IEstimate[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estimateCollection: IEstimate[] = [sampleWithRequiredData];
        expectedResult = service.addEstimateToCollectionIfMissing(estimateCollection, ...estimateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estimate: IEstimate = sampleWithRequiredData;
        const estimate2: IEstimate = sampleWithPartialData;
        expectedResult = service.addEstimateToCollectionIfMissing([], estimate, estimate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimate);
        expect(expectedResult).toContain(estimate2);
      });

      it('should accept null and undefined values', () => {
        const estimate: IEstimate = sampleWithRequiredData;
        expectedResult = service.addEstimateToCollectionIfMissing([], null, estimate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimate);
      });

      it('should return initial array if no Estimate is added', () => {
        const estimateCollection: IEstimate[] = [sampleWithRequiredData];
        expectedResult = service.addEstimateToCollectionIfMissing(estimateCollection, undefined, null);
        expect(expectedResult).toEqual(estimateCollection);
      });
    });

    describe('compareEstimate', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstimate(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 10142 };
        const entity2 = null;

        const compareResult1 = service.compareEstimate(entity1, entity2);
        const compareResult2 = service.compareEstimate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 10142 };
        const entity2 = { id: 13288 };

        const compareResult1 = service.compareEstimate(entity1, entity2);
        const compareResult2 = service.compareEstimate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 10142 };
        const entity2 = { id: 10142 };

        const compareResult1 = service.compareEstimate(entity1, entity2);
        const compareResult2 = service.compareEstimate(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
