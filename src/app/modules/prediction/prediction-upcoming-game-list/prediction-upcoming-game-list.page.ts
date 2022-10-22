import { Component, isDevMode, OnInit } from '@angular/core';
import { Game } from '../models/game.model';
import { PredictionUpcomingGameListService } from './prediction-upcoming-game-list.service';
import { ModalController } from '@ionic/angular';
import { MakePredictionComponent } from './make-prediction/make-prediction.component';
import { Observer } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { TranslateConfigService } from '../../../shared/translate/translate-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-prediction-upcoming-game-list',
  templateUrl: './prediction-upcoming-game-list.page.html',
  styleUrls: ['./prediction-upcoming-game-list.page.scss'],
})
export class PredictionUpcomingGameListPage implements OnInit, Observer<Game[]> {
  games: Game[] = [];
  language: string;

  constructor(
    private modalController: ModalController,
    private predictionUpcomingGameListService: PredictionUpcomingGameListService,
    private storage: Storage,
    private translateConfigService: TranslateConfigService,
    private translate: TranslateService
  ) {
    predictionUpcomingGameListService.registerGamesObserver(this);
    this.translateConfigService.getDefaultLanguage();
    this.language = this.translateConfigService.getCurrentLang();
  }

  ngOnInit() {
    this.predictionUpcomingGameListService.getGames();
    this.games = this.predictionUpcomingGameListService.sortGamesByPredictionAndStartedStatus(this.games);
  }

  makePredictionClicked(event: Event, game: Game) {
    // stop propagation to avoid opening the game details
    event.preventDefault();
    event.stopPropagation();
    this.modalController
      .create({
        component: MakePredictionComponent,
        componentProps: { game },
        id: 'make-prediction-modal',
      })
      .then((modal) => {
        modal.present();
        modal.onDidDismiss().then((result) => {
          if (isDevMode()) {
            console.log('modal dismissed', result.data.gameUuid + ' - ' + result.data.clientUuid);
            this.predictionUpcomingGameListService.sortGamesByPredictionAndStartedStatus(this.games);
          }
        });
      });
  }

  complete(): void {}

  error(err: any): void {
    console.log('error', err);
  }

  next(value: Game[]): void {
    if (isDevMode()) {
      console.log('next games values', value);
    }
    this.games.push(...value);
  }

  comvertISO8601ToSimpleDate(game: Game) {
    const isoString = game.matchDate;
    const dateFormat = 'DD/MM/YYY HH:mm:ss';
    return new Date(isoString).toLocaleString('de-DE', { timeZone: 'UTC' });
  }

  removeGameFromListByGameUuid(gameUuid) {
    this.games = this.games.filter((game) => game.uuid !== gameUuid);
  }
}
