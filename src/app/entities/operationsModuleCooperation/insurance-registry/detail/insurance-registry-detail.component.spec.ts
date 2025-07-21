import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { InsuranceRegistryDetailComponent } from './insurance-registry-detail.component';

describe('InsuranceRegistry Management Detail Component', () => {
  let comp: InsuranceRegistryDetailComponent;
  let fixture: ComponentFixture<InsuranceRegistryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsuranceRegistryDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./insurance-registry-detail.component').then(m => m.InsuranceRegistryDetailComponent),
              resolve: { insuranceRegistry: () => of({ id: 1027 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InsuranceRegistryDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceRegistryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load insuranceRegistry on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InsuranceRegistryDetailComponent);

      // THEN
      expect(instance.insuranceRegistry()).toEqual(expect.objectContaining({ id: 1027 }));
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
