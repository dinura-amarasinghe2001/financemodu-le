import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { FlagDetailComponent } from './flag-detail.component';

describe('Flag Management Detail Component', () => {
  let comp: FlagDetailComponent;
  let fixture: ComponentFixture<FlagDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlagDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./flag-detail.component').then(m => m.FlagDetailComponent),
              resolve: { flag: () => of({ id: 25480 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(FlagDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load flag on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', FlagDetailComponent);

      // THEN
      expect(instance.flag()).toEqual(expect.objectContaining({ id: 25480 }));
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
