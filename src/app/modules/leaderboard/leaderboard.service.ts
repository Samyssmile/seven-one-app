import { Injectable, isDevMode } from '@angular/core';
import { HttpClientService } from '../../shared/http/http-client.service';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Rank } from './rank.model';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private leaderboardSubject = new BehaviorSubject<Rank[]>(null);

  constructor(private httpClientService: HttpClientService, private storage: Storage) {}

  getLeaderboard() {
    return this.httpClientService.getLeaderboard().subscribe(
      (resonsedata: Rank[]) => {
        if (isDevMode()) {
          console.log('Leaderboard retrieved: ');
          console.log(resonsedata);
        }
        this.leaderboardSubject.next(resonsedata);
        this.storage.set('leaderboard', resonsedata).then(
          (leaderboardEntry) => {
            if (isDevMode()) {
              console.log('Leaderboard saved to storage');
            }
          },
          (error) => {
            if (isDevMode()) {
              console.log('Error while saving leaderboard to storage: ' + error);
            }
          }
        );
      },
      (error) => {
        if (isDevMode()) {
          console.log('Error while retrieving leaderboard: ' + error);
        }
      }
    );
  }

  registerLeaderboardObserver(observer) {
    this.leaderboardSubject.subscribe(observer);
  }
}
