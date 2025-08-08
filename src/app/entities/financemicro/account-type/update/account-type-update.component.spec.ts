import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { AccountTypeService } from '../service/account-type.service';
import { IAccountType } from '../account-type.model';
import { AccountTypeFormService } from './account-type-form.service';

import { AccountTypeUpdateComponent } from './account-type-update.component';

describe('AccountType Management Update Component', () => {
  let comp: AccountTypeUpdateComponent;
  let fixture: ComponentFixture<AccountTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let accountTypeFormService: AccountTypeFormService;
  let accountTypeService: AccountTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AccountTypeUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AccountTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    accountTypeFormService = TestBed.inject(AccountTypeFormService);
    accountTypeService = TestBed.inject(AccountTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const accountType: IAccountType = { id: 13776 };

      activatedRoute.data = of({ accountType });
      comp.ngOnInit();

      expect(comp.accountType).toEqual(accountType);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccountType>>();
      const accountType = { id: 7043 };
      jest.spyOn(accountTypeFormService, 'getAccountType').mockReturnValue(accountType);
      jest.spyOn(accountTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountType }));
      saveSubject.complete();

      // THEN
      expect(accountTypeFormService.getAccountType).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(accountTypeService.update).toHaveBeenCalledWith(expect.objectContaining(accountType));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccountType>>();
      const accountType = { id: 7043 };
      jest.spyOn(accountTypeFormService, 'getAccountType').mockReturnValue({ id: null });
      jest.spyOn(accountTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountType: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: accountType }));
      saveSubject.complete();

      // THEN
      expect(accountTypeFormService.getAccountType).toHaveBeenCalled();
      expect(accountTypeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAccountType>>();
      const accountType = { id: 7043 };
      jest.spyOn(accountTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ accountType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(accountTypeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
