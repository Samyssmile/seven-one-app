import { Component, OnInit } from '@angular/core';
import { Rank } from './rank.model';
import { LeaderboardService } from './leaderboard.service';
import { Observer } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit, Observer<Rank[]> {
  ranklist: Rank[] = [];
  partOfRankList: Rank[] = [];
  listSizeLimit = 25;

  constructor(private leaderBoardService: LeaderboardService, private toastController: ToastController) {
    leaderBoardService.registerLeaderboardObserver(this);
    leaderBoardService.getLeaderboard();
  }

  ngOnInit() {}

  complete(): void {}

  error(err: any): void {
    console.error(err);
  }

  next(value: Rank[]): void {
    if (value) {
      value.forEach((rank) => {
        this.ranklist.push(rank);
        if (this.partOfRankList.length < this.listSizeLimit) {
          this.partOfRankList.push(rank);
        }
      });
      this.partOfRankList = this.ranklist.slice(0, this.listSizeLimit);
      this.presentToast('bottom');
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: 'Loadboard refreshed...',
      duration: 1500,
      position,
    });

    await toast.present();
  }

  loadData(event) {
    setTimeout(() => {
      this.listSizeLimit += 5;
      this.partOfRankList = this.ranklist.slice(0, this.listSizeLimit);
      event.target.complete();

      if (this.partOfRankList.length === this.ranklist.length) {
        event.target.disabled = true;
      }
    }, 500);
  }
}
