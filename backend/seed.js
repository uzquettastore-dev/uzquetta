const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME}`,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

const seedData = async () => {
    const client = await pool.connect();
    try {
        console.log('Seeding dummy data...');

        // 1. Create categories
        await client.query(`INSERT INTO Categories (name, description) VALUES 
            ('Accessories', 'Bags and more'), 
            ('Women', 'Womens clothing'), 
            ('Kids', 'Kids clothing') 
            ON CONFLICT (name) DO NOTHING`);
        
        // Fetch category IDs
        const { rows: categories } = await client.query('SELECT id, name FROM Categories');
        const catMap = {};
        categories.forEach(c => catMap[c.name] = c.id);

        // 2. Insert Products
        const products = [
            {
                name: 'BLACK SHOULDER BAG',
                description: 'A stylish and spacious black shoulder bag perfect for everyday use.',
                price: 7490,
                discounted_price: 7490,
                stock: 50,
                is_sale: false,
                sale_message: 'NEW IN',
                image_url: JSON.stringify([
                    'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=600&auto=format&fit=crop',
                ]),
                category: 'Accessories'
            },
            {
                name: 'DENIM DRESS',
                description: 'Casual and comfortable mid-length denim dress.',
                price: 12500,
                discounted_price: 11000,
                stock: 30,
                is_sale: true,
                sale_message: 'SALE',
                image_url: JSON.stringify([
                    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop'
                ]),
                category: 'Women'
            },
            {
                name: 'BLACK CROSS BODY BAG',
                description: 'Compact black cross body bag for essential items.',
                price: 7490,
                discounted_price: null,
                stock: 20,
                is_sale: false,
                sale_message: 'NEW IN',
                image_url: JSON.stringify([
                    'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=600&auto=format&fit=crop'
                ]),
                category: 'Accessories'
            },
            {
                name: 'BROWN TOTE BAG',
                description: 'Large brown leather tote bag with plenty of space.',
                price: 10490,
                discounted_price: null,
                stock: 15,
                is_sale: false,
                sale_message: 'NEW IN',
                image_url: JSON.stringify([
                    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop'
                ]),
                category: 'Accessories'
            },
             {
                name: 'PINK TEXTURED COTTON SUIT',
                description: 'Pink Textured Chambray Cotton Kurta With Laces. Bottom: Pink Textured Chambray Cotton Trouser With Laces.',
                price: 3500,
                discounted_price: 3500,
                stock: 10,
                is_sale: false,
                sale_message: 'NEW IN',
                image_url: JSON.stringify([
                    'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1621450146014-9b2f05a181b5?q=80&w=600&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1596755094514-f87e32f85ce9?q=80&w=600&auto=format&fit=crop'
                ]),
                category: 'Kids'
            }
        ];

        for (const p of products) {
            const { rows: res } = await client.query(
                `INSERT INTO Products (name, description, price, discounted_price, stock, is_sale, sale_message, image_url) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [p.name, p.description, p.price, p.discounted_price, p.stock, p.is_sale, p.sale_message, p.image_url]
            );
            
            const productId = res[0].id;
            const categoryId = catMap[p.category];

            if (categoryId) {
                 await client.query('INSERT INTO Product_Categories (product_id, category_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [productId, categoryId]);
            }
        }

        console.log('Dummy data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    } finally {
        client.release();
    }
};

seedData();
