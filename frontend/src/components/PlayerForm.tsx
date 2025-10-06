import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Player, PlayerRequest } from '../types';

interface PlayerFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (player: PlayerRequest) => void;
  player?: Player | null;
  loading?: boolean;
}

const countries = [
  'India', 'Australia', 'England', 'South Africa', 'New Zealand',
  'Pakistan', 'Sri Lanka', 'Bangladesh', 'West Indies', 'Afghanistan'
];

const PlayerForm: React.FC<PlayerFormProps> = ({
  open,
  onClose,
  onSubmit,
  player,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PlayerRequest>({
    playerName: '',
    country: '',
    startYear: new Date().getFullYear(),
    gender: 'MALE',
    role: 'BATSMAN',
    notes: '',
  });

  useEffect(() => {
    if (player) {
      setFormData({
        playerName: player.playerName,
        country: player.country,
        startYear: player.startYear,
        gender: player.gender,
        role: player.role,
        notes: player.notes || '',
      });
    } else {
      setFormData({
        playerName: '',
        country: '',
        startYear: new Date().getFullYear(),
        gender: 'MALE',
        role: 'BATSMAN',
        notes: '',
      });
    }
  }, [player, open]);

  const handleChange = (field: keyof PlayerRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: keyof PlayerRequest) => (
    event: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      data-testid="player-form-dialog"
      aria-label="Player form dialog"
    >
      <DialogTitle data-testid="player-form-title">
        {player ? 'Edit Player' : 'Add New Player'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Player Name"
              value={formData.playerName}
              onChange={handleChange('playerName')}
              required
              data-testid="player-name-input"
              aria-label="Player name input"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <select
              value={formData.country}
              onChange={handleSelectChange('country')}
              required
              data-testid="country-select"
              aria-label="Country selection"
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
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Start Year"
              type="number"
              value={formData.startYear}
              onChange={handleChange('startYear')}
              required
              inputProps={{ min: 1800, max: new Date().getFullYear() }}
              data-testid="start-year-input"
              aria-label="Start year input"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <select
              value={formData.role}
              onChange={handleSelectChange('role')}
              required
              data-testid="role-select"
              aria-label="Player role selection"
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
              <option value="">Select Role</option>
              <option value="BATSMAN">Batsman</option>
              <option value="BOWLER">Bowler</option>
              <option value="ALL_ROUNDER">All Rounder</option>
            </select>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                value={formData.gender}
                onChange={handleSelectChange('gender')}
                data-testid="gender-radio-group"
                aria-label="Gender selection"
              >
                <FormControlLabel
                  value="MALE"
                  control={<Radio />}
                  label="Male"
                  data-testid="gender-male"
                />
                <FormControlLabel
                  value="FEMALE"
                  control={<Radio />}
                  label="Female"
                  data-testid="gender-female"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              data-testid="notes-input"
              aria-label="Notes input"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} data-testid="cancel-button">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          data-testid="submit-button"
          aria-label="Submit player form"
        >
          {loading ? 'Saving...' : (player ? 'Update' : 'Add Player')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerForm;
