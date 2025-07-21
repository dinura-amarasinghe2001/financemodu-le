import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentRegistryAddWizardComponent } from './treatment-registry-add-wizard.component';

describe('TreatmentRegistryAddWizardComponent', () => {
  let component: TreatmentRegistryAddWizardComponent;
  let fixture: ComponentFixture<TreatmentRegistryAddWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentRegistryAddWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentRegistryAddWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
