import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { VehicleRegistryDetailComponent } from './vehicle-registry-detail.component';

describe('VehicleRegistry Management Detail Component', () => {
  let comp: VehicleRegistryDetailComponent;
  let fixture: ComponentFixture<VehicleRegistryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleRegistryDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./vehicle-registry-detail.component').then(m => m.VehicleRegistryDetailComponent),
              resolve: { vehicleRegistry: () => of({ id: 17213 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(VehicleRegistryDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleRegistryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load vehicleRegistry on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', VehicleRegistryDetailComponent);

      // THEN
      expect(instance.vehicleRegistry()).toEqual(expect.objectContaining({ id: 17213 }));
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
