import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import PlayerManagementPage from './pages/PlayerManagementPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PlayerStatisticsPage from './pages/PlayerStatisticsPage';
import EditInningsPage from './pages/EditInningsPage';
import EditInningPage from './pages/EditInningPage';
import Layout from './components/Layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Also check localStorage directly as fallback for new tabs
  const checkAuth = (): boolean => {
    if (isAuthenticated) return true;
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return !!(token && user);
    } catch {
      return false;
    }
  };

  return checkAuth() ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const LoginRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (isAuthenticated) {
    // Redirect to the page they were trying to access, or analytics as default
    const from = (location.state as any)?.from?.pathname || '/analytics';
    return <Navigate to={from} replace />;
  }
  
  return <LoginPage />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={<LoginRoute />} 
          />
          <Route
            path="/"
            element={<Navigate to="/analytics" replace />}
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <AnalyticsPage />
              </Layout>
            }
          />
          <Route
            path="/players"
            element={
              <ProtectedRoute>
                <Layout>
                  <PlayerManagementPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/players/:playerId/statistics"
            element={
              <ProtectedRoute>
                <Layout>
                  <PlayerStatisticsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-innings"
            element={
              <ProtectedRoute>
                <EditInningsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-inning"
            element={
              <ProtectedRoute>
                <EditInningPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
