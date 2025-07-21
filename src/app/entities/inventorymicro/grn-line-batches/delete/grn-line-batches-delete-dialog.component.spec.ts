jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GRNLineBatchesService } from '../service/grn-line-batches.service';

import { GRNLineBatchesDeleteDialogComponent } from './grn-line-batches-delete-dialog.component';

describe('GRNLineBatches Management Delete Component', () => {
  let comp: GRNLineBatchesDeleteDialogComponent;
  let fixture: ComponentFixture<GRNLineBatchesDeleteDialogComponent>;
  let service: GRNLineBatchesService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GRNLineBatchesDeleteDialogComponent],
      providers: [provideHttpClient(), NgbActiveModal],
    })
      .overrideTemplate(GRNLineBatchesDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GRNLineBatchesDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GRNLineBatchesService);
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
