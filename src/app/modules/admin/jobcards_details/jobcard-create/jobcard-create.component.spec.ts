import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcardCreateComponent } from './jobcard-create.component';

describe('JobcardCreateComponent', () => {
  let component: JobcardCreateComponent;
  let fixture: ComponentFixture<JobcardCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobcardCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobcardCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
