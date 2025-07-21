import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IJobEstimate } from '../job-estimate.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../job-estimate.test-samples';

import { JobEstimateService, RestJobEstimate } from './job-estimate.service';

const requireRestSample: RestJobEstimate = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
  estStartDate: sampleWithRequiredData.estStartDate?.toJSON(),
  estEndDate: sampleWithRequiredData.estEndDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('JobEstimate Service', () => {
  let service: JobEstimateService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobEstimate | IJobEstimate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JobEstimateService);
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

    it('should create a JobEstimate', () => {
      const jobEstimate = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobEstimate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobEstimate', () => {
      const jobEstimate = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobEstimate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobEstimate', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobEstimate', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobEstimate', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a JobEstimate', () => {
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

    describe('addJobEstimateToCollectionIfMissing', () => {
      it('should add a JobEstimate to an empty array', () => {
        const jobEstimate: IJobEstimate = sampleWithRequiredData;
        expectedResult = service.addJobEstimateToCollectionIfMissing([], jobEstimate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobEstimate);
      });

      it('should not add a JobEstimate to an array that contains it', () => {
        const jobEstimate: IJobEstimate = sampleWithRequiredData;
        const jobEstimateCollection: IJobEstimate[] = [
          {
            ...jobEstimate,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobEstimateToCollectionIfMissing(jobEstimateCollection, jobEstimate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobEstimate to an array that doesn't contain it", () => {
        const jobEstimate: IJobEstimate = sampleWithRequiredData;
        const jobEstimateCollection: IJobEstimate[] = [sampleWithPartialData];
        expectedResult = service.addJobEstimateToCollectionIfMissing(jobEstimateCollection, jobEstimate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobEstimate);
      });

      it('should add only unique JobEstimate to an array', () => {
        const jobEstimateArray: IJobEstimate[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobEstimateCollection: IJobEstimate[] = [sampleWithRequiredData];
        expectedResult = service.addJobEstimateToCollectionIfMissing(jobEstimateCollection, ...jobEstimateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobEstimate: IJobEstimate = sampleWithRequiredData;
        const jobEstimate2: IJobEstimate = sampleWithPartialData;
        expectedResult = service.addJobEstimateToCollectionIfMissing([], jobEstimate, jobEstimate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobEstimate);
        expect(expectedResult).toContain(jobEstimate2);
      });

      it('should accept null and undefined values', () => {
        const jobEstimate: IJobEstimate = sampleWithRequiredData;
        expectedResult = service.addJobEstimateToCollectionIfMissing([], null, jobEstimate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobEstimate);
      });

      it('should return initial array if no JobEstimate is added', () => {
        const jobEstimateCollection: IJobEstimate[] = [sampleWithRequiredData];
        expectedResult = service.addJobEstimateToCollectionIfMissing(jobEstimateCollection, undefined, null);
        expect(expectedResult).toEqual(jobEstimateCollection);
      });
    });

    describe('compareJobEstimate', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobEstimate(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25602 };
        const entity2 = null;

        const compareResult1 = service.compareJobEstimate(entity1, entity2);
        const compareResult2 = service.compareJobEstimate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25602 };
        const entity2 = { id: 15846 };

        const compareResult1 = service.compareJobEstimate(entity1, entity2);
        const compareResult2 = service.compareJobEstimate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25602 };
        const entity2 = { id: 25602 };

        const compareResult1 = service.compareJobEstimate(entity1, entity2);
        const compareResult2 = service.compareJobEstimate(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
