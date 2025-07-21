import { TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { ISupplierBankAccounts } from '../supplier-bank-accounts.model';
import { SupplierBankAccountsService } from '../service/supplier-bank-accounts.service';

import supplierBankAccountsResolve from './supplier-bank-accounts-routing-resolve.service';

describe('SupplierBankAccounts routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: SupplierBankAccountsService;
  let resultSupplierBankAccounts: ISupplierBankAccounts | null | undefined;

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
    service = TestBed.inject(SupplierBankAccountsService);
    resultSupplierBankAccounts = undefined;
  });

  describe('resolve', () => {
    it('should return ISupplierBankAccounts returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        supplierBankAccountsResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultSupplierBankAccounts = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultSupplierBankAccounts).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      TestBed.runInInjectionContext(() => {
        supplierBankAccountsResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultSupplierBankAccounts = result;
          },
        });
      });

      // THEN
      expect(service.find).not.toHaveBeenCalled();
      expect(resultSupplierBankAccounts).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ISupplierBankAccounts>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      TestBed.runInInjectionContext(() => {
        supplierBankAccountsResolve(mockActivatedRouteSnapshot).subscribe({
          next(result) {
            resultSupplierBankAccounts = result;
          },
        });
      });

      // THEN
      expect(service.find).toHaveBeenCalledWith(123);
      expect(resultSupplierBankAccounts).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
