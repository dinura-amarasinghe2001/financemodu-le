import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IJobCard } from '../job-card.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../job-card.test-samples';

import { JobCardService, RestJobCard } from './job-card.service';

const requireRestSample: RestJobCard = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  jobCompleteDate: sampleWithRequiredData.jobCompleteDate?.toJSON(),
  boothDate: sampleWithRequiredData.boothDate?.toJSON(),
  tinkeringStartDateTime: sampleWithRequiredData.tinkeringStartDateTime?.toJSON(),
  tinkeringEndDateTime: sampleWithRequiredData.tinkeringEndDateTime?.toJSON(),
  paintStartDateTime: sampleWithRequiredData.paintStartDateTime?.toJSON(),
  paintEndDateTime: sampleWithRequiredData.paintEndDateTime?.toJSON(),
  qcStartDateTime: sampleWithRequiredData.qcStartDateTime?.toJSON(),
  qcEndDateTime: sampleWithRequiredData.qcEndDateTime?.toJSON(),
  sparePartStartDateTime: sampleWithRequiredData.sparePartStartDateTime?.toJSON(),
  sparePartEndDateTime: sampleWithRequiredData.sparePartEndDateTime?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('JobCard Service', () => {
  let service: JobCardService;
  let httpMock: HttpTestingController;
  let expectedResult: IJobCard | IJobCard[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(JobCardService);
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

    it('should create a JobCard', () => {
      const jobCard = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(jobCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a JobCard', () => {
      const jobCard = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(jobCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a JobCard', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of JobCard', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a JobCard', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a JobCard', () => {
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

    describe('addJobCardToCollectionIfMissing', () => {
      it('should add a JobCard to an empty array', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        expectedResult = service.addJobCardToCollectionIfMissing([], jobCard);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCard);
      });

      it('should not add a JobCard to an array that contains it', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        const jobCardCollection: IJobCard[] = [
          {
            ...jobCard,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, jobCard);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a JobCard to an array that doesn't contain it", () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        const jobCardCollection: IJobCard[] = [sampleWithPartialData];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, jobCard);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCard);
      });

      it('should add only unique JobCard to an array', () => {
        const jobCardArray: IJobCard[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const jobCardCollection: IJobCard[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, ...jobCardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        const jobCard2: IJobCard = sampleWithPartialData;
        expectedResult = service.addJobCardToCollectionIfMissing([], jobCard, jobCard2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(jobCard);
        expect(expectedResult).toContain(jobCard2);
      });

      it('should accept null and undefined values', () => {
        const jobCard: IJobCard = sampleWithRequiredData;
        expectedResult = service.addJobCardToCollectionIfMissing([], null, jobCard, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(jobCard);
      });

      it('should return initial array if no JobCard is added', () => {
        const jobCardCollection: IJobCard[] = [sampleWithRequiredData];
        expectedResult = service.addJobCardToCollectionIfMissing(jobCardCollection, undefined, null);
        expect(expectedResult).toEqual(jobCardCollection);
      });
    });

    describe('compareJobCard', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareJobCard(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 17032 };
        const entity2 = null;

        const compareResult1 = service.compareJobCard(entity1, entity2);
        const compareResult2 = service.compareJobCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 17032 };
        const entity2 = { id: 22665 };

        const compareResult1 = service.compareJobCard(entity1, entity2);
        const compareResult2 = service.compareJobCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 17032 };
        const entity2 = { id: 17032 };

        const compareResult1 = service.compareJobCard(entity1, entity2);
        const compareResult2 = service.compareJobCard(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
