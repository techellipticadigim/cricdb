import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { BattingStatsRequest, BowlingStatsRequest } from '../types';
import { statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ShadowDOMFooter from '../components/ShadowDOMFooter';

const EditInningPage: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchParams] = useSearchParams();
  const canEdit = hasRole('ADMIN') || hasRole('DATA_ENTRY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const battingId = searchParams.get('battingId');
  const bowlingId = searchParams.get('bowlingId');
  const playerId = searchParams.get('playerId');

  const [battingForm, setBattingForm] = useState<BattingStatsRequest | null>(null);
  const [bowlingForm, setBowlingForm] = useState<BowlingStatsRequest | null>(null);

  useEffect(() => {
    loadInningData();
  }, [battingId, bowlingId]);

  const loadInningData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Load batting stats if available
      if (battingId) {
        const battingStat = await statsAPI.getBattingStatById(parseInt(battingId));
        setBattingForm({
          playerId: battingStat.player.playerId,
          runs: battingStat.runs,
          ballsPlayed: battingStat.ballsPlayed,
          sixes: battingStat.sixes,
          fours: battingStat.fours,
          against: battingStat.against,
          matchDate: battingStat.matchDate,
        });
      }

      // Load bowling stats if available
      if (bowlingId) {
        const bowlingStat = await statsAPI.getBowlingStatById(parseInt(bowlingId));
        setBowlingForm({
          playerId: bowlingStat.player.playerId,
          overs: bowlingStat.overs,
          maidens: bowlingStat.maidens,
          runsGiven: bowlingStat.runsGiven,
          wicketsTaken: bowlingStat.wicketsTaken,
          against: bowlingStat.against,
          matchDate: bowlingStat.matchDate,
        });
      }
    } catch (err: any) {
      setError('Failed to load inning data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!playerId) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Update batting stats if available
      if (battingId && battingForm) {
        await statsAPI.updateBattingStats(parseInt(battingId), battingForm);
      }
      
      // Update bowling stats if available
      if (bowlingId && bowlingForm) {
        await statsAPI.updateBowlingStats(parseInt(bowlingId), bowlingForm);
      }
      
      setSuccess('Innings updated successfully!');
      
      // Notify parent window to refresh
      if (window.parent) {
        window.parent.postMessage({ type: 'INNING_UPDATED', playerId }, '*');
      }
      
      // Close after a delay
      setTimeout(() => {
        if (window.parent) {
          window.parent.postMessage({ type: 'CLOSE_DIALOG' }, '*');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update innings');
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

  if (loading && !battingForm && !bowlingForm) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Edit Inning
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {battingForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Batting Statistics
          </Typography>
          <Grid container spacing={2}>
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
        </Paper>
      )}

      {bowlingForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Bowling Statistics
          </Typography>
          <Grid container spacing={2}>
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
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          onClick={() => {
            if (window.parent) {
              window.parent.postMessage({ type: 'CLOSE_DIALOG' }, '*');
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={loading || (!battingForm && !bowlingForm)}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </Box>

      {/* Shadow DOM Footer */}
      <Box sx={{ mt: 4 }}>
        <ShadowDOMFooter />
      </Box>
    </Box>
  );
};

export default EditInningPage;

