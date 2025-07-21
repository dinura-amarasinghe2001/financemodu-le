jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { VehicleTreatmentRegistryService } from '../service/vehicle-treatment-registry.service';

import { VehicleTreatmentRegistryDeleteDialogComponent } from './vehicle-treatment-registry-delete-dialog.component';

describe('VehicleTreatmentRegistry Management Delete Component', () => {
  let comp: VehicleTreatmentRegistryDeleteDialogComponent;
  let fixture: ComponentFixture<VehicleTreatmentRegistryDeleteDialogComponent>;
  let service: VehicleTreatmentRegistryService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VehicleTreatmentRegistryDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(VehicleTreatmentRegistryDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VehicleTreatmentRegistryDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(VehicleTreatmentRegistryService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      }),
    ));

    it('should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
