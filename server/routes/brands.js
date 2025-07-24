const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');

// GET /api/brands - получить все бренды
router.get('/', brandController.getAllBrands);

// GET /api/brands/:id - получить бренд по ID
router.get('/:id', brandController.getBrandById);

// POST /api/brands - создать новый бренд
router.post('/', brandController.createBrand);

// PUT /api/brands/:id - обновить бренд
router.put('/:id', brandController.updateBrand);

// DELETE /api/brands/:id - удалить бренд
router.delete('/:id', brandController.deleteBrand);

module.exports = router;