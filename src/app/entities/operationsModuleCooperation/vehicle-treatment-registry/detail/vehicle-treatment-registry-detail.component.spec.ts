import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { VehicleTreatmentRegistryDetailComponent } from './vehicle-treatment-registry-detail.component';

describe('VehicleTreatmentRegistry Management Detail Component', () => {
  let comp: VehicleTreatmentRegistryDetailComponent;
  let fixture: ComponentFixture<VehicleTreatmentRegistryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleTreatmentRegistryDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () =>
                import('./vehicle-treatment-registry-detail.component').then(m => m.VehicleTreatmentRegistryDetailComponent),
              resolve: { vehicleTreatmentRegistry: () => of({ id: 18463 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VehicleTreatmentRegistryDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTreatmentRegistryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load vehicleTreatmentRegistry on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VehicleTreatmentRegistryDetailComponent);

      // THEN
      expect(instance.vehicleTreatmentRegistry()).toEqual(expect.objectContaining({ id: 18463 }));
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
