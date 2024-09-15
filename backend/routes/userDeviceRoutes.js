const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllUserDevices,
  getUserDeviceById,
  addUserDevice,
  updateUserDevice,
  deleteUserDevice
} = require('../controllers/userDeviceController'); // Kontrolcü fonksiyonlarını import edin

// Tüm UserDevice'leri almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllUserDevices);

// Tek bir UserDevice'i almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getUserDeviceById);

// Yeni bir UserDevice eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addUserDevice);

// Var olan bir UserDevice'i güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateUserDevice);

// Bir UserDevice'i silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteUserDevice);

module.exports = router;
