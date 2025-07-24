const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// GET /api/categories - получить все категории
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - получить категорию по ID
router.get('/:id', categoryController.getCategoryById);

// POST /api/categories - создать новую категорию
router.post('/', categoryController.createCategory);

// PUT /api/categories/:id - обновить категорию
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id - удалить категорию
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;