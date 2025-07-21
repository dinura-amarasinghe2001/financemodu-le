import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { GRNLineBatchesDetailComponent } from './grn-line-batches-detail.component';

describe('GRNLineBatches Management Detail Component', () => {
  let comp: GRNLineBatchesDetailComponent;
  let fixture: ComponentFixture<GRNLineBatchesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GRNLineBatchesDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./grn-line-batches-detail.component').then(m => m.GRNLineBatchesDetailComponent),
              resolve: { gRNLineBatches: () => of({ id: 25524 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(GRNLineBatchesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GRNLineBatchesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load gRNLineBatches on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', GRNLineBatchesDetailComponent);

      // THEN
      expect(instance.gRNLineBatches()).toEqual(expect.objectContaining({ id: 25524 }));
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
