import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TheGRNLineBatchesDetailComponent } from './the-grn-line-batches-detail.component';

describe('TheGRNLineBatches Management Detail Component', () => {
  let comp: TheGRNLineBatchesDetailComponent;
  let fixture: ComponentFixture<TheGRNLineBatchesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheGRNLineBatchesDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./the-grn-line-batches-detail.component').then(m => m.TheGRNLineBatchesDetailComponent),
              resolve: { theGRNLineBatches: () => of({ id: 16379 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TheGRNLineBatchesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheGRNLineBatchesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load theGRNLineBatches on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TheGRNLineBatchesDetailComponent);

      // THEN
      expect(instance.theGRNLineBatches()).toEqual(expect.objectContaining({ id: 16379 }));
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
