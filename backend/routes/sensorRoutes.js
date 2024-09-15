const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllSensors,
  getSensorById,
  addSensor,
  updateSensor,
  deleteSensor
} = require('../controllers/sensorController'); // Kontrolcü fonksiyonlarını import edin

// Tüm sensörleri almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllSensors);

// Tek bir sensörü almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getSensorById);

// Yeni bir sensör eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addSensor);

// Var olan bir sensörü güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateSensor);

// Bir sensörü silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteSensor);

module.exports = router;
