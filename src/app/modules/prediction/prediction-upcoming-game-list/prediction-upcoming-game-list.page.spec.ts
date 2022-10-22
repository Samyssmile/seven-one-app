import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PredictionUpcomingGameListPage } from './prediction-upcoming-game-list.page';

describe('PredictionUpcomingGameListPage', () => {
  let component: PredictionUpcomingGameListPage;
  let fixture: ComponentFixture<PredictionUpcomingGameListPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PredictionUpcomingGameListPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(PredictionUpcomingGameListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
