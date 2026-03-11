const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

const initDB = async () => {
    try {
        const sqlPath = path.join(__dirname, 'database', 'schema.pg.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Initializing database schema...');
        // Split SQL by semicolon if necessary, but pg's pool.query 
        // usually handles multiple statements in one call.
        await pool.query(sql);
        console.log('Database schema initialized successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
};

initDB();
