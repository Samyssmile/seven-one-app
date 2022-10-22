import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPagePage } from './main-page.page';

const routes: Routes = [
  {
    path: '',
    component: MainPagePage,
    children: [
      {
        path: 'prediction-upcoming-game-list',
        loadChildren: () =>
          import('../prediction/prediction-upcoming-game-list/prediction-upcoming-game-list.module').then(
            (m) => m.PredictionUpcomingGameListPageModule,
          ),
      },
      {
        path: 'leaderboard',
        loadChildren: () => import('./../leaderboard/leaderboard.module').then((m) => m.LeaderboardPageModule),
      },
      {
        path: 'information',
        loadChildren: () => import('./../information/information.module').then((m) => m.InformationPageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPagePageRoutingModule {}
