import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IJobEstimateWorkProducts } from '../job-estimate-work-products.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../job-estimate-work-products.test-samples';

import { JobEstimateWorkProductsService } from './job-estimate-work-products.service';

const requireRestSample: IJobEstimateWorkProducts = {
  ...sampleWithRequiredData,
};

describe('JobEstimateWorkProducts Service', () => {
  let service: JobEstimateWorkProductsService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobEstimateWorkProducts | IJobEstimateWorkProducts[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JobEstimateWorkProductsService);
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

    it('should create a JobEstimateWorkProducts', () => {
      const jobEstimateWorkProducts = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobEstimateWorkProducts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobEstimateWorkProducts', () => {
      const jobEstimateWorkProducts = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobEstimateWorkProducts).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobEstimateWorkProducts', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobEstimateWorkProducts', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobEstimateWorkProducts', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a JobEstimateWorkProducts', () => {
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

    describe('addJobEstimateWorkProductsToCollectionIfMissing', () => {
      it('should add a JobEstimateWorkProducts to an empty array', () => {
        const jobEstimateWorkProducts: IJobEstimateWorkProducts = sampleWithRequiredData;
        expectedResult = service.addJobEstimateWorkProductsToCollectionIfMissing([], jobEstimateWorkProducts);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobEstimateWorkProducts);
      });

      it('should not add a JobEstimateWorkProducts to an array that contains it', () => {
        const jobEstimateWorkProducts: IJobEstimateWorkProducts = sampleWithRequiredData;
        const jobEstimateWorkProductsCollection: IJobEstimateWorkProducts[] = [
          {
            ...jobEstimateWorkProducts,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobEstimateWorkProductsToCollectionIfMissing(
          jobEstimateWorkProductsCollection,
          jobEstimateWorkProducts,
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobEstimateWorkProducts to an array that doesn't contain it", () => {
        const jobEstimateWorkProducts: IJobEstimateWorkProducts = sampleWithRequiredData;
        const jobEstimateWorkProductsCollection: IJobEstimateWorkProducts[] = [sampleWithPartialData];
        expectedResult = service.addJobEstimateWorkProductsToCollectionIfMissing(
          jobEstimateWorkProductsCollection,
          jobEstimateWorkProducts,
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobEstimateWorkProducts);
      });

      it('should add only unique JobEstimateWorkProducts to an array', () => {
        const jobEstimateWorkProductsArray: IJobEstimateWorkProducts[] = [
          sampleWithRequiredData,
          sampleWithPartialData,
          sampleWithFullData,
        ];
        const jobEstimateWorkProductsCollection: IJobEstimateWorkProducts[] = [sampleWithRequiredData];
        expectedResult = service.addJobEstimateWorkProductsToCollectionIfMissing(
          jobEstimateWorkProductsCollection,
          ...jobEstimateWorkProductsArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobEstimateWorkProducts: IJobEstimateWorkProducts = sampleWithRequiredData;
        const jobEstimateWorkProducts2: IJobEstimateWorkProducts = sampleWithPartialData;
        expectedResult = service.addJobEstimateWorkProductsToCollectionIfMissing([], jobEstimateWorkProducts, jobEstimateWorkProducts2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobEstimateWorkProducts);
        expect(expectedResult).toContain(jobEstimateWorkProducts2);
      });

      it('should accept null and undefined values', () => {
        const jobEstimateWorkProducts: IJobEstimateWorkProducts = sampleWithRequiredData;
        expectedResult = service.addJobEstimateWorkProductsToCollectionIfMissing([], null, jobEstimateWorkProducts, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobEstimateWorkProducts);
      });

      it('should return initial array if no JobEstimateWorkProducts is added', () => {
        const jobEstimateWorkProductsCollection: IJobEstimateWorkProducts[] = [sampleWithRequiredData];
        expectedResult = service.addJobEstimateWorkProductsToCollectionIfMissing(jobEstimateWorkProductsCollection, undefined, null);
        expect(expectedResult).toEqual(jobEstimateWorkProductsCollection);
      });
    });

    describe('compareJobEstimateWorkProducts', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobEstimateWorkProducts(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 12305 };
        const entity2 = null;

        const compareResult1 = service.compareJobEstimateWorkProducts(entity1, entity2);
        const compareResult2 = service.compareJobEstimateWorkProducts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 12305 };
        const entity2 = { id: 253 };

        const compareResult1 = service.compareJobEstimateWorkProducts(entity1, entity2);
        const compareResult2 = service.compareJobEstimateWorkProducts(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 12305 };
        const entity2 = { id: 12305 };

        const compareResult1 = service.compareJobEstimateWorkProducts(entity1, entity2);
        const compareResult2 = service.compareJobEstimateWorkProducts(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
