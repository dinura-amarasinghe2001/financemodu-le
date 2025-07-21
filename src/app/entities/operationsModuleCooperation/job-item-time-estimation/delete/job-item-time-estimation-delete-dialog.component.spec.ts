jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { JobItemTimeEstimationService } from '../service/job-item-time-estimation.service';

import { JobItemTimeEstimationDeleteDialogComponent } from './job-item-time-estimation-delete-dialog.component';

describe('JobItemTimeEstimation Management Delete Component', () => {
  let comp: JobItemTimeEstimationDeleteDialogComponent;
  let fixture: ComponentFixture<JobItemTimeEstimationDeleteDialogComponent>;
  let service: JobItemTimeEstimationService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobItemTimeEstimationDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(JobItemTimeEstimationDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JobItemTimeEstimationDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JobItemTimeEstimationService);
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
