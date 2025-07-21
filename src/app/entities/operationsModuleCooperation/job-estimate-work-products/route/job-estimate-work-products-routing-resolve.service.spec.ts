import { TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { IJobEstimateWorkProducts } from '../job-estimate-work-products.model';
import { JobEstimateWorkProductsService } from '../service/job-estimate-work-products.service';

import jobEstimateWorkProductsResolve from './job-estimate-work-products-routing-resolve.service';

describe('JobEstimateWorkProducts routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: JobEstimateWorkProductsService;
  let resultJobEstimateWorkProducts: IJobEstimateWorkProducts | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(JobEstimateWorkProductsService);
    resultJobEstimateWorkProducts = undefined;
  });

  describe('resolve', () => {
    it('should return IJobEstimateWorkProducts returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        jobEstimateWorkProductsResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultJobEstimateWorkProducts = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultJobEstimateWorkProducts).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        jobEstimateWorkProductsResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultJobEstimateWorkProducts = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultJobEstimateWorkProducts).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IJobEstimateWorkProducts>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        jobEstimateWorkProductsResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultJobEstimateWorkProducts = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultJobEstimateWorkProducts).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
