import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandAddWizardComponent } from './brand-add-wizard.component';

describe('BrandAddWizardComponent', () => {
  let component: BrandAddWizardComponent;
  let fixture: ComponentFixture<BrandAddWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandAddWizardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BrandAddWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
