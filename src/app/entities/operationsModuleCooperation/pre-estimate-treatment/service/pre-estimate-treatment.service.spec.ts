import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPreEstimateTreatment } from '../pre-estimate-treatment.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../pre-estimate-treatment.test-samples';

import { PreEstimateTreatmentService, RestPreEstimateTreatment } from './pre-estimate-treatment.service';

const requireRestSample: RestPreEstimateTreatment = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('PreEstimateTreatment Service', () => {
  let service: PreEstimateTreatmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IPreEstimateTreatment | IPreEstimateTreatment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PreEstimateTreatmentService);
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

    it('should create a PreEstimateTreatment', () => {
      const preEstimateTreatment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(preEstimateTreatment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PreEstimateTreatment', () => {
      const preEstimateTreatment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(preEstimateTreatment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PreEstimateTreatment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PreEstimateTreatment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PreEstimateTreatment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a PreEstimateTreatment', () => {
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

    describe('addPreEstimateTreatmentToCollectionIfMissing', () => {
      it('should add a PreEstimateTreatment to an empty array', () => {
        const preEstimateTreatment: IPreEstimateTreatment = sampleWithRequiredData;
        expectedResult = service.addPreEstimateTreatmentToCollectionIfMissing([], preEstimateTreatment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(preEstimateTreatment);
      });

      it('should not add a PreEstimateTreatment to an array that contains it', () => {
        const preEstimateTreatment: IPreEstimateTreatment = sampleWithRequiredData;
        const preEstimateTreatmentCollection: IPreEstimateTreatment[] = [
          {
            ...preEstimateTreatment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPreEstimateTreatmentToCollectionIfMissing(preEstimateTreatmentCollection, preEstimateTreatment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PreEstimateTreatment to an array that doesn't contain it", () => {
        const preEstimateTreatment: IPreEstimateTreatment = sampleWithRequiredData;
        const preEstimateTreatmentCollection: IPreEstimateTreatment[] = [sampleWithPartialData];
        expectedResult = service.addPreEstimateTreatmentToCollectionIfMissing(preEstimateTreatmentCollection, preEstimateTreatment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(preEstimateTreatment);
      });

      it('should add only unique PreEstimateTreatment to an array', () => {
        const preEstimateTreatmentArray: IPreEstimateTreatment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const preEstimateTreatmentCollection: IPreEstimateTreatment[] = [sampleWithRequiredData];
        expectedResult = service.addPreEstimateTreatmentToCollectionIfMissing(preEstimateTreatmentCollection, ...preEstimateTreatmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const preEstimateTreatment: IPreEstimateTreatment = sampleWithRequiredData;
        const preEstimateTreatment2: IPreEstimateTreatment = sampleWithPartialData;
        expectedResult = service.addPreEstimateTreatmentToCollectionIfMissing([], preEstimateTreatment, preEstimateTreatment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(preEstimateTreatment);
        expect(expectedResult).toContain(preEstimateTreatment2);
      });

      it('should accept null and undefined values', () => {
        const preEstimateTreatment: IPreEstimateTreatment = sampleWithRequiredData;
        expectedResult = service.addPreEstimateTreatmentToCollectionIfMissing([], null, preEstimateTreatment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(preEstimateTreatment);
      });

      it('should return initial array if no PreEstimateTreatment is added', () => {
        const preEstimateTreatmentCollection: IPreEstimateTreatment[] = [sampleWithRequiredData];
        expectedResult = service.addPreEstimateTreatmentToCollectionIfMissing(preEstimateTreatmentCollection, undefined, null);
        expect(expectedResult).toEqual(preEstimateTreatmentCollection);
      });
    });

    describe('comparePreEstimateTreatment', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePreEstimateTreatment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 4710 };
        const entity2 = null;

        const compareResult1 = service.comparePreEstimateTreatment(entity1, entity2);
        const compareResult2 = service.comparePreEstimateTreatment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 4710 };
        const entity2 = { id: 27853 };

        const compareResult1 = service.comparePreEstimateTreatment(entity1, entity2);
        const compareResult2 = service.comparePreEstimateTreatment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 4710 };
        const entity2 = { id: 4710 };

        const compareResult1 = service.comparePreEstimateTreatment(entity1, entity2);
        const compareResult2 = service.comparePreEstimateTreatment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
