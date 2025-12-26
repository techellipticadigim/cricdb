import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PlayerList from '../components/PlayerList';
import PlayerStatsForm from '../components/PlayerStatsForm';
import ShadowDOMFooter from '../components/ShadowDOMFooter';

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
      id={`player-tabpanel-${index}`}
      aria-labelledby={`player-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PlayerManagementPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { hasRole } = useAuth();

  const canAddStats = hasRole('ADMIN') || hasRole('DATA_ENTRY');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="player management tabs">
            <Tab 
              label="Players" 
              id="player-tab-0"
              aria-controls="player-tabpanel-0"
              data-testid="players-tab"
            />
            {canAddStats && (
              <Tab 
                label="Add Statistics" 
                id="player-tab-1"
                aria-controls="player-tabpanel-1"
                data-testid="stats-tab"
              />
            )}
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <PlayerList />
        </TabPanel>
        
        {canAddStats && (
          <TabPanel value={tabValue} index={1}>
            <PlayerStatsForm />
          </TabPanel>
        )}
      </Paper>

      {/* Shadow DOM Footer */}
      <Box sx={{ mt: 4 }}>
        <ShadowDOMFooter />
      </Box>
    </Box>
  );
};

export default PlayerManagementPage;
