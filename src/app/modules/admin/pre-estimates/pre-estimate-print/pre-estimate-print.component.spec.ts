import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreEstimatePrintComponent } from './pre-estimate-print.component';

describe('PreEstimatePrintComponent', () => {
  let component: PreEstimatePrintComponent;
  let fixture: ComponentFixture<PreEstimatePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreEstimatePrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreEstimatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
