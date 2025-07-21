import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IInventoryBatches } from '../inventory-batches.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../inventory-batches.test-samples';

import { InventoryBatchesService, RestInventoryBatches } from './inventory-batches.service';

const requireRestSample: RestInventoryBatches = {
  ...sampleWithRequiredData,
  txDate: sampleWithRequiredData.txDate?.toJSON(),
  lmd: sampleWithRequiredData.lmd?.toJSON(),
  manufactureDate: sampleWithRequiredData.manufactureDate?.toJSON(),
  expireDate: sampleWithRequiredData.expireDate?.toJSON(),
  addedDate: sampleWithRequiredData.addedDate?.toJSON(),
};

describe('InventoryBatches Service', () => {
  let service: InventoryBatchesService;
  let httpMock: HttpTestingController;
  let expectedResult: IInventoryBatches | IInventoryBatches[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(InventoryBatchesService);
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

    it('should create a InventoryBatches', () => {
      const inventoryBatches = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(inventoryBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InventoryBatches', () => {
      const inventoryBatches = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(inventoryBatches).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InventoryBatches', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InventoryBatches', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InventoryBatches', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a InventoryBatches', () => {
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

    describe('addInventoryBatchesToCollectionIfMissing', () => {
      it('should add a InventoryBatches to an empty array', () => {
        const inventoryBatches: IInventoryBatches = sampleWithRequiredData;
        expectedResult = service.addInventoryBatchesToCollectionIfMissing([], inventoryBatches);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inventoryBatches);
      });

      it('should not add a InventoryBatches to an array that contains it', () => {
        const inventoryBatches: IInventoryBatches = sampleWithRequiredData;
        const inventoryBatchesCollection: IInventoryBatches[] = [
          {
            ...inventoryBatches,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInventoryBatchesToCollectionIfMissing(inventoryBatchesCollection, inventoryBatches);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InventoryBatches to an array that doesn't contain it", () => {
        const inventoryBatches: IInventoryBatches = sampleWithRequiredData;
        const inventoryBatchesCollection: IInventoryBatches[] = [sampleWithPartialData];
        expectedResult = service.addInventoryBatchesToCollectionIfMissing(inventoryBatchesCollection, inventoryBatches);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inventoryBatches);
      });

      it('should add only unique InventoryBatches to an array', () => {
        const inventoryBatchesArray: IInventoryBatches[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const inventoryBatchesCollection: IInventoryBatches[] = [sampleWithRequiredData];
        expectedResult = service.addInventoryBatchesToCollectionIfMissing(inventoryBatchesCollection, ...inventoryBatchesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const inventoryBatches: IInventoryBatches = sampleWithRequiredData;
        const inventoryBatches2: IInventoryBatches = sampleWithPartialData;
        expectedResult = service.addInventoryBatchesToCollectionIfMissing([], inventoryBatches, inventoryBatches2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(inventoryBatches);
        expect(expectedResult).toContain(inventoryBatches2);
      });

      it('should accept null and undefined values', () => {
        const inventoryBatches: IInventoryBatches = sampleWithRequiredData;
        expectedResult = service.addInventoryBatchesToCollectionIfMissing([], null, inventoryBatches, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(inventoryBatches);
      });

      it('should return initial array if no InventoryBatches is added', () => {
        const inventoryBatchesCollection: IInventoryBatches[] = [sampleWithRequiredData];
        expectedResult = service.addInventoryBatchesToCollectionIfMissing(inventoryBatchesCollection, undefined, null);
        expect(expectedResult).toEqual(inventoryBatchesCollection);
      });
    });

    describe('compareInventoryBatches', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInventoryBatches(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 11939 };
        const entity2 = null;

        const compareResult1 = service.compareInventoryBatches(entity1, entity2);
        const compareResult2 = service.compareInventoryBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 11939 };
        const entity2 = { id: 12226 };

        const compareResult1 = service.compareInventoryBatches(entity1, entity2);
        const compareResult2 = service.compareInventoryBatches(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 11939 };
        const entity2 = { id: 11939 };

        const compareResult1 = service.compareInventoryBatches(entity1, entity2);
        const compareResult2 = service.compareInventoryBatches(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
