import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  SportsCricket as CricketIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalyticsResponse } from '../types';
import { analyticsAPI } from '../services/api';
import ShadowDOMCard from '../components/ShadowDOMCard';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsAPI.getAnalyticsSummary();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (!analytics) {
    return (
      <Alert severity="info">
        No analytics data available
      </Alert>
    );
  }

  const battingData = [
    { name: 'Highest Runs', value: analytics.highestRuns, player: analytics.highestRunsPlayer },
    { name: 'Total Centuries', value: analytics.totalCenturies, player: analytics.totalCenturiesPlayer },
    { name: 'Most Sixes', value: analytics.mostSixes, player: analytics.mostSixesPlayer },
    { name: 'Most Fours', value: analytics.mostFours, player: analytics.mostFoursPlayer },
  ];

  const bowlingData = [
    { name: 'Highest Wickets', value: analytics.highestWickets, player: analytics.highestWicketsPlayer },
    { name: 'Most Maidens', value: analytics.mostMaidenOvers, player: analytics.mostMaidenOversPlayer },
    { name: 'Five Wicket Hauls', value: analytics.totalFiveWicketHauls, player: analytics.totalFiveWicketHaulsPlayer },
  ];

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, subtitle, icon, color }) => (
    <Card 
      sx={{ height: '100%' }}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Cricket Analytics Dashboard
      </Typography>

      {/* Key Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Highest Runs"
            value={analytics.highestRuns}
            subtitle={analytics.highestRunsPlayer}
            icon={<TrendingUpIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Highest Wickets"
            value={analytics.highestWickets}
            subtitle={analytics.highestWicketsPlayer}
            icon={<TrophyIcon />}
            color="#dc004e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Best Batting Average"
            value={analytics.bestBattingAverage.toFixed(2)}
            subtitle={analytics.bestBattingAveragePlayer}
            icon={<CricketIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Best Bowling Economy"
            value={analytics.bestBowlingEconomy.toFixed(2)}
            subtitle={analytics.bestBowlingEconomyPlayer}
            icon={<TimelineIcon />}
            color="#f57c00"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Batting Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={battingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} - ${props.payload.player}`,
                    name
                  ]}
                />
                <Bar dataKey="value" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Bowling Statistics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bowlingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} - ${props.payload.player}`,
                    name
                  ]}
                />
                <Bar dataKey="value" fill="#dc004e" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Achievements - Using Shadow DOM */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <ShadowDOMCard
            title="Most Recent Century"
            playerName={analytics.mostRecentCenturyPlayer}
            date={analytics.mostRecentCenturyDate}
            testId="recent-century-card"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ShadowDOMCard
            title="Most Recent 5-Wicket Haul"
            playerName={analytics.mostRecentFiveWicketHaulPlayer}
            date={analytics.mostRecentFiveWicketHaulDate}
            testId="recent-five-wicket-card"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsPage;
