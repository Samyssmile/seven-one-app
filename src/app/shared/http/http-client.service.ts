import { Injectable, isDevMode } from '@angular/core';
import * as uuid from 'uuid';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthenticatedUserDto } from '../dtos/AuthenticatedUserDto';
import {BehaviorSubject, Observer} from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { PredictionModel } from '../../modules/prediction/models/prediction.model';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  private profile: BehaviorSubject<AuthenticatedUserDto> = new BehaviorSubject<AuthenticatedUserDto>(null);

  constructor(private httpClient: HttpClient, private storage: Storage) {
    this.createStorage();
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
        this.profile.next(resonsedata);
      });
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
    return this.httpClient.get(requestUrl, {
      headers: {
        authorization: 'Bearer ' + this.profile.value.jwt,
      },
    });
  }

  postPrediction(predictionModel: PredictionModel) {
    this.storage.get('profile').then((value) => {
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
    });
  }

  deleteUserAccount(){
    const requestUrl = environment.baserUrl + environment.deleteAccountUrl + '?clientUuid=' + this.profile.value.clientUuid;
    return this.httpClient.delete(requestUrl, {
      headers: {
        authorization: 'Bearer ' + this.profile.value.jwt,
      },
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
    const requestUrl = environment.baserUrl + environment.unpredictedMatchesUrl + '?clientUuid=' + clientUuid;

    return this.httpClient.get(requestUrl, {
      headers: {
        authorization: 'Bearer ' + this.profile.value.jwt,
      },
    });
  }

  getAllGames(jwt: string) {
    const requestUrl = environment.baserUrl + environment.allMatchesUrl;

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
      this.profile.next(resonsedata);
    });
  }

  registerOnProfile(observer: Observer<any>) {
    this.profile.subscribe(observer);
  }

  clear(): void {
    this.profile.next(null);
  }

  private createStorage() {
    this.storage.create().then(
      (value) => {
        console.log('Storage created');
      },
      (error) => {
        console.log('Error while creating storage: ' + error);
      },
    );
  }


}
