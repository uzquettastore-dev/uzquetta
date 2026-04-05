const pool = require('./config/db');

const checkDb = async () => {
    try {
        const res = await pool.query("SELECT * FROM information_schema.check_constraints WHERE constraint_name LIKE '%method%'");
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDb();
