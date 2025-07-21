import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreEstimatesComponent } from './pre-estimates.component';

describe('PreEstimatesComponent', () => {
  let component: PreEstimatesComponent;
  let fixture: ComponentFixture<PreEstimatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreEstimatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreEstimatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
