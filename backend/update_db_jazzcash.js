const pool = require('./config/db');

const updateDb = async () => {
    try {
        console.log('Attempting to update Payments table constraint...');
        
        // 1. Drop existing constraint if it exists (standard pg library doesn't like duplicate names or specific error messages)
        await pool.query("ALTER TABLE Payments DROP CONSTRAINT IF EXISTS payments_method_check");
        
        // 2. Add new constraint including JazzCash
        await pool.query("ALTER TABLE Payments ADD CONSTRAINT payments_method_check CHECK (method IN ('EasyPaisa', 'JazzCash', 'Bank Transfer', 'COD'))");
        
        console.log('Database constraint updated successfully with JazzCash!');
        process.exit(0);
    } catch (err) {
        console.error('Error updating database:', err.message);
        process.exit(1);
    }
};

updateDb();
