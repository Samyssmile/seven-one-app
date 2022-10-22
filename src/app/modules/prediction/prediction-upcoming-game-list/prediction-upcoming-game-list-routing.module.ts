import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PredictionUpcomingGameListPage} from './prediction-upcoming-game-list.page';

const routes: Routes = [
  {
    path: '',
    component: PredictionUpcomingGameListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PredictionUpcomingGameListPageRoutingModule {
}
