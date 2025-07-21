import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IVehicleModel } from '../vehicle-model.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../vehicle-model.test-samples';

import { RestVehicleModel, VehicleModelService } from './vehicle-model.service';

const requireRestSample: RestVehicleModel = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('VehicleModel Service', () => {
  let service: VehicleModelService;
  let httpMock: HttpTestingController;
  let expectedResult: IVehicleModel | IVehicleModel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(VehicleModelService);
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

    it('should create a VehicleModel', () => {
      const vehicleModel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vehicleModel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VehicleModel', () => {
      const vehicleModel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vehicleModel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VehicleModel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VehicleModel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VehicleModel', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a VehicleModel', () => {
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

    describe('addVehicleModelToCollectionIfMissing', () => {
      it('should add a VehicleModel to an empty array', () => {
        const vehicleModel: IVehicleModel = sampleWithRequiredData;
        expectedResult = service.addVehicleModelToCollectionIfMissing([], vehicleModel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleModel);
      });

      it('should not add a VehicleModel to an array that contains it', () => {
        const vehicleModel: IVehicleModel = sampleWithRequiredData;
        const vehicleModelCollection: IVehicleModel[] = [
          {
            ...vehicleModel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVehicleModelToCollectionIfMissing(vehicleModelCollection, vehicleModel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VehicleModel to an array that doesn't contain it", () => {
        const vehicleModel: IVehicleModel = sampleWithRequiredData;
        const vehicleModelCollection: IVehicleModel[] = [sampleWithPartialData];
        expectedResult = service.addVehicleModelToCollectionIfMissing(vehicleModelCollection, vehicleModel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleModel);
      });

      it('should add only unique VehicleModel to an array', () => {
        const vehicleModelArray: IVehicleModel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vehicleModelCollection: IVehicleModel[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleModelToCollectionIfMissing(vehicleModelCollection, ...vehicleModelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vehicleModel: IVehicleModel = sampleWithRequiredData;
        const vehicleModel2: IVehicleModel = sampleWithPartialData;
        expectedResult = service.addVehicleModelToCollectionIfMissing([], vehicleModel, vehicleModel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehicleModel);
        expect(expectedResult).toContain(vehicleModel2);
      });

      it('should accept null and undefined values', () => {
        const vehicleModel: IVehicleModel = sampleWithRequiredData;
        expectedResult = service.addVehicleModelToCollectionIfMissing([], null, vehicleModel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehicleModel);
      });

      it('should return initial array if no VehicleModel is added', () => {
        const vehicleModelCollection: IVehicleModel[] = [sampleWithRequiredData];
        expectedResult = service.addVehicleModelToCollectionIfMissing(vehicleModelCollection, undefined, null);
        expect(expectedResult).toEqual(vehicleModelCollection);
      });
    });

    describe('compareVehicleModel', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVehicleModel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 21042 };
        const entity2 = null;

        const compareResult1 = service.compareVehicleModel(entity1, entity2);
        const compareResult2 = service.compareVehicleModel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 21042 };
        const entity2 = { id: 16214 };

        const compareResult1 = service.compareVehicleModel(entity1, entity2);
        const compareResult2 = service.compareVehicleModel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 21042 };
        const entity2 = { id: 21042 };

        const compareResult1 = service.compareVehicleModel(entity1, entity2);
        const compareResult2 = service.compareVehicleModel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
