import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { InventoryBatchesDetailComponent } from './inventory-batches-detail.component';

describe('InventoryBatches Management Detail Component', () => {
  let comp: InventoryBatchesDetailComponent;
  let fixture: ComponentFixture<InventoryBatchesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryBatchesDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./inventory-batches-detail.component').then(m => m.InventoryBatchesDetailComponent),
              resolve: { inventoryBatches: () => of({ id: 11939 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InventoryBatchesDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryBatchesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load inventoryBatches on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InventoryBatchesDetailComponent);

      // THEN
      expect(instance.inventoryBatches()).toEqual(expect.objectContaining({ id: 11939 }));
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
