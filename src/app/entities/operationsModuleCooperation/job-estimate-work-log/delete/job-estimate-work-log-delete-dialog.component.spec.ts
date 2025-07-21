jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { JobEstimateWorkLogService } from '../service/job-estimate-work-log.service';

import { JobEstimateWorkLogDeleteDialogComponent } from './job-estimate-work-log-delete-dialog.component';

describe('JobEstimateWorkLog Management Delete Component', () => {
  let comp: JobEstimateWorkLogDeleteDialogComponent;
  let fixture: ComponentFixture<JobEstimateWorkLogDeleteDialogComponent>;
  let service: JobEstimateWorkLogService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JobEstimateWorkLogDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(JobEstimateWorkLogDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(JobEstimateWorkLogDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(JobEstimateWorkLogService);
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
