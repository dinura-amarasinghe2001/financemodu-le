import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { BankBranchDetailComponent } from './bank-branch-detail.component';

describe('BankBranch Management Detail Component', () => {
  let comp: BankBranchDetailComponent;
  let fixture: ComponentFixture<BankBranchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankBranchDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./bank-branch-detail.component').then(m => m.BankBranchDetailComponent),
              resolve: { bankBranch: () => of({ id: 5446 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(BankBranchDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankBranchDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load bankBranch on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', BankBranchDetailComponent);

      // THEN
      expect(instance.bankBranch()).toEqual(expect.objectContaining({ id: 5446 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
