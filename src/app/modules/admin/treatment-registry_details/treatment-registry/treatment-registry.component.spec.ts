import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreatmentRegistryComponent } from './treatment-registry.component';

describe('TreatmentRegistryComponent', () => {
  let component: TreatmentRegistryComponent;
  let fixture: ComponentFixture<TreatmentRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreatmentRegistryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreatmentRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
