import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main-page/prediction-upcoming-game-list',
    pathMatch: 'full',
  },
  {
    path: 'registration',
    loadChildren: () => import('./modules/user/registration/registration.module').then((m) => m.RegistrationPageModule),
  },
  {
    path: 'leaderboard',
    loadChildren: () => import('./modules/leaderboard/leaderboard.module').then((m) => m.LeaderboardPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'main-page',
    loadChildren: () => import('./modules/main-page/main-page.module').then((m) => m.MainPagePageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'information',
    loadChildren: () => import('./modules/information/information.module').then((m) => m.InformationPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'prediction-upcoming-game-list',
    loadChildren: () =>
      import('./modules/prediction/prediction-upcoming-game-list/prediction-upcoming-game-list.module').then(
        (m) => m.PredictionUpcomingGameListPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
