import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IEstimateTreatment } from '../estimate-treatment.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../estimate-treatment.test-samples';

import { EstimateTreatmentService, RestEstimateTreatment } from './estimate-treatment.service';

const requireRestSample: RestEstimateTreatment = {
  ...sampleWithRequiredData,
  approvedDate: sampleWithRequiredData.approvedDate?.format(DATE_FORMAT),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('EstimateTreatment Service', () => {
  let service: EstimateTreatmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstimateTreatment | IEstimateTreatment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EstimateTreatmentService);
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

    it('should create a EstimateTreatment', () => {
      const estimateTreatment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estimateTreatment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EstimateTreatment', () => {
      const estimateTreatment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estimateTreatment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EstimateTreatment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EstimateTreatment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EstimateTreatment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a EstimateTreatment', () => {
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

    describe('addEstimateTreatmentToCollectionIfMissing', () => {
      it('should add a EstimateTreatment to an empty array', () => {
        const estimateTreatment: IEstimateTreatment = sampleWithRequiredData;
        expectedResult = service.addEstimateTreatmentToCollectionIfMissing([], estimateTreatment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimateTreatment);
      });

      it('should not add a EstimateTreatment to an array that contains it', () => {
        const estimateTreatment: IEstimateTreatment = sampleWithRequiredData;
        const estimateTreatmentCollection: IEstimateTreatment[] = [
          {
            ...estimateTreatment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstimateTreatmentToCollectionIfMissing(estimateTreatmentCollection, estimateTreatment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EstimateTreatment to an array that doesn't contain it", () => {
        const estimateTreatment: IEstimateTreatment = sampleWithRequiredData;
        const estimateTreatmentCollection: IEstimateTreatment[] = [sampleWithPartialData];
        expectedResult = service.addEstimateTreatmentToCollectionIfMissing(estimateTreatmentCollection, estimateTreatment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimateTreatment);
      });

      it('should add only unique EstimateTreatment to an array', () => {
        const estimateTreatmentArray: IEstimateTreatment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estimateTreatmentCollection: IEstimateTreatment[] = [sampleWithRequiredData];
        expectedResult = service.addEstimateTreatmentToCollectionIfMissing(estimateTreatmentCollection, ...estimateTreatmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estimateTreatment: IEstimateTreatment = sampleWithRequiredData;
        const estimateTreatment2: IEstimateTreatment = sampleWithPartialData;
        expectedResult = service.addEstimateTreatmentToCollectionIfMissing([], estimateTreatment, estimateTreatment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimateTreatment);
        expect(expectedResult).toContain(estimateTreatment2);
      });

      it('should accept null and undefined values', () => {
        const estimateTreatment: IEstimateTreatment = sampleWithRequiredData;
        expectedResult = service.addEstimateTreatmentToCollectionIfMissing([], null, estimateTreatment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimateTreatment);
      });

      it('should return initial array if no EstimateTreatment is added', () => {
        const estimateTreatmentCollection: IEstimateTreatment[] = [sampleWithRequiredData];
        expectedResult = service.addEstimateTreatmentToCollectionIfMissing(estimateTreatmentCollection, undefined, null);
        expect(expectedResult).toEqual(estimateTreatmentCollection);
      });
    });

    describe('compareEstimateTreatment', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstimateTreatment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 15317 };
        const entity2 = null;

        const compareResult1 = service.compareEstimateTreatment(entity1, entity2);
        const compareResult2 = service.compareEstimateTreatment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 15317 };
        const entity2 = { id: 25790 };

        const compareResult1 = service.compareEstimateTreatment(entity1, entity2);
        const compareResult2 = service.compareEstimateTreatment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 15317 };
        const entity2 = { id: 15317 };

        const compareResult1 = service.compareEstimateTreatment(entity1, entity2);
        const compareResult2 = service.compareEstimateTreatment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
