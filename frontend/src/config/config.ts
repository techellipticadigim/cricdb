export const config = {
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:6548/api',
  GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP === 'true',
};
