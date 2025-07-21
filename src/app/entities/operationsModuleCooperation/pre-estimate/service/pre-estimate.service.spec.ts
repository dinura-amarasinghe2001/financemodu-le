import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPreEstimate } from '../pre-estimate.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../pre-estimate.test-samples';

import { PreEstimateService, RestPreEstimate } from './pre-estimate.service';

const requireRestSample: RestPreEstimate = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('PreEstimate Service', () => {
  let service: PreEstimateService;
  let httpMock: HttpTestingController;
  let expectedResult: IPreEstimate | IPreEstimate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PreEstimateService);
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

    it('should create a PreEstimate', () => {
      const preEstimate = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(preEstimate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PreEstimate', () => {
      const preEstimate = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(preEstimate).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PreEstimate', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PreEstimate', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PreEstimate', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a PreEstimate', () => {
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

    describe('addPreEstimateToCollectionIfMissing', () => {
      it('should add a PreEstimate to an empty array', () => {
        const preEstimate: IPreEstimate = sampleWithRequiredData;
        expectedResult = service.addPreEstimateToCollectionIfMissing([], preEstimate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(preEstimate);
      });

      it('should not add a PreEstimate to an array that contains it', () => {
        const preEstimate: IPreEstimate = sampleWithRequiredData;
        const preEstimateCollection: IPreEstimate[] = [
          {
            ...preEstimate,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPreEstimateToCollectionIfMissing(preEstimateCollection, preEstimate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PreEstimate to an array that doesn't contain it", () => {
        const preEstimate: IPreEstimate = sampleWithRequiredData;
        const preEstimateCollection: IPreEstimate[] = [sampleWithPartialData];
        expectedResult = service.addPreEstimateToCollectionIfMissing(preEstimateCollection, preEstimate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(preEstimate);
      });

      it('should add only unique PreEstimate to an array', () => {
        const preEstimateArray: IPreEstimate[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const preEstimateCollection: IPreEstimate[] = [sampleWithRequiredData];
        expectedResult = service.addPreEstimateToCollectionIfMissing(preEstimateCollection, ...preEstimateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const preEstimate: IPreEstimate = sampleWithRequiredData;
        const preEstimate2: IPreEstimate = sampleWithPartialData;
        expectedResult = service.addPreEstimateToCollectionIfMissing([], preEstimate, preEstimate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(preEstimate);
        expect(expectedResult).toContain(preEstimate2);
      });

      it('should accept null and undefined values', () => {
        const preEstimate: IPreEstimate = sampleWithRequiredData;
        expectedResult = service.addPreEstimateToCollectionIfMissing([], null, preEstimate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(preEstimate);
      });

      it('should return initial array if no PreEstimate is added', () => {
        const preEstimateCollection: IPreEstimate[] = [sampleWithRequiredData];
        expectedResult = service.addPreEstimateToCollectionIfMissing(preEstimateCollection, undefined, null);
        expect(expectedResult).toEqual(preEstimateCollection);
      });
    });

    describe('comparePreEstimate', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePreEstimate(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 4197 };
        const entity2 = null;

        const compareResult1 = service.comparePreEstimate(entity1, entity2);
        const compareResult2 = service.comparePreEstimate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 4197 };
        const entity2 = { id: 13604 };

        const compareResult1 = service.comparePreEstimate(entity1, entity2);
        const compareResult2 = service.comparePreEstimate(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 4197 };
        const entity2 = { id: 4197 };

        const compareResult1 = service.comparePreEstimate(entity1, entity2);
        const compareResult2 = service.comparePreEstimate(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
