import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassAddWizardComponent } from './gatepass-add-wizard.component';

describe('GatepassAddWizardComponent', () => {
  let component: GatepassAddWizardComponent;
  let fixture: ComponentFixture<GatepassAddWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatepassAddWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatepassAddWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
