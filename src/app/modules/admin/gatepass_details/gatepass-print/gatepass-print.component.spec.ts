import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatepassPrintComponent } from './gatepass-print.component';

describe('GatepassPrintComponent', () => {
  let component: GatepassPrintComponent;
  let fixture: ComponentFixture<GatepassPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatepassPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatepassPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
