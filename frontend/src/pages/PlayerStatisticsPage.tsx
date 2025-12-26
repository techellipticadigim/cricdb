import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  Drawer,
  IconButton,
  Dialog,
  DialogTitle,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  SportsCricket as CricketIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { BattingStats, BowlingStats, Player } from '../types';
import { statsAPI, playerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ShadowDOMFooter from '../components/ShadowDOMFooter';

// Combine all innings into a single array with match date
interface CombinedInning {
  id: string;
  matchDate: string;
  type: 'Batting' | 'Bowling' | 'Both';
  battingId?: number;
  bowlingId?: number;
  batting?: {
    runs: number;
    balls: number;
    sixes: number;
    fours: number;
  };
  bowling?: {
    overs: number;
    maidens: number;
    runsGiven: number;
    wickets: number;
  };
  against: string;
}

const PlayerStatisticsPage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canEdit = hasRole('ADMIN') || hasRole('DATA_ENTRY');
  const [player, setPlayer] = useState<Player | null>(null);
  const [battingStats, setBattingStats] = useState<BattingStats[]>([]);
  const [bowlingStats, setBowlingStats] = useState<BowlingStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Edit iframe dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingInning, setEditingInning] = useState<CombinedInning | null>(null);

  useEffect(() => {
    if (playerId) {
      loadPlayerData();
    }
  }, [playerId]);

  const loadPlayerData = async () => {
    if (!playerId) return;
    
    setLoading(true);
    setError('');
    try {
      console.log('Loading player data for playerId:', playerId);
      const [playerData, battingData, bowlingData] = await Promise.all([
        playerAPI.getPlayerById(parseInt(playerId)),
        statsAPI.getBattingStatsByPlayer(parseInt(playerId)),
        statsAPI.getBowlingStatsByPlayer(parseInt(playerId)),
      ]);
      
      console.log('Player data:', playerData);
      console.log('Batting data:', battingData);
      console.log('Bowling data:', bowlingData);
      console.log('Batting data type:', typeof battingData, Array.isArray(battingData));
      console.log('Bowling data type:', typeof bowlingData, Array.isArray(bowlingData));
      
      setPlayer(playerData);
      // Ensure we always set arrays, even if API returns null/undefined
      const battingArray = Array.isArray(battingData) ? battingData : [];
      const bowlingArray = Array.isArray(bowlingData) ? bowlingData : [];
      
      console.log('Setting batting stats array length:', battingArray.length);
      console.log('Setting bowling stats array length:', bowlingArray.length);
      
      setBattingStats(battingArray);
      setBowlingStats(bowlingArray);
    } catch (err: any) {
      console.error('Error loading player data:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.error || err.message || 'Failed to load player statistics');
      // Reset to empty arrays on error
      setBattingStats([]);
      setBowlingStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'INNING_UPDATED') {
        // Reload player data when inning is updated
        if (playerId) {
          loadPlayerData();
        }
      }
      if (event.data.type === 'CLOSE_DIALOG') {
        setEditDialogOpen(false);
        setEditingInning(null);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [playerId]);

  const handleEditInning = (inning: CombinedInning) => {
    setEditingInning(inning);
    setEditDialogOpen(true);
  };
  
  // Create a map of match dates to combine batting and bowling stats
  const matchMap = new Map<string, CombinedInning>();

  // Add batting innings - ensure battingStats is an array
  if (Array.isArray(battingStats)) {
    battingStats.forEach((stat) => {
      const dateKey = stat.matchDate;
      if (!matchMap.has(dateKey)) {
        matchMap.set(dateKey, {
          id: `batting-${stat.id}`,
          matchDate: stat.matchDate,
          type: 'Batting',
          battingId: stat.id,
          batting: {
            runs: stat.runs,
            balls: stat.ballsPlayed,
            sixes: stat.sixes,
            fours: stat.fours,
          },
          against: stat.against,
        });
      } else {
        const existing = matchMap.get(dateKey)!;
        existing.battingId = stat.id;
        existing.batting = {
          runs: stat.runs,
          balls: stat.ballsPlayed,
          sixes: stat.sixes,
          fours: stat.fours,
        };
      }
    });
  }

  // Add bowling innings - ensure bowlingStats is an array
  if (Array.isArray(bowlingStats)) {
    bowlingStats.forEach((stat) => {
    const dateKey = stat.matchDate;
    if (!matchMap.has(dateKey)) {
      matchMap.set(dateKey, {
        id: `bowling-${stat.id}`,
        matchDate: stat.matchDate,
        type: 'Bowling',
        bowlingId: stat.id,
        bowling: {
          overs: stat.overs,
          maidens: stat.maidens,
          runsGiven: stat.runsGiven,
          wickets: stat.wicketsTaken,
        },
        against: stat.against,
      });
    } else {
      const existing = matchMap.get(dateKey)!;
      existing.bowlingId = stat.id;
      existing.bowling = {
        overs: stat.overs,
        maidens: stat.maidens,
        runsGiven: stat.runsGiven,
        wickets: stat.wicketsTaken,
      };
      // If both batting and bowling exist, mark as both
      if (existing.batting) {
        existing.type = 'Both';
      }
    }
    });
  }

  // Convert map to array and sort by date (newest first)
  const allInnings = Array.from(matchMap.values()).sort((a, b) => 
    new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime()
  );

  // Calculate batting summary
  const battingSummary = (Array.isArray(battingStats) ? battingStats : []).reduce(
    (acc, stat) => ({
      totalRuns: acc.totalRuns + stat.runs,
      totalBalls: acc.totalBalls + stat.ballsPlayed,
      totalSixes: acc.totalSixes + stat.sixes,
      totalFours: acc.totalFours + stat.fours,
      matches: acc.matches + 1,
    }),
    { totalRuns: 0, totalBalls: 0, totalSixes: 0, totalFours: 0, matches: 0 }
  );

  const battingAverage = battingSummary.matches > 0 
    ? (battingSummary.totalRuns / battingSummary.matches).toFixed(2)
    : '0.00';
  
  const strikeRate = battingSummary.totalBalls > 0
    ? ((battingSummary.totalRuns / battingSummary.totalBalls) * 100).toFixed(2)
    : '0.00';

  // Calculate bowling summary
  const bowlingSummary = (Array.isArray(bowlingStats) ? bowlingStats : []).reduce(
    (acc, stat) => ({
      totalOvers: acc.totalOvers + stat.overs,
      totalMaidens: acc.totalMaidens + stat.maidens,
      totalRunsGiven: acc.totalRunsGiven + stat.runsGiven,
      totalWickets: acc.totalWickets + stat.wicketsTaken,
      matches: acc.matches + 1,
    }),
    { totalOvers: 0, totalMaidens: 0, totalRunsGiven: 0, totalWickets: 0, matches: 0 }
  );

  const bowlingAverage = bowlingSummary.totalWickets > 0
    ? (bowlingSummary.totalRunsGiven / bowlingSummary.totalWickets).toFixed(2)
    : '0.00';
  
  const economyRate = bowlingSummary.totalOvers > 0
    ? (bowlingSummary.totalRunsGiven / bowlingSummary.totalOvers).toFixed(2)
    : '0.00';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/players')}
          sx={{ mb: 2 }}
        >
          Back to Players
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!player) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/players')}
          sx={{ mb: 2 }}
        >
          Back to Players
        </Button>
        <Alert severity="info">Player not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" flex={1} minWidth="200px">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/players')}
            sx={{ mr: 2 }}
          >
            Back to Players
          </Button>
          <Typography variant="h4" component="h1">
            {player.playerName} - Statistics
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<EditIcon />}
          onClick={() => {
            setDrawerOpen(true);
          }}
          sx={{ 
            minWidth: '160px',
            height: '48px',
            flexShrink: 0,
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            },
          }}
          data-testid="edit-innings-button"
        >
          Edit Innings
        </Button>
      </Box>

      {/* Player Info Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Country
              </Typography>
              <Typography variant="h6">{player.country}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Role
              </Typography>
              <Typography variant="h6">{player.role.replace('_', ' ')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Gender
              </Typography>
              <Typography variant="h6">{player.gender}</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Start Year
              </Typography>
              <Typography variant="h6">{player.startYear}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Array.isArray(battingStats) && battingStats.length > 0 && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total Runs
                  </Typography>
                  <Typography variant="h4">{battingSummary.totalRuns}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Batting Average
                  </Typography>
                  <Typography variant="h4">{battingAverage}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Strike Rate
                  </Typography>
                  <Typography variant="h4">{strikeRate}%</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Matches (Batting)
                  </Typography>
                  <Typography variant="h4">{battingSummary.matches}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
        {Array.isArray(bowlingStats) && bowlingStats.length > 0 && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Total Wickets
                  </Typography>
                  <Typography variant="h4">{bowlingSummary.totalWickets}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Bowling Average
                  </Typography>
                  <Typography variant="h4">{bowlingAverage}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Economy Rate
                  </Typography>
                  <Typography variant="h4">{economyRate}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Matches (Bowling)
                  </Typography>
                  <Typography variant="h4">{bowlingSummary.matches}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>

      {/* All Innings Table */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" component="h2">
            All Innings ({allInnings.length})
          </Typography>
        </Box>
        {allInnings.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">No innings statistics available for this player.</Alert>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Match Date</strong></TableCell>
                  <TableCell><strong>Against</strong></TableCell>
                  <TableCell align="center" colSpan={5}><strong>Batting</strong></TableCell>
                  <TableCell align="center" colSpan={4}><strong>Bowling</strong></TableCell>
                  {canEdit && <TableCell align="center"><strong>Actions</strong></TableCell>}
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell align="right"><strong>Runs</strong></TableCell>
                  <TableCell align="right"><strong>Balls</strong></TableCell>
                  <TableCell align="right"><strong>4s</strong></TableCell>
                  <TableCell align="right"><strong>6s</strong></TableCell>
                  <TableCell align="right"><strong>SR</strong></TableCell>
                  <TableCell align="right"><strong>Overs</strong></TableCell>
                  <TableCell align="right"><strong>Maidens</strong></TableCell>
                  <TableCell align="right"><strong>Runs</strong></TableCell>
                  <TableCell align="right"><strong>Wickets</strong></TableCell>
                  {canEdit && <TableCell align="center"></TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {allInnings.map((inning) => {
                  const strikeRate = inning.batting && inning.batting.balls > 0
                    ? ((inning.batting.runs / inning.batting.balls) * 100).toFixed(2)
                    : '-';
                  
                  return (
                    <TableRow key={inning.id} hover>
                      <TableCell>
                        {new Date(inning.matchDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{inning.against}</TableCell>
                      {/* Batting Stats */}
                      <TableCell align="right">
                        {inning.batting ? inning.batting.runs : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {inning.batting ? inning.batting.balls : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {inning.batting ? inning.batting.fours : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {inning.batting ? inning.batting.sixes : '-'}
                      </TableCell>
                      <TableCell align="right">{strikeRate}</TableCell>
                      {/* Bowling Stats */}
                      <TableCell align="right">
                        {inning.bowling ? inning.bowling.overs : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {inning.bowling ? inning.bowling.maidens : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {inning.bowling ? inning.bowling.runsGiven : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {inning.bowling ? inning.bowling.wickets : '-'}
                      </TableCell>
                      {canEdit && (
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            onClick={() => handleEditInning(inning)}
                            color="primary"
                            title="Edit Inning"
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Edit Inning Dialog with iframe */}
      <Dialog
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditingInning(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Edit Inning - {editingInning && new Date(editingInning.matchDate).toLocaleDateString()}
            </Typography>
            <IconButton onClick={() => {
              setEditDialogOpen(false);
              setEditingInning(null);
            }} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Box sx={{ height: 'calc(90vh - 64px)', overflow: 'hidden' }}>
          {editingInning && (
            <iframe
              src={`/edit-inning?playerId=${playerId}&battingId=${editingInning.battingId || ''}&bowlingId=${editingInning.bowlingId || ''}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Edit Inning"
            />
          )}
        </Box>
      </Dialog>

      {/* Drawer with iframe for Edit Innings */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: '80%', md: '60%' }, maxWidth: '900px' }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Edit Player Innings</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <iframe
              src={`/edit-innings?playerId=${playerId}`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              title="Edit Innings"
            />
          </Box>
        </Box>
      </Drawer>

      {/* Shadow DOM Footer */}
      <Box sx={{ mt: 4 }}>
        <ShadowDOMFooter />
      </Box>
    </Box>
  );
};

export default PlayerStatisticsPage;



