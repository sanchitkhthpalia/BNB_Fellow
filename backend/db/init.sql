-- MGNREGA Dashboard Database Schema

-- States table
CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Districts table
CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    state_id INTEGER REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_id, code)
);

-- MGNREGA snapshots table
CREATE TABLE IF NOT EXISTS mgnrega_snapshots (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    workdays BIGINT DEFAULT 0,
    wages_paid DECIMAL(15, 2) DEFAULT 0,
    people_benefited INTEGER DEFAULT 0,
    funds_disbursed DECIMAL(15, 2) DEFAULT 0,
    payment_delay_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(district_id, year, month)
);

-- Indexes for performance
CREATE INDEX idx_district_state ON districts(state_id);
CREATE INDEX idx_snapshot_district ON mgnrega_snapshots(district_id);
CREATE INDEX idx_snapshot_year_month ON mgnrega_snapshots(year, month);
CREATE INDEX idx_snapshot_created ON mgnrega_snapshots(created_at DESC);

-- Polling status table
CREATE TABLE IF NOT EXISTS polling_status (
    id SERIAL PRIMARY KEY,
    last_successful_poll TIMESTAMP,
    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consecutive_failures INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT
);

-- Sample seed data for testing
INSERT INTO states (name, code) VALUES
    ('Maharashtra', 'MH'),
    ('Uttar Pradesh', 'UP'),
    ('Madhya Pradesh', 'MP')
ON CONFLICT (code) DO NOTHING;

-- Districts for Maharashtra
INSERT INTO districts (state_id, name, code, latitude, longitude)
SELECT s.id, 'Pune', 'MH-12', 18.5204, 73.8567
FROM states s WHERE s.code = 'MH'
ON CONFLICT (state_id, code) DO NOTHING;

INSERT INTO districts (state_id, name, code, latitude, longitude)
SELECT s.id, 'Nagpur', 'MH-09', 21.1458, 79.0882
FROM states s WHERE s.code = 'MH'
ON CONFLICT (state_id, code) DO NOTHING;

-- Sample snapshots for the last 3 months (Pune district)
INSERT INTO mgnrega_snapshots (district_id, year, month, workdays, wages_paid, people_benefited, funds_disbursed, payment_delay_days)
SELECT d.id, 
       2024, 8, 
       45000, 95000000.00, 1200, 100000000.00, 15
FROM districts d WHERE d.code = 'MH-12'
ON CONFLICT (district_id, year, month) DO NOTHING;

INSERT INTO mgnrega_snapshots (district_id, year, month, workdays, wages_paid, people_benefited, funds_disbursed, payment_delay_days)
SELECT d.id, 
       2024, 9, 
       52000, 110000000.00, 1400, 115000000.00, 12
FROM districts d WHERE d.code = 'MH-12'
ON CONFLICT (district_id, year, month) DO NOTHING;

INSERT INTO mgnrega_snapshots (district_id, year, month, workdays, wages_paid, people_benefited, funds_disbursed, payment_delay_days)
SELECT d.id, 
       2024, 10, 
       48000, 105000000.00, 1300, 110000000.00, 18
FROM districts d WHERE d.code = 'MH-12'
ON CONFLICT (district_id, year, month) DO NOTHING;

-- Initialize polling status
INSERT INTO polling_status (last_successful_poll, status) 
VALUES (CURRENT_TIMESTAMP, 'active')
ON CONFLICT (id) DO NOTHING;
