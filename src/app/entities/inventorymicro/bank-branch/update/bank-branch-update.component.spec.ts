import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { BankBranchService } from '../service/bank-branch.service';
import { IBankBranch } from '../bank-branch.model';
import { BankBranchFormService } from './bank-branch-form.service';

import { BankBranchUpdateComponent } from './bank-branch-update.component';

describe('BankBranch Management Update Component', () => {
  let comp: BankBranchUpdateComponent;
  let fixture: ComponentFixture<BankBranchUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankBranchFormService: BankBranchFormService;
  let bankBranchService: BankBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BankBranchUpdateComponent],
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
      .overrideTemplate(BankBranchUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankBranchUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankBranchFormService = TestBed.inject(BankBranchFormService);
    bankBranchService = TestBed.inject(BankBranchService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const bankBranch: IBankBranch = { id: 31095 };

      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      expect(comp.bankBranch).toEqual(bankBranch);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankBranch>>();
      const bankBranch = { id: 5446 };
      jest.spyOn(bankBranchFormService, 'getBankBranch').mockReturnValue(bankBranch);
      jest.spyOn(bankBranchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankBranch }));
      saveSubject.complete();

      // THEN
      expect(bankBranchFormService.getBankBranch).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankBranchService.update).toHaveBeenCalledWith(expect.objectContaining(bankBranch));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankBranch>>();
      const bankBranch = { id: 5446 };
      jest.spyOn(bankBranchFormService, 'getBankBranch').mockReturnValue({ id: null });
      jest.spyOn(bankBranchService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankBranch: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankBranch }));
      saveSubject.complete();

      // THEN
      expect(bankBranchFormService.getBankBranch).toHaveBeenCalled();
      expect(bankBranchService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IBankBranch>>();
      const bankBranch = { id: 5446 };
      jest.spyOn(bankBranchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankBranchService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
