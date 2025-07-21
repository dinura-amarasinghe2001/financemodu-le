import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IClientRegistry } from '../client-registry.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../client-registry.test-samples';

import { ClientRegistryService, RestClientRegistry } from './client-registry.service';

const requireRestSample: RestClientRegistry = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('ClientRegistry Service', () => {
  let service: ClientRegistryService;
  let httpMock: HttpTestingController;
  let expectedResult: IClientRegistry | IClientRegistry[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ClientRegistryService);
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

    it('should create a ClientRegistry', () => {
      const clientRegistry = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(clientRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ClientRegistry', () => {
      const clientRegistry = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(clientRegistry).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ClientRegistry', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ClientRegistry', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ClientRegistry', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a ClientRegistry', () => {
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

    describe('addClientRegistryToCollectionIfMissing', () => {
      it('should add a ClientRegistry to an empty array', () => {
        const clientRegistry: IClientRegistry = sampleWithRequiredData;
        expectedResult = service.addClientRegistryToCollectionIfMissing([], clientRegistry);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientRegistry);
      });

      it('should not add a ClientRegistry to an array that contains it', () => {
        const clientRegistry: IClientRegistry = sampleWithRequiredData;
        const clientRegistryCollection: IClientRegistry[] = [
          {
            ...clientRegistry,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClientRegistryToCollectionIfMissing(clientRegistryCollection, clientRegistry);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ClientRegistry to an array that doesn't contain it", () => {
        const clientRegistry: IClientRegistry = sampleWithRequiredData;
        const clientRegistryCollection: IClientRegistry[] = [sampleWithPartialData];
        expectedResult = service.addClientRegistryToCollectionIfMissing(clientRegistryCollection, clientRegistry);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientRegistry);
      });

      it('should add only unique ClientRegistry to an array', () => {
        const clientRegistryArray: IClientRegistry[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clientRegistryCollection: IClientRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addClientRegistryToCollectionIfMissing(clientRegistryCollection, ...clientRegistryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const clientRegistry: IClientRegistry = sampleWithRequiredData;
        const clientRegistry2: IClientRegistry = sampleWithPartialData;
        expectedResult = service.addClientRegistryToCollectionIfMissing([], clientRegistry, clientRegistry2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(clientRegistry);
        expect(expectedResult).toContain(clientRegistry2);
      });

      it('should accept null and undefined values', () => {
        const clientRegistry: IClientRegistry = sampleWithRequiredData;
        expectedResult = service.addClientRegistryToCollectionIfMissing([], null, clientRegistry, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(clientRegistry);
      });

      it('should return initial array if no ClientRegistry is added', () => {
        const clientRegistryCollection: IClientRegistry[] = [sampleWithRequiredData];
        expectedResult = service.addClientRegistryToCollectionIfMissing(clientRegistryCollection, undefined, null);
        expect(expectedResult).toEqual(clientRegistryCollection);
      });
    });

    describe('compareClientRegistry', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareClientRegistry(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 7412 };
        const entity2 = null;

        const compareResult1 = service.compareClientRegistry(entity1, entity2);
        const compareResult2 = service.compareClientRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 7412 };
        const entity2 = { id: 23373 };

        const compareResult1 = service.compareClientRegistry(entity1, entity2);
        const compareResult2 = service.compareClientRegistry(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 7412 };
        const entity2 = { id: 7412 };

        const compareResult1 = service.compareClientRegistry(entity1, entity2);
        const compareResult2 = service.compareClientRegistry(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
