import { Injectable, isDevMode } from '@angular/core';
import * as uuid from 'uuid';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenticatedUserDto } from '../dtos/AuthenticatedUserDto';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { PredictionModel } from '../../modules/prediction/models/prediction.model';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private jwt: BehaviorSubject<string>;
  private profile: AuthenticatedUserDto;

  constructor(private httpClient: HttpClient, private storage: Storage) {
    this.jwt = new BehaviorSubject<string>(null);
    this.storage.get('profile').then((value: AuthenticatedUserDto) => {
      if (value) {
        this.profile = value;
      }
    });
  }

  createNewUserAccount(clientUuid: uuid, nickname: string) {
    const requestUrl = environment.baserUrl + environment.createUserUrl;
    if (isDevMode()) {
      console.log(
        'Request Create User URL: ' + requestUrl + ' with UUID: ' + clientUuid + ' and nickname: ' + nickname
      );
    }
    this.httpClient
      .post(requestUrl, {
        clientUuid,
        nickname,
      })
      .subscribe((resonsedata: AuthenticatedUserDto) => {
        this.storage.set('profile', resonsedata).then(
          (value) => {
            if (isDevMode()) {
              console.log('Profile saved to storage - ' + value.nickname);
            }
          },
          (error) => {
            if (isDevMode()) {
              console.log('Error while saving profile to storage: ' + error);
            }
          }
        );
        this.jwt.next(resonsedata.jwt);
      });
  }

  registerJwtObserver(observer) {
    if (isDevMode()) {
      console.log('Registering JWT Observer');
    }
    this.jwt.subscribe(observer);
  }

  getLeaderboard() {
    if (isDevMode()) {
      console.log('Requesting Leaderboard');
    }

    // Make Request with Authorization Header
    const requestUrl = environment.baserUrl + environment.leaderboardUrl;
    if (isDevMode()) {
      console.log('Request Leaderboard URL: ' + requestUrl);
    }

    if (this.profile) {
      return this.httpClient.get(requestUrl, {
        headers: {
          authorization: 'Bearer ' + this.profile.jwt,
        },
      });
    }
  }

  postPrediction(predictionModel: PredictionModel) {
    this.storage.get('profile').then((value) => {
      if (isDevMode()) {
        // Make Request with Authorization Header
        const requestUrl = environment.baserUrl + environment.predictionUrl;
        if (isDevMode()) {
          console.log('Request Prediction URL: ' + requestUrl);
        }
        this.httpClient
          .post(requestUrl, predictionModel, {
            headers: {
              authorization: 'Bearer ' + value.jwt,
            },
          })
          .subscribe(
            (resonsedata) => {
              if (isDevMode()) {
                console.log('Prediction posted: ' + resonsedata);
              }
            },
            (error) => {
              if (isDevMode()) {
                console.log('Error while posting prediction: ' + error);
              }
            }
          );
      }
    });
  }

  getPredictions(clientUuid: string, jwt: string) {
    if (isDevMode()) {
      console.log('Requesting Predictions');
    }
    const requestUrl = environment.baserUrl + environment.predictionUrl + '?clientUuid=' + clientUuid;
    return this.httpClient.get(requestUrl, {
      headers: {
        authorization: 'Bearer ' + jwt,
      },
    });
  }

  getUnpredictedGames(clientUuid: string) {
    console.log('Requesting Games');
    const requestUrl = environment.baserUrl + environment.unpredictedGamesUrl + '?clientUuid=' + clientUuid;

    return this.httpClient.get(requestUrl, {
      headers: {
        authorization: 'Bearer ' + this.jwt.value,
      },
    });
  }

  getAllGames(jwt: string) {
    console.log('Requesting Games');
    const requestUrl = environment.baserUrl + environment.gamesAllUrl;

    return this.httpClient.get(requestUrl, {
      headers: {
        authorization: 'Bearer ' + jwt,
      },
    });
  }

  login(clientUuid: string) {
    if (isDevMode()) {
      console.log('Requesting Login');
    }
    const requestUrl = environment.baserUrl + environment.loginUrl + '?clientUuid=' + clientUuid;
    return this.httpClient.get(requestUrl).subscribe((resonsedata: AuthenticatedUserDto) => {
      this.storage.set('profile', resonsedata).then(
        (value) => {
          if (isDevMode()) {
            console.log('Profile saved to storage - ' + value.nickname);
          }
        },
        (error) => {
          if (isDevMode()) {
            console.log('Error while saving profile to storage: ' + error);
          }
        }
      );
      this.jwt.next(resonsedata.jwt);
    });
  }
}
