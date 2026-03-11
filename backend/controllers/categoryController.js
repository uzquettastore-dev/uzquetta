const pool = require('../config/db');

// @desc    Fetch all categories with their subcategories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const { rows: categories } = await pool.query('SELECT * FROM Categories ORDER BY name ASC');
        const { rows: subcategories } = await pool.query('SELECT * FROM Subcategories ORDER BY name ASC');

        // Attach subcategories to categories
        const categoriesWithSubs = categories.map(cat => ({
            ...cat,
            subcategories: subcategories.filter(sub => sub.category_id === cat.id)
        }));

        res.json(categoriesWithSubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const { rows: result } = await pool.query(
            'INSERT INTO Categories (name, description) VALUES ($1, $2) RETURNING id',
            [name, description]
        );
        res.status(201).json({ id: result[0].id, name, description });
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL duplicate key error code
            res.status(400).json({ message: 'Category already exists' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    const { name, description } = req.body;

    try {
        const result = await pool.query(
            'UPDATE Categories SET name = $1, description = $2 WHERE id = $3',
            [name, description, req.params.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ id: req.params.id, name, description });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM Categories WHERE id = $1', [req.params.id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get subcategories for a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
const getSubcategories = async (req, res) => {
    try {
        const { rows: subcategories } = await pool.query('SELECT * FROM Subcategories WHERE category_id = $1 ORDER BY name ASC', [req.params.id]);
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a subcategory
// @route   POST /api/categories/:id/subcategories
// @access  Private/Admin
const createSubcategory = async (req, res) => {
    const { name } = req.body;

    try {
        const { rows: result } = await pool.query(
            'INSERT INTO Subcategories (category_id, name) VALUES ($1, $2) RETURNING id',
            [req.params.id, name]
        );
        res.status(201).json({ id: result[0].id, category_id: req.params.id, name });
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ message: 'Subcategory already exists in this category' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

// @desc    Delete a subcategory
// @route   DELETE /api/categories/subcategories/:subId
// @access  Private/Admin
const deleteSubcategory = async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM Subcategories WHERE id = $1', [req.params.subId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        res.json({ message: 'Subcategory removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategories,
    createSubcategory,
    deleteSubcategory
};
