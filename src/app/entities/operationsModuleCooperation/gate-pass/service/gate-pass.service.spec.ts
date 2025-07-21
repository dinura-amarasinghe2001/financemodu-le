import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IGatePass } from '../gate-pass.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../gate-pass.test-samples';

import { GatePassService, RestGatePass } from './gate-pass.service';

const requireRestSample: RestGatePass = {
  ...sampleWithRequiredData,
  entryDateTime: sampleWithRequiredData.entryDateTime?.toJSON(),
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('GatePass Service', () => {
  let service: GatePassService;
  let httpMock: HttpTestingController;
  let expectedResult: IGatePass | IGatePass[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(GatePassService);
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

    it('should create a GatePass', () => {
      const gatePass = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gatePass).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GatePass', () => {
      const gatePass = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gatePass).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GatePass', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GatePass', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GatePass', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a GatePass', () => {
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

    describe('addGatePassToCollectionIfMissing', () => {
      it('should add a GatePass to an empty array', () => {
        const gatePass: IGatePass = sampleWithRequiredData;
        expectedResult = service.addGatePassToCollectionIfMissing([], gatePass);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gatePass);
      });

      it('should not add a GatePass to an array that contains it', () => {
        const gatePass: IGatePass = sampleWithRequiredData;
        const gatePassCollection: IGatePass[] = [
          {
            ...gatePass,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGatePassToCollectionIfMissing(gatePassCollection, gatePass);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GatePass to an array that doesn't contain it", () => {
        const gatePass: IGatePass = sampleWithRequiredData;
        const gatePassCollection: IGatePass[] = [sampleWithPartialData];
        expectedResult = service.addGatePassToCollectionIfMissing(gatePassCollection, gatePass);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gatePass);
      });

      it('should add only unique GatePass to an array', () => {
        const gatePassArray: IGatePass[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gatePassCollection: IGatePass[] = [sampleWithRequiredData];
        expectedResult = service.addGatePassToCollectionIfMissing(gatePassCollection, ...gatePassArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gatePass: IGatePass = sampleWithRequiredData;
        const gatePass2: IGatePass = sampleWithPartialData;
        expectedResult = service.addGatePassToCollectionIfMissing([], gatePass, gatePass2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gatePass);
        expect(expectedResult).toContain(gatePass2);
      });

      it('should accept null and undefined values', () => {
        const gatePass: IGatePass = sampleWithRequiredData;
        expectedResult = service.addGatePassToCollectionIfMissing([], null, gatePass, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gatePass);
      });

      it('should return initial array if no GatePass is added', () => {
        const gatePassCollection: IGatePass[] = [sampleWithRequiredData];
        expectedResult = service.addGatePassToCollectionIfMissing(gatePassCollection, undefined, null);
        expect(expectedResult).toEqual(gatePassCollection);
      });
    });

    describe('compareGatePass', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGatePass(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 23675 };
        const entity2 = null;

        const compareResult1 = service.compareGatePass(entity1, entity2);
        const compareResult2 = service.compareGatePass(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 23675 };
        const entity2 = { id: 17115 };

        const compareResult1 = service.compareGatePass(entity1, entity2);
        const compareResult2 = service.compareGatePass(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 23675 };
        const entity2 = { id: 23675 };

        const compareResult1 = service.compareGatePass(entity1, entity2);
        const compareResult2 = service.compareGatePass(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
