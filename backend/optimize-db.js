const pool = require('./config/db');

const optimize = async () => {
    console.log('Starting Database Optimization (Indexing)...');
    try {
        // 1. Create index for subcategory_id in Products
        console.log('Creating index for subcategory_id in Products...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_products_subcategory ON Products(subcategory_id);');

        // 2. Create index for category_id in Product_Categories
        console.log('Creating index for category_id in Product_Categories...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_product_categories_cat ON Product_Categories(category_id);');

        // 3. Create index for product_id in OrderItems
        console.log('Creating index for product_id in OrderItems...');
        await pool.query('CREATE INDEX IF NOT EXISTS idx_order_items_product ON OrderItems(product_id);');

        console.log('🎉 Database Indexes successfully created!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating indexes:', error.message);
        process.exit(1);
    }
};

optimize();
