import { test, expect } from '@playwright/test';

test.describe('Player Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    
    // Login as admin
    await page.fill('[data-testid="login-email"]', 'admin@cricketdb.com');
    await page.fill('[data-testid="login-password"]', 'admin123');
    await page.click('[data-testid="login-submit"]');
    
    // Wait for redirect to players page
    await page.waitForURL('http://localhost:3000/players');
  });

  test('should display players list', async ({ page }) => {
    // Check if players data grid is visible
    await expect(page.locator('[data-testid="players-data-grid"]')).toBeVisible();
    
    // Check if add player button is visible for admin
    await expect(page.locator('[data-testid="add-player-button"]')).toBeVisible();
  });

  test('should add a new player', async ({ page }) => {
    // Click add player button
    await page.click('[data-testid="add-player-button"]');
    
    // Fill player form
    await page.fill('[data-testid="player-name-input"]', 'Test Player');
    await page.selectOption('[data-testid="country-select"]', 'India');
    await page.fill('[data-testid="start-year-input"]', '2020');
    await page.selectOption('[data-testid="role-select"]', 'BATSMAN');
    await page.check('[data-testid="gender-male"]');
    await page.fill('[data-testid="notes-input"]', 'Test notes for new player');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Wait for form to close and player to appear in list
    await expect(page.locator('[data-testid="player-form-dialog"]')).not.toBeVisible();
    
    // Verify player appears in the data grid
    await expect(page.locator('[data-testid="players-data-grid"]')).toContainText('Test Player');
  });

  test('should filter players by country', async ({ page }) => {
    // Select country filter
    await page.selectOption('[data-testid="country-filter"]', 'India');
    
    // Wait for data to load
    await page.waitForLoadState('networkidle');
    
    // Verify all displayed players are from India
    const playerRows = page.locator('[data-testid="players-data-grid"] .MuiDataGrid-row');
    const count = await playerRows.count();
    
    for (let i = 0; i < count; i++) {
      const countryCell = playerRows.nth(i).locator('[data-field="country"]');
      await expect(countryCell).toContainText('India');
    }
  });

  test('should edit existing player', async ({ page }) => {
    // Click edit button for first player
    await page.click('[data-testid="edit-player-1"]');
    
    // Update player name
    await page.fill('[data-testid="player-name-input"]', 'Updated Player Name');
    
    // Submit form
    await page.click('[data-testid="submit-button"]');
    
    // Verify player name is updated
    await expect(page.locator('[data-testid="players-data-grid"]')).toContainText('Updated Player Name');
  });

  test('should delete player', async ({ page }) => {
    // Get initial player count
    const initialRows = page.locator('[data-testid="players-data-grid"] .MuiDataGrid-row');
    const initialCount = await initialRows.count();
    
    // Click delete button for first player
    await page.click('[data-testid="delete-player-1"]');
    
    // Confirm deletion in dialog
    page.on('dialog', dialog => dialog.accept());
    
    // Wait for player to be removed
    await page.waitForLoadState('networkidle');
    
    // Verify player count decreased
    const finalRows = page.locator('[data-testid="players-data-grid"] .MuiDataGrid-row');
    const finalCount = await finalRows.count();
    
    expect(finalCount).toBe(initialCount - 1);
  });

  test('should add batting statistics', async ({ page }) => {
    // Navigate to stats tab
    await page.click('[data-testid="stats-tab"]');
    
    // Fill batting stats form
    await page.selectOption('[data-testid="batting-player-select"]', '1');
    await page.fill('[data-testid="runs-input"]', '100');
    await page.fill('[data-testid="balls-played-input"]', '120');
    await page.fill('[data-testid="sixes-input"]', '2');
    await page.fill('[data-testid="fours-input"]', '8');
    await page.fill('[data-testid="against-team-input"]', 'Australia');
    await page.fill('[data-testid="match-date-input"]', '2024-01-15');
    
    // Submit batting stats
    await page.click('[data-testid="submit-batting-stats"]');
    
    // Verify success message
    await expect(page.locator('text=Batting statistics added successfully!')).toBeVisible();
  });

  test('should add bowling statistics', async ({ page }) => {
    // Navigate to stats tab
    await page.click('[data-testid="stats-tab"]');
    
    // Switch to bowling stats tab
    await page.click('[data-testid="bowling-stats-tab"]');
    
    // Fill bowling stats form
    await page.selectOption('[data-testid="bowling-player-select"]', '1');
    await page.fill('[data-testid="overs-input"]', '10');
    await page.fill('[data-testid="maidens-input"]', '2');
    await page.fill('[data-testid="runs-given-input"]', '45');
    await page.fill('[data-testid="wickets-input"]', '3');
    await page.fill('[data-testid="bowling-against-input"]', 'Australia');
    await page.fill('[data-testid="bowling-match-date-input"]', '2024-01-15');
    
    // Submit bowling stats
    await page.click('[data-testid="submit-bowling-stats"]');
    
    // Verify success message
    await expect(page.locator('text=Bowling statistics added successfully!')).toBeVisible();
  });
});

test.describe('Analytics Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to analytics
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="login-email"]', 'viewer@cricketdb.com');
    await page.fill('[data-testid="login-password"]', 'viewer123');
    await page.click('[data-testid="login-submit"]');
    
    await page.goto('http://localhost:3000/analytics');
  });

  test('should display analytics dashboard', async ({ page }) => {
    // Check if analytics cards are visible
    await expect(page.locator('[data-testid="stat-card-highest-runs"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-card-highest-wickets"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-card-best-batting-average"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-card-best-bowling-economy"]')).toBeVisible();
    
    // Check if charts are visible
    await expect(page.locator('text=Batting Statistics')).toBeVisible();
    await expect(page.locator('text=Bowling Statistics')).toBeVisible();
    
    // Check recent achievements
    await expect(page.locator('[data-testid="recent-century-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="recent-five-wicket-card"]')).toBeVisible();
  });
});

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('[data-testid="login-email"]', 'admin@cricketdb.com');
    await page.fill('[data-testid="login-password"]', 'admin123');
    await page.click('[data-testid="login-submit"]');
    
    // Should redirect to players page
    await page.waitForURL('http://localhost:3000/players');
    await expect(page.locator('[data-testid="players-data-grid"]')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('[data-testid="login-email"]', 'invalid@example.com');
    await page.fill('[data-testid="login-password"]', 'wrongpassword');
    await page.click('[data-testid="login-submit"]');
    
    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('http://localhost:3000/login');
    await page.fill('[data-testid="login-email"]', 'admin@cricketdb.com');
    await page.fill('[data-testid="login-password"]', 'admin123');
    await page.click('[data-testid="login-submit"]');
    
    await page.waitForURL('http://localhost:3000/players');
    
    // Logout
    await page.click('[data-testid="nav-logout"]');
    
    // Should redirect to login page
    await page.waitForURL('http://localhost:3000/login');
    await expect(page.locator('[data-testid="login-email"]')).toBeVisible();
  });
});
