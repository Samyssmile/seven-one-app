// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baserUrl: 'http://localhost:8121',
  createUserUrl: '/user/account/create',
  leaderboardUrl: '/ranking/all',
  predictionUrl: '/predictions',
  matchUrl: '/matches',
  loginUrl: '/user/account/login',
  allMatchesUrl: '/matches/all',
  unpredictedMatchesUrl: '/matches/unpredicted',
};

