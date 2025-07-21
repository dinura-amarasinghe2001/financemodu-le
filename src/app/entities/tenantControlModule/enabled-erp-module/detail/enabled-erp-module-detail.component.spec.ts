import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EnabledERPModuleDetailComponent } from './enabled-erp-module-detail.component';

describe('EnabledERPModule Management Detail Component', () => {
  let comp: EnabledERPModuleDetailComponent;
  let fixture: ComponentFixture<EnabledERPModuleDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnabledERPModuleDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./enabled-erp-module-detail.component').then(m => m.EnabledERPModuleDetailComponent),
              resolve: { enabledERPModule: () => of({ id: 169 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EnabledERPModuleDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnabledERPModuleDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load enabledERPModule on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EnabledERPModuleDetailComponent);

      // THEN
      expect(instance.enabledERPModule()).toEqual(expect.objectContaining({ id: 169 }));
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
