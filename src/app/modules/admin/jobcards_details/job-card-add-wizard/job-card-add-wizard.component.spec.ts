import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCardAddWizardComponent } from './job-card-add-wizard.component';

describe('JobCardAddWizardComponent', () => {
  let component: JobCardAddWizardComponent;
  let fixture: ComponentFixture<JobCardAddWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobCardAddWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobCardAddWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
