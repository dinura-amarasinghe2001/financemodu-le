import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerCreateWizardComponent } from './owner-create-wizard.component';

describe('OwnerCreateWizardComponent', () => {
  let component: OwnerCreateWizardComponent;
  let fixture: ComponentFixture<OwnerCreateWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerCreateWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnerCreateWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
