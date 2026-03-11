const pool = require('../config/db');

// @desc    Fetch all products, optionally filter by categories
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, keyword } = req.query;

        let query = `
      SELECT p.*,
        STRING_AGG(DISTINCT pc.category_id::text, ',') as category_ids,
        STRING_AGG(DISTINCT c.name, ',') as category_names,
        s.name as subcategory_name
      FROM Products p
      LEFT JOIN Product_Categories pc ON p.id = pc.product_id
      LEFT JOIN Categories c ON pc.category_id = c.id
      LEFT JOIN Subcategories s ON p.subcategory_id = s.id
    `;
        let queryParams = [];

        const conditions = [];

        if (keyword) {
            conditions.push(`p.name ILIKE $${queryParams.length + 1}`);
            queryParams.push(`%${keyword}%`);
        }

        if (category) {
            // Find products that belong to this category ID
            query += ` INNER JOIN Product_Categories pc_filter ON p.id = pc_filter.product_id `;
            conditions.push(`pc_filter.category_id = $${queryParams.length + 1}`);
            queryParams.push(category);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' GROUP BY p.id, s.name ORDER BY p.created_at DESC';

        const { rows: products } = await pool.query(query, queryParams);

        // Format products
        const formattedProducts = products.map(p => {
            let parsedImages = [];
            if (p.image_url) {
                try { parsedImages = JSON.parse(p.image_url); }
                catch (e) { parsedImages = [p.image_url]; }
            }
            return {
                ...p,
                image_urls: parsedImages,
                category_ids: p.category_ids ? p.category_ids.split(',').map(Number) : [],
                sizes: p.sizes || null,
                is_sale: Boolean(p.is_sale)
            };
        });

        res.json(formattedProducts);
    } catch (error) {
        console.error("GET Products Error:", error.message);
        res.status(500).json({ message: error.message || String(error) });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*,
        STRING_AGG(DISTINCT pc.category_id::text, ',') as category_ids,
        STRING_AGG(DISTINCT c.name, ',') as category_names,
        s.name as subcategory_name
      FROM Products p
      LEFT JOIN Product_Categories pc ON p.id = pc.product_id
      LEFT JOIN Categories c ON pc.category_id = c.id
      LEFT JOIN Subcategories s ON p.subcategory_id = s.id
      WHERE p.id = $1 GROUP BY p.id, s.name`,
            [req.params.id]
        );

        const products = result.rows;

        if (products.length > 0) {
            const p = products[0];
            let parsedImages = [];
            if (p.image_url) {
                try { parsedImages = JSON.parse(p.image_url); }
                catch (e) { parsedImages = [p.image_url]; }
            }
            res.json({
                ...p,
                image_urls: parsedImages,
                category_ids: p.category_ids ? p.category_ids.split(',').map(Number) : [],
                sizes: p.sizes || null,
                is_sale: Boolean(p.is_sale)
            });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        discounted_price,
        stock,
        is_sale,
        sale_message,
        delivery_charges,
        subcategory_id,
        sizes,
        categories // Array of category IDs
    } = req.body;

    let image_url = null;
    if (req.files && req.files.length > 0) {
        const paths = req.files.map(file => file.path);
        image_url = JSON.stringify(paths);
    }

    const client = await pool.getConnection();

    try {
        await client.query('BEGIN');

        const { rows: result } = await client.query(
            `INSERT INTO Products (
        name, description, price, discounted_price, stock, 
        is_sale, sale_message, delivery_charges, image_url, subcategory_id, sizes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [
                name,
                description,
                price,
                discounted_price || null,
                stock || 0,
                is_sale === 'true' || is_sale === true ? 1 : 0,
                sale_message || null,
                delivery_charges || 0,
                image_url,
                subcategory_id || null,
                sizes ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes)) : null
            ]
        );

        const productId = result[0].id;

        // Handle multiple categories
        if (categories) {
            let categoryArray = [];
            try {
                categoryArray = typeof categories === 'string' ? JSON.parse(categories) : categories;
            } catch (e) {
                if (typeof categories === 'string' && categories.includes(',')) {
                    categoryArray = categories.split(',');
                } else {
                    categoryArray = [categories];
                }
            }

            if (Array.isArray(categoryArray) && categoryArray.length > 0) {
                for (const catId of categoryArray) {
                    await client.query('INSERT INTO Product_Categories (product_id, category_id) VALUES ($1, $2)', [productId, catId]);
                }
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Product created', productId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Create Product Error:", error.message);
        res.status(500).json({ message: error.message || String(error) });
    } finally {
        client.release();
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        description,
        price,
        discounted_price,
        stock,
        is_sale,
        sale_message,
        delivery_charges,
        subcategory_id,
        sizes,
        categories // Array of category IDs
    } = req.body;

    const productId = req.params.id;
    const client = await pool.getConnection();

    try {
        await client.query('BEGIN');

        let query = `
      UPDATE Products SET 
      name = $1, description = $2, price = $3, discounted_price = $4, 
      stock = $5, is_sale = $6, sale_message = $7, delivery_charges = $8, 
      subcategory_id = $9, sizes = $10
    `;
        let queryParams = [
            name, description, price, discounted_price || null, stock,
            is_sale === 'true' || is_sale === true ? true : false, sale_message || null, delivery_charges || 0,
            subcategory_id || null, sizes ? (typeof sizes === 'string' ? sizes : JSON.stringify(sizes)) : null
        ];

        if (req.files && req.files.length > 0) {
            const paths = req.files.map(file => file.path);
            query += `, image_url = $${queryParams.length + 1} `;
            queryParams.push(JSON.stringify(paths));
        }

        query += ` WHERE id = $${queryParams.length + 1}`;
        queryParams.push(productId);

        await client.query(query, queryParams);

        // Update product categories
        if (categories !== undefined) {
            // First delete existing categories for this product
            await client.query('DELETE FROM Product_Categories WHERE product_id = $1', [productId]);

            let categoryArray = [];
            try {
                categoryArray = typeof categories === 'string' ? JSON.parse(categories) : categories;
            } catch (e) {
                if (typeof categories === 'string' && categories.includes(',')) {
                    categoryArray = categories.split(',');
                } else {
                    categoryArray = [categories];
                }
            }

            if (Array.isArray(categoryArray) && categoryArray.length > 0) {
                for (const catId of categoryArray) {
                    await client.query('INSERT INTO Product_Categories (product_id, category_id) VALUES ($1, $2)', [productId, catId]);
                }
            }
        }

        await client.query('COMMIT');
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Update Product Error:", error.message);
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM Products WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
