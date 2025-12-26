import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  BarChart as StatsIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Player } from '../types';
import { playerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PlayerForm from './PlayerForm';

const PlayerList: React.FC = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const { hasRole } = useAuth();

  const canEdit = hasRole('ADMIN') || hasRole('DATA_ENTRY');

  useEffect(() => {
    loadPlayers();
    loadCountries();
  }, [selectedCountry]);

  const loadPlayers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = selectedCountry === 'All' 
        ? await playerAPI.getAllPlayers()
        : await playerAPI.getPlayersByCountry(selectedCountry);
      setPlayers(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const loadCountries = async () => {
    try {
      const data = await playerAPI.getDistinctCountries();
      setCountries(['All', ...data]);
    } catch (err) {
      console.error('Failed to load countries:', err);
    }
  };

  const handleAddPlayer = () => {
    setEditingPlayer(null);
    setFormOpen(true);
  };

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player);
    setFormOpen(true);
  };

  const handleDeletePlayer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await playerAPI.deletePlayer(id);
        await loadPlayers();
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to delete player');
      }
    }
  };

  const handleFormSubmit = async (playerData: any) => {
    try {
      if (editingPlayer) {
        await playerAPI.updatePlayer(editingPlayer.playerId, playerData);
      } else {
        await playerAPI.createPlayer(playerData);
      }
      setFormOpen(false);
      setEditingPlayer(null);
      await loadPlayers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save player');
    }
  };

  const handleViewStatistics = (playerId: number) => {
    const url = `${window.location.origin}/players/${playerId}/statistics`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const columns: GridColDef[] = [
    { field: 'playerId', headerName: 'ID', width: 70 },
    { 
      field: 'playerName', 
      headerName: 'Name', 
      width: 200,
      renderCell: (params) => (
        <MuiLink
          component="button"
          variant="body2"
          onClick={() => handleViewStatistics(params.row.playerId)}
          sx={{
            cursor: 'pointer',
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': {
              textDecoration: 'underline',
            },
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
          data-testid={`player-name-link-${params.row.playerId}`}
        >
          {params.value}
          <OpenInNewIcon sx={{ fontSize: 14 }} />
        </MuiLink>
      ),
    },
    { field: 'country', headerName: 'Country', width: 120 },
    { field: 'startYear', headerName: 'Start Year', width: 100 },
    { 
      field: 'gender', 
      headerName: 'Gender', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'MALE' ? 'primary' : 'secondary'}
          size="small"
        />
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value.replace('_', ' ')} 
          variant="outlined"
          size="small"
        />
      )
    },
    { field: 'notes', headerName: 'Notes', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleViewStatistics(params.row.playerId)}
            data-testid={`view-stats-${params.row.playerId}`}
            aria-label={`View statistics for ${params.row.playerName}`}
            color="primary"
            title="View Statistics (Opens in new tab)"
          >
            <StatsIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEditPlayer(params.row)}
            disabled={!canEdit}
            data-testid={`edit-player-${params.row.playerId}`}
            aria-label={`Edit player ${params.row.playerName}`}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeletePlayer(params.row.playerId)}
            disabled={!canEdit}
            data-testid={`delete-player-${params.row.playerId}`}
            aria-label={`Delete player ${params.row.playerName}`}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading && players.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Player Management
        </Typography>
        {canEdit && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddPlayer}
            data-testid="add-player-button"
            aria-label="Add new player"
          >
            Add Player
          </Button>
        )}
      </Box>

      <Box mb={3}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Country</InputLabel>
          <Select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            label="Filter by Country"
            data-testid="country-filter"
            aria-label="Filter players by country"
          >
            {countries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={players}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          getRowId={(row) => row.playerId}
          loading={loading}
          data-testid="players-data-grid"
          aria-label="Players data table"
        />
      </Paper>

      <PlayerForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPlayer(null);
        }}
        onSubmit={handleFormSubmit}
        player={editingPlayer}
      />
    </Box>
  );
};

export default PlayerList;
