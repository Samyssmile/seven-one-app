import { Component, isDevMode, OnInit } from '@angular/core';
import { Match } from '../models/game.model';
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
export class PredictionUpcomingGameListPage implements OnInit, Observer<Match[]> {
  matches: Match[] = [];
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
    this.matches = this.predictionUpcomingGameListService.sortGamesByPredictionAndMatchDate(this.matches);
  }

  makePredictionClicked(event: Event, match: Match) {
    // stop propagation to avoid opening the game details
    event.preventDefault();
    event.stopPropagation();
    console.log(match);
    this.modalController
      .create({
        component: MakePredictionComponent,
        componentProps: { match },
        id: 'make-prediction-modal',
      })
      .then((modal) => {
        modal.present();
        modal.onDidDismiss().then((result) => {
          if (isDevMode()) {
            console.log('modal dismissed', result.data.matchUuid + ' - ' + result.data.clientUuid);
          }
          this.predictionUpcomingGameListService.sortGamesByPredictionAndMatchDate(this.matches);
        });
      });
  }

  complete(): void {}

  error(err: any): void {
    console.log('error', err);
  }

  next(value: Match[]): void {
    if (isDevMode()) {
      console.log('next games values', value);
    }
    this.matches.push(...value);
  }

  comvertISO8601ToSimpleDate(match: Match) {
    const isoString = match.matchDate;
    const dateFormat = 'DD/MM/YYY HH:mm:ss';
    return new Date(isoString).toLocaleString('de-DE', { timeZone: 'UTC' });
  }

  removeGameFromListByMatchUuid(matchUuid) {
    this.matches = this.matches.filter((match) => match.uuid !== matchUuid);
  }
}
