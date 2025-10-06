import axios from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  Player, 
  PlayerRequest, 
  BattingStatsRequest, 
  BowlingStatsRequest, 
  BattingStats, 
  BowlingStats, 
  AnalyticsResponse 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6548/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect to login if not on analytics page
      if (!window.location.pathname.includes('/analytics')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    api.post('/auth/login', credentials).then(res => res.data),
  
  register: (credentials: LoginRequest): Promise<LoginResponse> =>
    api.post('/auth/register', credentials).then(res => res.data),
};

// Player API
export const playerAPI = {
  getAllPlayers: (): Promise<Player[]> =>
    api.get('/players').then(res => res.data),
  
  getPlayersByCountry: (country: string): Promise<Player[]> =>
    api.get(`/players/country/${country}`).then(res => res.data),
  
  getDistinctCountries: (): Promise<string[]> =>
    api.get('/players/countries').then(res => res.data),
  
  getPlayerById: (id: number): Promise<Player> =>
    api.get(`/players/${id}`).then(res => res.data),
  
  createPlayer: (player: PlayerRequest): Promise<Player> =>
    api.post('/players', player).then(res => res.data),
  
  updatePlayer: (id: number, player: PlayerRequest): Promise<Player> =>
    api.put(`/players/${id}`, player).then(res => res.data),
  
  deletePlayer: (id: number): Promise<void> =>
    api.delete(`/players/${id}`).then(res => res.data),
};

// Stats API
export const statsAPI = {
  addBattingStats: (stats: BattingStatsRequest): Promise<BattingStats> =>
    api.post('/stats/batting', stats).then(res => res.data),
  
  addBowlingStats: (stats: BowlingStatsRequest): Promise<BowlingStats> =>
    api.post('/stats/bowling', stats).then(res => res.data),
  
  getBattingStatsByPlayer: (playerId: number): Promise<BattingStats[]> =>
    api.get(`/stats/batting/player/${playerId}`).then(res => res.data),
  
  getBowlingStatsByPlayer: (playerId: number): Promise<BowlingStats[]> =>
    api.get(`/stats/bowling/player/${playerId}`).then(res => res.data),
};

// Analytics API
export const analyticsAPI = {
  getAnalyticsSummary: (): Promise<AnalyticsResponse> =>
    api.get('/analytics/summary').then(res => res.data),
};

export default api;
