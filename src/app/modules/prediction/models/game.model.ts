import { Team } from './team.model';

export interface Game {
  uuid: string;
  firstTeam: Team;
  secondTeam: Team;
  matchDate: string;
  groupName: string;
  result: string;
  predicted: boolean;
  matchStarted: boolean;
  matchFinished: boolean;
  allowPredictions: boolean;
  preidctionFirstTeamGoals: number;
  preidctionSecondTeamGoals: number;
}
