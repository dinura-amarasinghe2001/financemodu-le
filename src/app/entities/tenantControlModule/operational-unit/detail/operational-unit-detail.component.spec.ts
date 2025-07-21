import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { OperationalUnitDetailComponent } from './operational-unit-detail.component';

describe('OperationalUnit Management Detail Component', () => {
  let comp: OperationalUnitDetailComponent;
  let fixture: ComponentFixture<OperationalUnitDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationalUnitDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./operational-unit-detail.component').then(m => m.OperationalUnitDetailComponent),
              resolve: { operationalUnit: () => of({ id: 13401 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(OperationalUnitDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalUnitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load operationalUnit on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', OperationalUnitDetailComponent);

      // THEN
      expect(instance.operationalUnit()).toEqual(expect.objectContaining({ id: 13401 }));
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
