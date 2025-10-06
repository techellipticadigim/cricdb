import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Player, BattingStatsRequest, BowlingStatsRequest } from '../types';
import { playerAPI, statsAPI } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stats-tabpanel-${index}`}
      aria-labelledby={`stats-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PlayerStatsForm: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Batting stats form
  const [battingStats, setBattingStats] = useState<BattingStatsRequest>({
    playerId: 0,
    runs: 0,
    ballsPlayed: 1,
    sixes: 0,
    fours: 0,
    against: '',
    matchDate: dayjs().format('YYYY-MM-DD'),
  });

  // Bowling stats form
  const [bowlingStats, setBowlingStats] = useState<BowlingStatsRequest>({
    playerId: 0,
    overs: 0,
    maidens: 0,
    runsGiven: 0,
    wicketsTaken: 0,
    against: '',
    matchDate: dayjs().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const data = await playerAPI.getAllPlayers();
      setPlayers(data);
      // Extract unique countries for the dropdown
      const countrySet = new Set(data.map(player => player.country));
      const uniqueCountries = Array.from(countrySet).sort();
      setCountries(uniqueCountries);
    } catch (err) {
      console.error('Failed to load players:', err);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleBattingChange = (field: keyof BattingStatsRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBattingStats(prev => ({
      ...prev,
      [field]: field === 'playerId' ? parseInt(event.target.value) : event.target.value,
    }));
  };

  const handleBowlingChange = (field: keyof BowlingStatsRequest) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBowlingStats(prev => ({
      ...prev,
      [field]: field === 'playerId' 
        ? parseInt(event.target.value)
        : field === 'overs'
        ? parseFloat(event.target.value)
        : field === 'against'
        ? event.target.value
        : parseInt(event.target.value),
    }));
  };

  const handleBattingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await statsAPI.addBattingStats(battingStats);
      setSuccess('Batting statistics added successfully!');
      setBattingStats({
        playerId: 0,
        runs: 0,
        ballsPlayed: 1,
        sixes: 0,
        fours: 0,
        against: '',
        matchDate: dayjs().format('YYYY-MM-DD'),
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add batting statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleBowlingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await statsAPI.addBowlingStats(bowlingStats);
      setSuccess('Bowling statistics added successfully!');
      setBowlingStats({
        playerId: 0,
        overs: 0,
        maidens: 0,
        runsGiven: 0,
        wicketsTaken: 0,
        against: '',
        matchDate: dayjs().format('YYYY-MM-DD'),
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add bowling statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add Player Statistics
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="statistics tabs">
            <Tab 
              label="Batting Statistics" 
              id="stats-tab-0"
              aria-controls="stats-tabpanel-0"
              data-testid="batting-stats-tab"
            />
            <Tab 
              label="Bowling Statistics" 
              id="stats-tab-1"
              aria-controls="stats-tabpanel-1"
              data-testid="bowling-stats-tab"
            />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ m: 2 }}>
            {success}
          </Alert>
        )}

        <TabPanel value={tabValue} index={0}>
          <form onSubmit={handleBattingSubmit} data-testid="batting-stats-form">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <select
                  value={battingStats.playerId}
                  onChange={(e) => setBattingStats(prev => ({
                    ...prev,
                    playerId: parseInt(e.target.value)
                  }))}
                  required
                  data-testid="batting-player-select"
                  aria-label="Select player for batting stats"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    minHeight: '56px'
                  }}
                >
                  <option value={0}>Select Player</option>
                  {players.map((player) => (
                    <option key={player.playerId} value={player.playerId}>
                      {player.playerName} ({player.country})
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Runs"
                  type="number"
                  value={battingStats.runs}
                  onChange={handleBattingChange('runs')}
                  required
                  inputProps={{ min: 0 }}
                  data-testid="runs-input"
                  aria-label="Runs scored"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Balls Played"
                  type="number"
                  value={battingStats.ballsPlayed}
                  onChange={handleBattingChange('ballsPlayed')}
                  required
                  inputProps={{ min: 1 }}
                  data-testid="balls-played-input"
                  aria-label="Balls played"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sixes"
                  type="number"
                  value={battingStats.sixes}
                  onChange={handleBattingChange('sixes')}
                  required
                  inputProps={{ min: 0 }}
                  data-testid="sixes-input"
                  aria-label="Number of sixes"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fours"
                  type="number"
                  value={battingStats.fours}
                  onChange={handleBattingChange('fours')}
                  required
                  inputProps={{ min: 0 }}
                  data-testid="fours-input"
                  aria-label="Number of fours"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <select
                  value={battingStats.against}
                  onChange={(e) => setBattingStats(prev => ({
                    ...prev,
                    against: e.target.value
                  }))}
                  required
                  data-testid="against-team-input"
                  aria-label="Opponent country"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    minHeight: '56px'
                  }}
                >
                  <option value="">Select Against Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Match Date"
                  value={dayjs(battingStats.matchDate)}
                  onChange={(date) => setBattingStats(prev => ({
                    ...prev,
                    matchDate: date ? date.format('YYYY-MM-DD') : ''
                  }))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      inputProps: {
                        'data-testid': 'match-date-input',
                        'aria-label': 'Match date'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  data-testid="submit-batting-stats"
                  aria-label="Submit batting statistics"
                >
                  {loading ? <CircularProgress size={24} /> : 'Add Batting Statistics'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <form onSubmit={handleBowlingSubmit} data-testid="bowling-stats-form">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <select
                  value={bowlingStats.playerId}
                  onChange={(e) => setBowlingStats(prev => ({
                    ...prev,
                    playerId: parseInt(e.target.value)
                  }))}
                  required
                  data-testid="bowling-player-select"
                  aria-label="Select player for bowling stats"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    minHeight: '56px'
                  }}
                >
                  <option value={0}>Select Player</option>
                  {players.map((player) => (
                    <option key={player.playerId} value={player.playerId}>
                      {player.playerName} ({player.country})
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Overs"
                  type="number"
                  value={bowlingStats.overs}
                  onChange={handleBowlingChange('overs')}
                  required
                  inputProps={{ min: 0, step: 0.1 }}
                  data-testid="overs-input"
                  aria-label="Overs bowled"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maidens"
                  type="number"
                  value={bowlingStats.maidens}
                  onChange={handleBowlingChange('maidens')}
                  required
                  inputProps={{ min: 0 }}
                  data-testid="maidens-input"
                  aria-label="Maiden overs"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Runs Given"
                  type="number"
                  value={bowlingStats.runsGiven}
                  onChange={handleBowlingChange('runsGiven')}
                  required
                  inputProps={{ min: 0 }}
                  data-testid="runs-given-input"
                  aria-label="Runs given"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Wickets Taken"
                  type="number"
                  value={bowlingStats.wicketsTaken}
                  onChange={handleBowlingChange('wicketsTaken')}
                  required
                  inputProps={{ min: 0, max: 10 }}
                  data-testid="wickets-input"
                  aria-label="Wickets taken"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <select
                  value={bowlingStats.against}
                  onChange={(e) => setBowlingStats(prev => ({
                    ...prev,
                    against: e.target.value
                  }))}
                  required
                  data-testid="bowling-against-input"
                  aria-label="Opponent country"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    minHeight: '56px'
                  }}
                >
                  <option value="">Select Against Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Match Date"
                  value={dayjs(bowlingStats.matchDate)}
                  onChange={(date) => setBowlingStats(prev => ({
                    ...prev,
                    matchDate: date ? date.format('YYYY-MM-DD') : ''
                  }))}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      inputProps: {
                        'data-testid': 'bowling-match-date-input',
                        'aria-label': 'Match date'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  data-testid="submit-bowling-stats"
                  aria-label="Submit bowling statistics"
                >
                  {loading ? <CircularProgress size={24} /> : 'Add Bowling Statistics'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default PlayerStatsForm;
