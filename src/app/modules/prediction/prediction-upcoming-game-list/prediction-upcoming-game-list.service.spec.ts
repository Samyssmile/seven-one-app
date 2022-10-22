import { TestBed } from '@angular/core/testing';

import { PredictionUpcomingGameListService } from './prediction-upcoming-game-list.service';

describe('PredictionUpcomingGameListService', () => {
  let service: PredictionUpcomingGameListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictionUpcomingGameListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
