jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PreEstimateTreatmentService } from '../service/pre-estimate-treatment.service';

import { PreEstimateTreatmentDeleteDialogComponent } from './pre-estimate-treatment-delete-dialog.component';

describe('PreEstimateTreatment Management Delete Component', () => {
  let comp: PreEstimateTreatmentDeleteDialogComponent;
  let fixture: ComponentFixture<PreEstimateTreatmentDeleteDialogComponent>;
  let service: PreEstimateTreatmentService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PreEstimateTreatmentDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(PreEstimateTreatmentDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PreEstimateTreatmentDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PreEstimateTreatmentService);
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
