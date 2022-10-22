export interface AuthenticatedUserDto {
  clientUuid: string;
  nickname: string;
  score: number;
  rank: number;
  jwt: string;
}
