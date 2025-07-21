jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { TheGRNLineBatchesService } from '../service/the-grn-line-batches.service';

import { TheGRNLineBatchesDeleteDialogComponent } from './the-grn-line-batches-delete-dialog.component';

describe('TheGRNLineBatches Management Delete Component', () => {
  let comp: TheGRNLineBatchesDeleteDialogComponent;
  let fixture: ComponentFixture<TheGRNLineBatchesDeleteDialogComponent>;
  let service: TheGRNLineBatchesService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TheGRNLineBatchesDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(TheGRNLineBatchesDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TheGRNLineBatchesDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TheGRNLineBatchesService);
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
