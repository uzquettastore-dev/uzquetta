const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategories,
    createSubcategory,
    deleteSubcategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

router.route('/:id')
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

router.route('/:id/subcategories')
    .get(getSubcategories)
    .post(protect, admin, createSubcategory);

router.route('/subcategories/:subId')
    .delete(protect, admin, deleteSubcategory);

module.exports = router;
