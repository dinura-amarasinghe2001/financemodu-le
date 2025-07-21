import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreEstimatesCreateComponent } from './pre-estimates-create.component';

describe('PreEstimatesCreateComponent', () => {
  let component: PreEstimatesCreateComponent;
  let fixture: ComponentFixture<PreEstimatesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreEstimatesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreEstimatesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
