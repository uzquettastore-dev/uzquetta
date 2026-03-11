const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Render uses DATABASE_URL for PostgreSQL, but we'll fall back to individual env vars for local testing
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false // Enable SSL for Render
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    getConnection: () => pool.connect(),
    pool
};
