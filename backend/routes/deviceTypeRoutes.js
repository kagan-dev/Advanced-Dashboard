const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllDeviceTypes,
  getDeviceTypeById,
  addDeviceType,
  updateDeviceType,
  deleteDeviceType
} = require('../controllers/deviceTypeController'); // Kontrolcü fonksiyonlarını import edin

// Tüm cihaz türlerini almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllDeviceTypes);

// Tek bir cihaz türünü almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getDeviceTypeById);

// Yeni bir cihaz türü eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addDeviceType);

// Var olan bir cihaz türünü güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateDeviceType);

// Bir cihaz türünü silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteDeviceType);

module.exports = router;
