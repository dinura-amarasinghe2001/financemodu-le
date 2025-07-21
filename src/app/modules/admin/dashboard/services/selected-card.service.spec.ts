import { TestBed } from '@angular/core/testing';

import { SelectedCardService } from './selected-card.service';

describe('SelectedCardService', () => {
  let service: SelectedCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
