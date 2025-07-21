import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleAddWizardComponent } from './vehicle-add-wizard.component';

describe('VehicleAddWizardComponent', () => {
  let component: VehicleAddWizardComponent;
  let fixture: ComponentFixture<VehicleAddWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleAddWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleAddWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
