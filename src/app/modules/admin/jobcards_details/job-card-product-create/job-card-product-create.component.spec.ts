import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardProductCreateComponent } from './job-card-product-create.component';

describe('JobCardProductCreateComponent', () => {
  let component: JobCardProductCreateComponent;
  let fixture: ComponentFixture<JobCardProductCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCardProductCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardProductCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
