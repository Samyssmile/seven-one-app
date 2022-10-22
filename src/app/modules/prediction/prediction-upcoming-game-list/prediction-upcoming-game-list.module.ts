import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredictionUpcomingGameListPageRoutingModule } from './prediction-upcoming-game-list-routing.module';

import { PredictionUpcomingGameListPage } from './prediction-upcoming-game-list.page';
import { MakePredictionComponent } from './make-prediction/make-prediction.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, PredictionUpcomingGameListPageRoutingModule, TranslateModule],
  declarations: [PredictionUpcomingGameListPage, MakePredictionComponent],
  entryComponents: [MakePredictionComponent],
})
export class PredictionUpcomingGameListPageModule {}
