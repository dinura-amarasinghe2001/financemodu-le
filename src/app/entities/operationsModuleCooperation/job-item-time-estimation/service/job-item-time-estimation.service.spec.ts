import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IJobItemTimeEstimation } from '../job-item-time-estimation.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../job-item-time-estimation.test-samples';

import { JobItemTimeEstimationService, RestJobItemTimeEstimation } from './job-item-time-estimation.service';

const requireRestSample: RestJobItemTimeEstimation = {
  ...sampleWithRequiredData,
  startDateTime: sampleWithRequiredData.startDateTime?.toJSON(),
  endDateTime: sampleWithRequiredData.endDateTime?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('JobItemTimeEstimation Service', () => {
  let service: JobItemTimeEstimationService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobItemTimeEstimation | IJobItemTimeEstimation[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JobItemTimeEstimationService);
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

    it('should create a JobItemTimeEstimation', () => {
      const jobItemTimeEstimation = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobItemTimeEstimation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobItemTimeEstimation', () => {
      const jobItemTimeEstimation = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobItemTimeEstimation).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobItemTimeEstimation', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobItemTimeEstimation', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobItemTimeEstimation', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a JobItemTimeEstimation', () => {
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

    describe('addJobItemTimeEstimationToCollectionIfMissing', () => {
      it('should add a JobItemTimeEstimation to an empty array', () => {
        const jobItemTimeEstimation: IJobItemTimeEstimation = sampleWithRequiredData;
        expectedResult = service.addJobItemTimeEstimationToCollectionIfMissing([], jobItemTimeEstimation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobItemTimeEstimation);
      });

      it('should not add a JobItemTimeEstimation to an array that contains it', () => {
        const jobItemTimeEstimation: IJobItemTimeEstimation = sampleWithRequiredData;
        const jobItemTimeEstimationCollection: IJobItemTimeEstimation[] = [
          {
            ...jobItemTimeEstimation,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobItemTimeEstimationToCollectionIfMissing(jobItemTimeEstimationCollection, jobItemTimeEstimation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobItemTimeEstimation to an array that doesn't contain it", () => {
        const jobItemTimeEstimation: IJobItemTimeEstimation = sampleWithRequiredData;
        const jobItemTimeEstimationCollection: IJobItemTimeEstimation[] = [sampleWithPartialData];
        expectedResult = service.addJobItemTimeEstimationToCollectionIfMissing(jobItemTimeEstimationCollection, jobItemTimeEstimation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobItemTimeEstimation);
      });

      it('should add only unique JobItemTimeEstimation to an array', () => {
        const jobItemTimeEstimationArray: IJobItemTimeEstimation[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobItemTimeEstimationCollection: IJobItemTimeEstimation[] = [sampleWithRequiredData];
        expectedResult = service.addJobItemTimeEstimationToCollectionIfMissing(
          jobItemTimeEstimationCollection,
          ...jobItemTimeEstimationArray,
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobItemTimeEstimation: IJobItemTimeEstimation = sampleWithRequiredData;
        const jobItemTimeEstimation2: IJobItemTimeEstimation = sampleWithPartialData;
        expectedResult = service.addJobItemTimeEstimationToCollectionIfMissing([], jobItemTimeEstimation, jobItemTimeEstimation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobItemTimeEstimation);
        expect(expectedResult).toContain(jobItemTimeEstimation2);
      });

      it('should accept null and undefined values', () => {
        const jobItemTimeEstimation: IJobItemTimeEstimation = sampleWithRequiredData;
        expectedResult = service.addJobItemTimeEstimationToCollectionIfMissing([], null, jobItemTimeEstimation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobItemTimeEstimation);
      });

      it('should return initial array if no JobItemTimeEstimation is added', () => {
        const jobItemTimeEstimationCollection: IJobItemTimeEstimation[] = [sampleWithRequiredData];
        expectedResult = service.addJobItemTimeEstimationToCollectionIfMissing(jobItemTimeEstimationCollection, undefined, null);
        expect(expectedResult).toEqual(jobItemTimeEstimationCollection);
      });
    });

    describe('compareJobItemTimeEstimation', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobItemTimeEstimation(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 23103 };
        const entity2 = null;

        const compareResult1 = service.compareJobItemTimeEstimation(entity1, entity2);
        const compareResult2 = service.compareJobItemTimeEstimation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 23103 };
        const entity2 = { id: 5830 };

        const compareResult1 = service.compareJobItemTimeEstimation(entity1, entity2);
        const compareResult2 = service.compareJobItemTimeEstimation(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 23103 };
        const entity2 = { id: 23103 };

        const compareResult1 = service.compareJobItemTimeEstimation(entity1, entity2);
        const compareResult2 = service.compareJobItemTimeEstimation(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
