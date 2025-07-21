import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEnabledERPModule } from '../enabled-erp-module.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../enabled-erp-module.test-samples';

import { EnabledERPModuleService, RestEnabledERPModule } from './enabled-erp-module.service';

const requireRestSample: RestEnabledERPModule = {
  ...sampleWithRequiredData,
  createdDate: sampleWithRequiredData.createdDate?.toJSON(),
  lastModifiedDate: sampleWithRequiredData.lastModifiedDate?.toJSON(),
};

describe('EnabledERPModule Service', () => {
  let service: EnabledERPModuleService;
  let httpMock: HttpTestingController;
  let expectedResult: IEnabledERPModule | IEnabledERPModule[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EnabledERPModuleService);
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

    it('should create a EnabledERPModule', () => {
      const enabledERPModule = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(enabledERPModule).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EnabledERPModule', () => {
      const enabledERPModule = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(enabledERPModule).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EnabledERPModule', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EnabledERPModule', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a EnabledERPModule', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    it('should handle exceptions for searching a EnabledERPModule', () => {
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

    describe('addEnabledERPModuleToCollectionIfMissing', () => {
      it('should add a EnabledERPModule to an empty array', () => {
        const enabledERPModule: IEnabledERPModule = sampleWithRequiredData;
        expectedResult = service.addEnabledERPModuleToCollectionIfMissing([], enabledERPModule);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enabledERPModule);
      });

      it('should not add a EnabledERPModule to an array that contains it', () => {
        const enabledERPModule: IEnabledERPModule = sampleWithRequiredData;
        const enabledERPModuleCollection: IEnabledERPModule[] = [
          {
            ...enabledERPModule,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEnabledERPModuleToCollectionIfMissing(enabledERPModuleCollection, enabledERPModule);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EnabledERPModule to an array that doesn't contain it", () => {
        const enabledERPModule: IEnabledERPModule = sampleWithRequiredData;
        const enabledERPModuleCollection: IEnabledERPModule[] = [sampleWithPartialData];
        expectedResult = service.addEnabledERPModuleToCollectionIfMissing(enabledERPModuleCollection, enabledERPModule);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enabledERPModule);
      });

      it('should add only unique EnabledERPModule to an array', () => {
        const enabledERPModuleArray: IEnabledERPModule[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const enabledERPModuleCollection: IEnabledERPModule[] = [sampleWithRequiredData];
        expectedResult = service.addEnabledERPModuleToCollectionIfMissing(enabledERPModuleCollection, ...enabledERPModuleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const enabledERPModule: IEnabledERPModule = sampleWithRequiredData;
        const enabledERPModule2: IEnabledERPModule = sampleWithPartialData;
        expectedResult = service.addEnabledERPModuleToCollectionIfMissing([], enabledERPModule, enabledERPModule2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(enabledERPModule);
        expect(expectedResult).toContain(enabledERPModule2);
      });

      it('should accept null and undefined values', () => {
        const enabledERPModule: IEnabledERPModule = sampleWithRequiredData;
        expectedResult = service.addEnabledERPModuleToCollectionIfMissing([], null, enabledERPModule, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(enabledERPModule);
      });

      it('should return initial array if no EnabledERPModule is added', () => {
        const enabledERPModuleCollection: IEnabledERPModule[] = [sampleWithRequiredData];
        expectedResult = service.addEnabledERPModuleToCollectionIfMissing(enabledERPModuleCollection, undefined, null);
        expect(expectedResult).toEqual(enabledERPModuleCollection);
      });
    });

    describe('compareEnabledERPModule', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEnabledERPModule(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 169 };
        const entity2 = null;

        const compareResult1 = service.compareEnabledERPModule(entity1, entity2);
        const compareResult2 = service.compareEnabledERPModule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 169 };
        const entity2 = { id: 2252 };

        const compareResult1 = service.compareEnabledERPModule(entity1, entity2);
        const compareResult2 = service.compareEnabledERPModule(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 169 };
        const entity2 = { id: 169 };

        const compareResult1 = service.compareEnabledERPModule(entity1, entity2);
        const compareResult2 = service.compareEnabledERPModule(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
