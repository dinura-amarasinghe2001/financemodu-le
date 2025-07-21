import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IFlag } from '../flag.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../flag.test-samples';

import { FlagService, RestFlag } from './flag.service';

const requireRestSample: RestFlag = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('Flag Service', () => {
  let service: FlagService;
  let httpMock: HttpTestingController;
  let expectedResult: IFlag | IFlag[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(FlagService);
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

    it('should create a Flag', () => {
      const flag = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(flag).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Flag', () => {
      const flag = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(flag).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Flag', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Flag', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Flag', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a Flag', () => {
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

    describe('addFlagToCollectionIfMissing', () => {
      it('should add a Flag to an empty array', () => {
        const flag: IFlag = sampleWithRequiredData;
        expectedResult = service.addFlagToCollectionIfMissing([], flag);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(flag);
      });

      it('should not add a Flag to an array that contains it', () => {
        const flag: IFlag = sampleWithRequiredData;
        const flagCollection: IFlag[] = [
          {
            ...flag,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFlagToCollectionIfMissing(flagCollection, flag);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Flag to an array that doesn't contain it", () => {
        const flag: IFlag = sampleWithRequiredData;
        const flagCollection: IFlag[] = [sampleWithPartialData];
        expectedResult = service.addFlagToCollectionIfMissing(flagCollection, flag);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(flag);
      });

      it('should add only unique Flag to an array', () => {
        const flagArray: IFlag[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const flagCollection: IFlag[] = [sampleWithRequiredData];
        expectedResult = service.addFlagToCollectionIfMissing(flagCollection, ...flagArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const flag: IFlag = sampleWithRequiredData;
        const flag2: IFlag = sampleWithPartialData;
        expectedResult = service.addFlagToCollectionIfMissing([], flag, flag2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(flag);
        expect(expectedResult).toContain(flag2);
      });

      it('should accept null and undefined values', () => {
        const flag: IFlag = sampleWithRequiredData;
        expectedResult = service.addFlagToCollectionIfMissing([], null, flag, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(flag);
      });

      it('should return initial array if no Flag is added', () => {
        const flagCollection: IFlag[] = [sampleWithRequiredData];
        expectedResult = service.addFlagToCollectionIfMissing(flagCollection, undefined, null);
        expect(expectedResult).toEqual(flagCollection);
      });
    });

    describe('compareFlag', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFlag(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25480 };
        const entity2 = null;

        const compareResult1 = service.compareFlag(entity1, entity2);
        const compareResult2 = service.compareFlag(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25480 };
        const entity2 = { id: 28792 };

        const compareResult1 = service.compareFlag(entity1, entity2);
        const compareResult2 = service.compareFlag(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25480 };
        const entity2 = { id: 25480 };

        const compareResult1 = service.compareFlag(entity1, entity2);
        const compareResult2 = service.compareFlag(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
