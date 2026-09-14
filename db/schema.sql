-- ==============================================================================
-- SOCCER MANAGER CLONE - INITIAL DATABASE SCHEMA (PostgreSQL)
-- ==============================================================================

-- 1. ENUMS (Pentru tipuri statice de date)
CREATE TYPE position_type AS ENUM ('GK', 'LB', 'CB', 'SW', 'RB', 'LM', 'CM', 'RM', 'LF', 'CF', 'RF');
CREATE TYPE training_focus AS ENUM ('AUTO', 'DEFENCE', 'MIDFIELD', 'ATTACK', 'STAMINA', 'MORALE');
CREATE TYPE match_type AS ENUM ('LEAGUE', 'CUP', 'FRIENDLY');
CREATE TYPE transfer_status AS ENUM ('OPEN', 'SOLD', 'CANCELLED');
CREATE TYPE staff_role AS ENUM ('COACH', 'SCOUT', 'DOCTOR', 'PHYSIO', 'GROUNDSMAN', 'YOUTH_COORD', 'ASSISTANT');

-- 2. USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_bot BOOLEAN DEFAULT FALSE -- Devine TRUE dacă jucătorul e inactiv > 21 zile
);

-- 2.1 STAFF
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role staff_role NOT NULL,
    
    -- Technical attribute
    skill_level INT DEFAULT 10 CHECK (skill_level BETWEEN 0 AND 100),
    
    -- Psychological attributes (Mainly for COACH)
    courage INT DEFAULT 50 CHECK (courage BETWEEN 1 AND 100),
    motivation_skill INT DEFAULT 50 CHECK (motivation_skill BETWEEN 1 AND 100),
    
    wage NUMERIC(10, 2) NOT NULL,
    contract_end DATE
);

-- 3. LEAGUES & DIVISIONS (Piramida Diviziilor)
CREATE TABLE divisions (
    id SERIAL PRIMARY KEY,
    level INT NOT NULL, -- 1=Divizia A, 2=Divizia B, ..., 8=Divizia H
    name VARCHAR(50) NOT NULL, -- ex: "Divizia C.4"
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. TEAMS
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    division_id INT REFERENCES divisions(id),
    name VARCHAR(100) NOT NULL,
    stadium_name VARCHAR(100) NOT NULL,
    budget NUMERIC(15, 2) DEFAULT 5000000.00, -- Buget de start 5M
    team_spirit INT DEFAULT 100 CHECK (team_spirit BETWEEN 0 AND 100),
    aggressiveness INT DEFAULT 50 CHECK (aggressiveness BETWEEN 0 AND 100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. STADIUMS
CREATE TABLE stadiums (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) ON DELETE CASCADE,
    capacity INT DEFAULT 5000,
    seats INT DEFAULT 5000,
    parking INT DEFAULT 1650, -- 33% din capacitate (SPInfo rule)
    toilets INT DEFAULT 50,    -- 1% din capacitate
    bars INT DEFAULT 10,       -- 0.2% din capacitate
    pitch_quality INT DEFAULT 100 CHECK (pitch_quality BETWEEN 0 AND 100)
);

-- 6. PLAYERS
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    team_id INT REFERENCES teams(id) ON DELETE SET NULL, -- Dacă e NULL = Free Agent
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    age INT NOT NULL,
    position position_type NOT NULL,
    
    -- Hidden Stats / Personality (The "Life Factors")
    professionalism INT DEFAULT 50 CHECK (professionalism BETWEEN 1 AND 100),
    stress_resistance INT DEFAULT 50 CHECK (stress_resistance BETWEEN 1 AND 100),
    
    -- Dynamic Stats
    fitness INT DEFAULT 100 CHECK (fitness BETWEEN 0 AND 100),
    morale INT DEFAULT 100 CHECK (morale BETWEEN 0 AND 100),
    stamina_max INT DEFAULT 100 CHECK (stamina_max BETWEEN 0 AND 100), -- Scade din beții/oboseală cronică
    form INT DEFAULT 50 CHECK (form BETWEEN 0 AND 100),
    experience INT DEFAULT 0 CHECK (experience BETWEEN 0 AND 100),
    
    -- Core Technical Stats (0-100)
    goalkeeping INT DEFAULT 10,
    defending INT DEFAULT 10,
    passing INT DEFAULT 10,
    scoring INT DEFAULT 10,
    
    -- Global Rating (Calculat / Ascuns partial)
    global_quality INT CHECK (global_quality BETWEEN 0 AND 100),
    
    -- Economics
    wage NUMERIC(10, 2) NOT NULL,
    contract_end DATE,
    value NUMERIC(12, 2) NOT NULL,
    
    is_injured BOOLEAN DEFAULT FALSE,
    injury_days_left INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0
);

-- 7. MATCHES (Fixtures & Results)
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    home_team_id INT REFERENCES teams(id),
    away_team_id INT REFERENCES teams(id),
    competition_id INT REFERENCES divisions(id), -- Sau separat pt Cupă
    match_type match_type NOT NULL,
    kickoff_time TIMESTAMP NOT NULL,
    
    -- Determinism Seed
    match_seed VARCHAR(64), -- SHA256 Hash
    
    -- Results
    is_played BOOLEAN DEFAULT FALSE,
    home_goals INT DEFAULT 0,
    away_goals INT DEFAULT 0,
    match_report JSONB -- Ticker-ul text minut cu minut salvat aici
);

-- 8. TRANSFERS (Transfer Market)
CREATE TABLE transfers (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    seller_team_id INT REFERENCES teams(id) ON DELETE SET NULL,
    buyer_team_id INT REFERENCES teams(id),
    starting_bid NUMERIC(12, 2) NOT NULL,
    current_bid NUMERIC(12, 2) DEFAULT 0,
    deadline TIMESTAMP NOT NULL,
    status transfer_status DEFAULT 'OPEN'
);
