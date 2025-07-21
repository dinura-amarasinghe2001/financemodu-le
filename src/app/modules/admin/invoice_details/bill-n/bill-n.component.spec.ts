import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillNComponent } from './bill-n.component';

describe('BillNComponent', () => {
  let component: BillNComponent;
  let fixture: ComponentFixture<BillNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillNComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
