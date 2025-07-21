import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { TheInventoryBatchesDetailComponent } from './the-inventory-batches-detail.component';

describe('TheInventoryBatches Management Detail Component', () => {
  let comp: TheInventoryBatchesDetailComponent;
  let fixture: ComponentFixture<TheInventoryBatchesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheInventoryBatchesDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./the-inventory-batches-detail.component').then(m => m.TheInventoryBatchesDetailComponent),
              resolve: { theInventoryBatches: () => of({ id: 22239 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(TheInventoryBatchesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheInventoryBatchesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load theInventoryBatches on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TheInventoryBatchesDetailComponent);

      // THEN
      expect(instance.theInventoryBatches()).toEqual(expect.objectContaining({ id: 22239 }));
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
