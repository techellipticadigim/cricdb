import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { BattingStats, BowlingStats, Player, BattingStatsRequest, BowlingStatsRequest } from '../types';
import { statsAPI, playerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import ShadowDOMFooter from '../components/ShadowDOMFooter';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const EditInningsPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const canEdit = hasRole('ADMIN') || hasRole('DATA_ENTRY');
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);
  const [battingStats, setBattingStats] = useState<BattingStats[]>([]);
  const [bowlingStats, setBowlingStats] = useState<BowlingStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<{ type: 'batting' | 'bowling'; id: number } | null>(null);
  const [deletingStat, setDeletingStat] = useState<{ type: 'batting' | 'bowling'; id: number } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [battingForm, setBattingForm] = useState<BattingStatsRequest>({
    playerId: 0,
    runs: 0,
    ballsPlayed: 1,
    sixes: 0,
    fours: 0,
    against: '',
    matchDate: dayjs().format('YYYY-MM-DD'),
  });

  const [bowlingForm, setBowlingForm] = useState<BowlingStatsRequest>({
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

  // Check for playerId in URL query params
  useEffect(() => {
    const playerIdParam = searchParams.get('playerId');
    if (playerIdParam) {
      const playerId = parseInt(playerIdParam);
      if (!isNaN(playerId)) {
        setSelectedPlayerId(playerId);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedPlayerId > 0) {
      loadPlayerStats();
    }
  }, [selectedPlayerId]);

  const loadPlayers = async () => {
    try {
      const data = await playerAPI.getAllPlayers();
      setPlayers(data);
    } catch (err: any) {
      setError('Failed to load players');
    }
  };

  const loadPlayerStats = async () => {
    if (!selectedPlayerId) return;
    setLoading(true);
    setError('');
    try {
      const [battingData, bowlingData] = await Promise.all([
        statsAPI.getBattingStatsByPlayer(selectedPlayerId),
        statsAPI.getBowlingStatsByPlayer(selectedPlayerId),
      ]);
      setBattingStats(Array.isArray(battingData) ? battingData : []);
      setBowlingStats(Array.isArray(bowlingData) ? bowlingData : []);
    } catch (err: any) {
      setError('Failed to load player statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (type: 'batting' | 'bowling', id: number) => {
    try {
      if (type === 'batting') {
        const stat = await statsAPI.getBattingStatById(id);
        setBattingForm({
          playerId: stat.player.playerId,
          runs: stat.runs,
          ballsPlayed: stat.ballsPlayed,
          sixes: stat.sixes,
          fours: stat.fours,
          against: stat.against,
          matchDate: stat.matchDate,
        });
      } else {
        const stat = await statsAPI.getBowlingStatById(id);
        setBowlingForm({
          playerId: stat.player.playerId,
          overs: stat.overs,
          maidens: stat.maidens,
          runsGiven: stat.runsGiven,
          wicketsTaken: stat.wicketsTaken,
          against: stat.against,
          matchDate: stat.matchDate,
        });
      }
      setEditingStat({ type, id });
      setEditDialogOpen(true);
    } catch (err: any) {
      setError('Failed to load statistics for editing');
    }
  };

  const handleDelete = (type: 'batting' | 'bowling', id: number) => {
    setDeletingStat({ type, id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingStat) return;
    setLoading(true);
    setError('');
    try {
      if (deletingStat.type === 'batting') {
        await statsAPI.deleteBattingStats(deletingStat.id);
      } else {
        await statsAPI.deleteBowlingStats(deletingStat.id);
      }
      setSuccess('Statistics deleted successfully!');
      await loadPlayerStats();
      setDeleteDialogOpen(false);
      setDeletingStat(null);
    } catch (err: any) {
      setError('Failed to delete statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingStat) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (editingStat.type === 'batting') {
        await statsAPI.updateBattingStats(editingStat.id, battingForm);
      } else {
        await statsAPI.updateBowlingStats(editingStat.id, bowlingForm);
      }
      setSuccess('Statistics updated successfully!');
      await loadPlayerStats();
      setEditDialogOpen(false);
      setEditingStat(null);
    } catch (err: any) {
      setError('Failed to update statistics');
    } finally {
      setLoading(false);
    }
  };

  if (!canEdit) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">You don't have permission to edit innings.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Edit Player Innings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <select
          value={selectedPlayerId}
          onChange={(e) => setSelectedPlayerId(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            minHeight: '56px',
          }}
        >
          <option value={0}>Select Player</option>
          {players.map((player) => (
            <option key={player.playerId} value={player.playerId}>
              {player.playerName} ({player.country})
            </option>
          ))}
        </select>
      </Box>

      {selectedPlayerId > 0 && (
        <Paper>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label={`Batting Innings (${battingStats.length})`} />
              <Tab label={`Bowling Innings (${bowlingStats.length})`} />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : battingStats.length === 0 ? (
              <Alert severity="info">No batting innings found for this player.</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Match Date</TableCell>
                      <TableCell align="right">Runs</TableCell>
                      <TableCell align="right">Balls</TableCell>
                      <TableCell align="right">4s</TableCell>
                      <TableCell align="right">6s</TableCell>
                      <TableCell>Against</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {battingStats.map((stat) => (
                      <TableRow key={stat.id}>
                        <TableCell>{new Date(stat.matchDate).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{stat.runs}</TableCell>
                        <TableCell align="right">{stat.ballsPlayed}</TableCell>
                        <TableCell align="right">{stat.fours}</TableCell>
                        <TableCell align="right">{stat.sixes}</TableCell>
                        <TableCell>{stat.against}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit('batting', stat.id)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete('batting', stat.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : bowlingStats.length === 0 ? (
              <Alert severity="info">No bowling innings found for this player.</Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Match Date</TableCell>
                      <TableCell align="right">Overs</TableCell>
                      <TableCell align="right">Maidens</TableCell>
                      <TableCell align="right">Runs</TableCell>
                      <TableCell align="right">Wickets</TableCell>
                      <TableCell>Against</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bowlingStats.map((stat) => (
                      <TableRow key={stat.id}>
                        <TableCell>{new Date(stat.matchDate).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{stat.overs}</TableCell>
                        <TableCell align="right">{stat.maidens}</TableCell>
                        <TableCell align="right">{stat.runsGiven}</TableCell>
                        <TableCell align="right">{stat.wicketsTaken}</TableCell>
                        <TableCell>{stat.against}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleEdit('bowling', stat.id)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete('bowling', stat.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Paper>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit {editingStat?.type === 'batting' ? 'Batting' : 'Bowling'} Statistics
        </DialogTitle>
        <DialogContent>
          {editingStat?.type === 'batting' ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Runs"
                  type="number"
                  value={battingForm.runs}
                  onChange={(e) => setBattingForm({ ...battingForm, runs: parseInt(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Balls Played"
                  type="number"
                  value={battingForm.ballsPlayed}
                  onChange={(e) => setBattingForm({ ...battingForm, ballsPlayed: parseInt(e.target.value) || 1 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fours"
                  type="number"
                  value={battingForm.fours}
                  onChange={(e) => setBattingForm({ ...battingForm, fours: parseInt(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sixes"
                  type="number"
                  value={battingForm.sixes}
                  onChange={(e) => setBattingForm({ ...battingForm, sixes: parseInt(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Against"
                  value={battingForm.against}
                  onChange={(e) => setBattingForm({ ...battingForm, against: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Match Date"
                  type="date"
                  value={battingForm.matchDate}
                  onChange={(e) => setBattingForm({ ...battingForm, matchDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Overs"
                  type="number"
                  value={bowlingForm.overs}
                  onChange={(e) => setBowlingForm({ ...bowlingForm, overs: parseFloat(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maidens"
                  type="number"
                  value={bowlingForm.maidens}
                  onChange={(e) => setBowlingForm({ ...bowlingForm, maidens: parseInt(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Runs Given"
                  type="number"
                  value={bowlingForm.runsGiven}
                  onChange={(e) => setBowlingForm({ ...bowlingForm, runsGiven: parseInt(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Wickets Taken"
                  type="number"
                  value={bowlingForm.wicketsTaken}
                  onChange={(e) => setBowlingForm({ ...bowlingForm, wicketsTaken: parseInt(e.target.value) || 0 })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Against"
                  value={bowlingForm.against}
                  onChange={(e) => setBowlingForm({ ...bowlingForm, against: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Match Date"
                  type="date"
                  value={bowlingForm.matchDate}
                  onChange={(e) => setBowlingForm({ ...bowlingForm, matchDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this statistics record? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Shadow DOM Footer */}
      <Box sx={{ mt: 4 }}>
        <ShadowDOMFooter />
      </Box>
    </Box>
  );
};

export default EditInningsPage;

