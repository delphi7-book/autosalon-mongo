const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

// GET /api/cars - получить все автомобили
router.get('/', carController.getAllCars);

// GET /api/cars/popular - получить популярные автомобили
router.get('/popular', carController.getPopularCars);

// GET /api/cars/:id - получить автомобиль по ID
router.get('/:id', carController.getCarById);

// GET /api/cars/:id/similar - получить похожие автомобили
router.get('/:id/similar', carController.getSimilarCars);

// POST /api/cars - создать новый автомобиль
router.post('/', carController.createCar);

// PUT /api/cars/:id - обновить автомобиль
router.put('/:id', carController.updateCar);

// DELETE /api/cars/:id - удалить автомобиль
router.delete('/:id', carController.deleteCar);

module.exports = router;