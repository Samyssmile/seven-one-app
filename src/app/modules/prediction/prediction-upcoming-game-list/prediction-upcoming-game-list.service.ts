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
      this.httpClientService.getAllGames(profile.jwt).subscribe((matches: Match[]) => {
        this.getAllPredictionsByClientsUuid(matches, profile.clientUuid, profile.jwt);
      });
    });
  }

  getMatch(matchUuid: string) {
    return this.games.value.find((match) => match.uuid === matchUuid);
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
    games.forEach((match) => {
      const prediction = predictions.find((p) => p.matchUuid === match.uuid);
      if (prediction) {
        const predictionSplit = prediction.prediction.split(':');
        match.preidctionFirstTeamGoals = Number(predictionSplit[0]);
        match.preidctionSecondTeamGoals = Number(predictionSplit[1]);
        match.predicted = true;
        match.allowPredictions = true;
        match.matchStarted = false;
        match.matchStarted = false;
        match.matchFinished = false;
      } else {
        match.allowPredictions = true;
        match.matchStarted = false;
        match.matchStarted = false;
        match.matchFinished = false;
      }
      // if game match date is more than 140 minutes in the past.
      // Game is finished.
      if (new Date(match.matchDate).getTime() < new Date().getTime() - 150 * 60 * 1000) {
        if (new Date(match.matchDate) < new Date()) {
          match.matchFinished = true;
          match.allowPredictions = false;
          match.matchStarted = true;
        }
      }
      // Game running right now.
      if (
        new Date(match.matchDate).getTime() < new Date().getTime() &&
        new Date(match.matchDate).getTime() > new Date().getTime() - 150 * 60 * 1000
      ) {
        match.matchStarted = true;
        match.matchFinished = false;
        match.allowPredictions = false;
      }
    });
    this.games.next(this.sortGamesByPredictionAndStartedStatus(games));
  }

  sortGamesByPredictionAndStartedStatus(matchList: Match[]): Match[] {
    return matchList.sort((a, b) => {
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
