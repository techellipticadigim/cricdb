-- CricketDB Database Initialization Script

USE cricketdb;

-- This script creates the database, user, and inserts sample data
-- Tables will be created by JPA when the Spring Boot application starts

-- Insert sample users
INSERT INTO users (email, password, role) VALUES 
('admin@cricketdb.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'ADMIN');
-- Note: The password hash above is for 'admin123'

-- Insert sample players
INSERT INTO players (player_name, country, start_year, gender, role, notes) VALUES 
('Virat Kohli', 'India', 2008, 'MALE', 'BATSMAN', 'Former Indian captain and one of the greatest batsmen'),
('Steve Smith', 'Australia', 2010, 'MALE', 'BATSMAN', 'Former Australian captain, known for his unique batting technique'),
('Joe Root', 'England', 2012, 'MALE', 'BATSMAN', 'Former English captain and prolific run scorer'),
('Kane Williamson', 'New Zealand', 2010, 'MALE', 'BATSMAN', 'Former New Zealand captain, known for his calm batting'),
('Babar Azam', 'Pakistan', 2015, 'MALE', 'BATSMAN', 'Current Pakistani captain and top-ranked batsman'),
('Pat Cummins', 'Australia', 2011, 'MALE', 'BOWLER', 'Current Australian captain and fast bowler'),
('Jasprit Bumrah', 'India', 2016, 'MALE', 'BOWLER', 'Indian fast bowler known for his unique action'),
('James Anderson', 'England', 2003, 'MALE', 'BOWLER', 'English fast bowler and leading wicket-taker'),
('Trent Boult', 'New Zealand', 2011, 'MALE', 'BOWLER', 'New Zealand left-arm fast bowler'), 
('Shaheen Afridi', 'Pakistan', 2018, 'MALE', 'BOWLER', 'Pakistani fast bowler'),
('Ben Stokes', 'England', 2013, 'MALE', 'ALL_ROUNDER', 'English all-rounder and former captain'),
('Ravindra Jadeja', 'India', 2012, 'MALE', 'ALL_ROUNDER', 'Indian all-rounder known for his fielding'),
('Mitchell Marsh', 'Australia', 2011, 'MALE', 'ALL_ROUNDER', 'Australian all-rounder'),
('Ellyse Perry', 'Australia', 2007, 'FEMALE', 'ALL_ROUNDER', 'Australian women cricketer, all-rounder'),
('Smriti Mandhana', 'India', 2013, 'FEMALE', 'BATSMAN', 'Indian women cricketer, opening batsman');

-- Insert sample batting statistics
INSERT INTO batting_stats (player_id, runs, balls_played, sixes, fours, against, match_date) VALUES 
(1, 120, 140, 2, 12, 'Australia', '2023-01-15'),
(1, 85, 95, 1, 8, 'England', '2023-02-20'),
(1, 156, 180, 3, 15, 'New Zealand', '2023-03-10'),
(2, 110, 125, 1, 10, 'India', '2023-01-20'),
(3, 78, 90, 0, 7, 'Australia', '2023-02-15');

-- Insert sample bowling statistics
INSERT INTO bowling_stats (player_id, overs, maidens, runs_given, wickets_taken, against, match_date) VALUES 
(6, 10.0, 2, 45, 4, 'India', '2023-01-15'),
(7, 9.0, 1, 42, 5, 'Australia', '2023-01-20'),
(8, 12.0, 4, 48, 3, 'Australia', '2023-02-15'),
(9, 9.5, 2, 40, 4, 'Pakistan', '2023-02-25'),
(10, 8.0, 1, 36, 5, 'England', '2023-03-05');
