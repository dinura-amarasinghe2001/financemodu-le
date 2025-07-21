import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IBinCard } from '../bin-card.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../bin-card.test-samples';

import { BinCardService, RestBinCard } from './bin-card.service';

const requireRestSample: RestBinCard = {
  ...sampleWithRequiredData,
  txDate: sampleWithRequiredData.txDate?.toJSON(),
  lmd: sampleWithRequiredData.lmd?.toJSON(),
  recordDate: sampleWithRequiredData.recordDate?.toJSON(),
};

describe('BinCard Service', () => {
  let service: BinCardService;
  let httpMock: HttpTestingController;
  let expectedResult: IBinCard | IBinCard[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(BinCardService);
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

    it('should create a BinCard', () => {
      const binCard = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(binCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BinCard', () => {
      const binCard = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(binCard).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BinCard', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BinCard', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a BinCard', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a BinCard', () => {
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

    describe('addBinCardToCollectionIfMissing', () => {
      it('should add a BinCard to an empty array', () => {
        const binCard: IBinCard = sampleWithRequiredData;
        expectedResult = service.addBinCardToCollectionIfMissing([], binCard);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(binCard);
      });

      it('should not add a BinCard to an array that contains it', () => {
        const binCard: IBinCard = sampleWithRequiredData;
        const binCardCollection: IBinCard[] = [
          {
            ...binCard,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBinCardToCollectionIfMissing(binCardCollection, binCard);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BinCard to an array that doesn't contain it", () => {
        const binCard: IBinCard = sampleWithRequiredData;
        const binCardCollection: IBinCard[] = [sampleWithPartialData];
        expectedResult = service.addBinCardToCollectionIfMissing(binCardCollection, binCard);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(binCard);
      });

      it('should add only unique BinCard to an array', () => {
        const binCardArray: IBinCard[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const binCardCollection: IBinCard[] = [sampleWithRequiredData];
        expectedResult = service.addBinCardToCollectionIfMissing(binCardCollection, ...binCardArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const binCard: IBinCard = sampleWithRequiredData;
        const binCard2: IBinCard = sampleWithPartialData;
        expectedResult = service.addBinCardToCollectionIfMissing([], binCard, binCard2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(binCard);
        expect(expectedResult).toContain(binCard2);
      });

      it('should accept null and undefined values', () => {
        const binCard: IBinCard = sampleWithRequiredData;
        expectedResult = service.addBinCardToCollectionIfMissing([], null, binCard, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(binCard);
      });

      it('should return initial array if no BinCard is added', () => {
        const binCardCollection: IBinCard[] = [sampleWithRequiredData];
        expectedResult = service.addBinCardToCollectionIfMissing(binCardCollection, undefined, null);
        expect(expectedResult).toEqual(binCardCollection);
      });
    });

    describe('compareBinCard', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareBinCard(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 25496 };
        const entity2 = null;

        const compareResult1 = service.compareBinCard(entity1, entity2);
        const compareResult2 = service.compareBinCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 25496 };
        const entity2 = { id: 10495 };

        const compareResult1 = service.compareBinCard(entity1, entity2);
        const compareResult2 = service.compareBinCard(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 25496 };
        const entity2 = { id: 25496 };

        const compareResult1 = service.compareBinCard(entity1, entity2);
        const compareResult2 = service.compareBinCard(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
