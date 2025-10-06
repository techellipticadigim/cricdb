export interface User {
  email: string;
  role: 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: 'ADMIN';
  message: string;
}

export interface Player {
  playerId: number;
  playerName: string;
  country: string;
  startYear: number;
  gender: 'MALE' | 'FEMALE';
  role: 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER';
  notes?: string;
}

export interface PlayerRequest {
  playerName: string;
  country: string;
  startYear: number;
  gender: 'MALE' | 'FEMALE';
  role: 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER';
  notes?: string;
}

export interface BattingStats {
  id: number;
  player: Player;
  runs: number;
  ballsPlayed: number;
  sixes: number;
  fours: number;
  against: string;
  matchDate: string;
}

export interface BattingStatsRequest {
  playerId: number;
  runs: number;
  ballsPlayed: number;
  sixes: number;
  fours: number;
  against: string;
  matchDate: string;
}

export interface BowlingStats {
  id: number;
  player: Player;
  overs: number;
  maidens: number;
  runsGiven: number;
  wicketsTaken: number;
  against: string;
  matchDate: string;
}

export interface BowlingStatsRequest {
  playerId: number;
  overs: number;
  maidens: number;
  runsGiven: number;
  wicketsTaken: number;
  against: string;
  matchDate: string;
}

export interface AnalyticsResponse {
  highestRunsPlayer: string;
  highestRuns: number;
  highestWicketsPlayer: string;
  highestWickets: number;
  mostMaidenOversPlayer: string;
  mostMaidenOvers: number;
  bestBattingAveragePlayer: string;
  bestBattingAverage: number;
  bestBowlingEconomyPlayer: string;
  bestBowlingEconomy: number;
  totalCenturiesPlayer: string;
  totalCenturies: number;
  totalFiveWicketHaulsPlayer: string;
  totalFiveWicketHauls: number;
  mostRecentCenturyPlayer: string;
  mostRecentCenturyDate: string;
  mostRecentFiveWicketHaulPlayer: string;
  mostRecentFiveWicketHaulDate: string;
  mostSixesPlayer: string;
  mostSixes: number;
  mostFoursPlayer: string;
  mostFours: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}
