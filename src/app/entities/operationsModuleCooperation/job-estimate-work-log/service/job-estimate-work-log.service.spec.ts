import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IJobEstimateWorkLog } from '../job-estimate-work-log.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../job-estimate-work-log.test-samples';

import { JobEstimateWorkLogService, RestJobEstimateWorkLog } from './job-estimate-work-log.service';

const requireRestSample: RestJobEstimateWorkLog = {
  ...sampleWithRequiredData,
  workDate: sampleWithRequiredData.workDate?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('JobEstimateWorkLog Service', () => {
  let service: JobEstimateWorkLogService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobEstimateWorkLog | IJobEstimateWorkLog[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JobEstimateWorkLogService);
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

    it('should create a JobEstimateWorkLog', () => {
      const jobEstimateWorkLog = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobEstimateWorkLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobEstimateWorkLog', () => {
      const jobEstimateWorkLog = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobEstimateWorkLog).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobEstimateWorkLog', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobEstimateWorkLog', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobEstimateWorkLog', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a JobEstimateWorkLog', () => {
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

    describe('addJobEstimateWorkLogToCollectionIfMissing', () => {
      it('should add a JobEstimateWorkLog to an empty array', () => {
        const jobEstimateWorkLog: IJobEstimateWorkLog = sampleWithRequiredData;
        expectedResult = service.addJobEstimateWorkLogToCollectionIfMissing([], jobEstimateWorkLog);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobEstimateWorkLog);
      });

      it('should not add a JobEstimateWorkLog to an array that contains it', () => {
        const jobEstimateWorkLog: IJobEstimateWorkLog = sampleWithRequiredData;
        const jobEstimateWorkLogCollection: IJobEstimateWorkLog[] = [
          {
            ...jobEstimateWorkLog,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobEstimateWorkLogToCollectionIfMissing(jobEstimateWorkLogCollection, jobEstimateWorkLog);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobEstimateWorkLog to an array that doesn't contain it", () => {
        const jobEstimateWorkLog: IJobEstimateWorkLog = sampleWithRequiredData;
        const jobEstimateWorkLogCollection: IJobEstimateWorkLog[] = [sampleWithPartialData];
        expectedResult = service.addJobEstimateWorkLogToCollectionIfMissing(jobEstimateWorkLogCollection, jobEstimateWorkLog);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobEstimateWorkLog);
      });

      it('should add only unique JobEstimateWorkLog to an array', () => {
        const jobEstimateWorkLogArray: IJobEstimateWorkLog[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobEstimateWorkLogCollection: IJobEstimateWorkLog[] = [sampleWithRequiredData];
        expectedResult = service.addJobEstimateWorkLogToCollectionIfMissing(jobEstimateWorkLogCollection, ...jobEstimateWorkLogArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobEstimateWorkLog: IJobEstimateWorkLog = sampleWithRequiredData;
        const jobEstimateWorkLog2: IJobEstimateWorkLog = sampleWithPartialData;
        expectedResult = service.addJobEstimateWorkLogToCollectionIfMissing([], jobEstimateWorkLog, jobEstimateWorkLog2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobEstimateWorkLog);
        expect(expectedResult).toContain(jobEstimateWorkLog2);
      });

      it('should accept null and undefined values', () => {
        const jobEstimateWorkLog: IJobEstimateWorkLog = sampleWithRequiredData;
        expectedResult = service.addJobEstimateWorkLogToCollectionIfMissing([], null, jobEstimateWorkLog, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobEstimateWorkLog);
      });

      it('should return initial array if no JobEstimateWorkLog is added', () => {
        const jobEstimateWorkLogCollection: IJobEstimateWorkLog[] = [sampleWithRequiredData];
        expectedResult = service.addJobEstimateWorkLogToCollectionIfMissing(jobEstimateWorkLogCollection, undefined, null);
        expect(expectedResult).toEqual(jobEstimateWorkLogCollection);
      });
    });

    describe('compareJobEstimateWorkLog', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobEstimateWorkLog(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 23087 };
        const entity2 = null;

        const compareResult1 = service.compareJobEstimateWorkLog(entity1, entity2);
        const compareResult2 = service.compareJobEstimateWorkLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 23087 };
        const entity2 = { id: 32561 };

        const compareResult1 = service.compareJobEstimateWorkLog(entity1, entity2);
        const compareResult2 = service.compareJobEstimateWorkLog(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 23087 };
        const entity2 = { id: 23087 };

        const compareResult1 = service.compareJobEstimateWorkLog(entity1, entity2);
        const compareResult2 = service.compareJobEstimateWorkLog(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
