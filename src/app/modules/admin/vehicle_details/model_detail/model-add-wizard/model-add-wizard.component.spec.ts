import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelAddWizardComponent } from './model-add-wizard.component';

describe('ModelAddWizardComponent', () => {
  let component: ModelAddWizardComponent;
  let fixture: ComponentFixture<ModelAddWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelAddWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelAddWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
