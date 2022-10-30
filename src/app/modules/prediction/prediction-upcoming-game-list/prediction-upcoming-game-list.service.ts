import { Injectable } from '@angular/core';
import { Match } from '../models/game.model';
import { Storage } from '@ionic/storage-angular';
import { AuthenticatedUserDto } from '../../../shared/dtos/AuthenticatedUserDto';
import { HttpClientService } from '../../../shared/http/http-client.service';
import { BehaviorSubject } from 'rxjs';
import { PredictionModel } from '../models/prediction.model';

@Injectable({
  providedIn: 'root',
})
export class PredictionUpcomingGameListService {
  // Real Match data of Fifa World Cup 2022. Group A.
  private games: BehaviorSubject<Match[]> = new BehaviorSubject<Match[]>([]);

  constructor(private storage: Storage, private httpClientService: HttpClientService) {}

  getGames() {
    this.storage.get('profile').then((profile: AuthenticatedUserDto) => {
      this.httpClientService.getAllGames(profile.jwt).subscribe((games: Match[]) => {
        this.getAllPredictionsByClientsUuid(games, profile.clientUuid, profile.jwt);
      });
    });
  }

  getGame(gameUuid: string) {
    return this.games.value.find((game) => game.uuid === gameUuid);
  }

  registerGamesObserver(observer) {
    this.games.subscribe(observer);
  }

  getAllPredictionsByClientsUuid(games: Match[], clientUuid: string, jwt: string) {
    return this.httpClientService.getPredictions(clientUuid, jwt).subscribe((predictions: PredictionModel[]) => {
      this.updateGamesByPrediction(games, predictions);
    });
  }

  updateGamesByPrediction(games: Match[], predictions: PredictionModel[]) {
    games.forEach((game) => {
      const prediction = predictions.find((p) => p.matchUuid === game.uuid);
      if (prediction) {
        const predictionSplit = prediction.prediction.split(':');
        game.preidctionFirstTeamGoals = Number(predictionSplit[0]);
        game.preidctionSecondTeamGoals = Number(predictionSplit[1]);
        game.predicted = true;
        game.allowPredictions = true;
        game.matchStarted = false;
        game.matchStarted = false;
        game.matchFinished = false;
      } else {
        game.allowPredictions = true;
        game.matchStarted = false;
        game.matchStarted = false;
        game.matchFinished = false;
      }
      // if game match date is more than 140 minutes in the past.
      // Game is finished.
      if (new Date(game.matchDate).getTime() < new Date().getTime() - 150 * 60 * 1000) {
        if (new Date(game.matchDate) < new Date()) {
          game.matchFinished = true;
          game.allowPredictions = false;
          game.matchStarted = true;
        }
      }
      // Game running right now.
      if (
        new Date(game.matchDate).getTime() < new Date().getTime() &&
        new Date(game.matchDate).getTime() > new Date().getTime() - 150 * 60 * 1000
      ) {
        game.matchStarted = true;
        game.matchFinished = false;
        game.allowPredictions = false;
      }
    });
    this.games.next(this.sortGamesByPredictionAndStartedStatus(games));
  }

  sortGamesByPredictionAndStartedStatus(gameList: Match[]): Match[] {
    return gameList.sort((a, b) => {
      if (a.predicted && !b.predicted) {
        return 1;
      }
      if (!a.predicted && b.predicted) {
        return -1;
      }
      if (a.matchStarted && !b.matchStarted) {
        return 1;
      }
      if (!a.matchStarted && b.matchStarted) {
        return -1;
      }
      if (a.matchFinished && !b.matchFinished) {
        return 1;
      }
      if (!a.matchFinished && b.matchFinished) {
        return -1;
      }
      return 0;
    });
  }
}
