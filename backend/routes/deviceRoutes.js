const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getDevicesByUserId,
  getBoxWithDevicesByChipId,
  getDeviceTypes,
  getControlDevicesByUserIdAndMenuId,
  getSensorDevicesByUserId
} = require('../controllers/deviceController'); // Kontrolcü fonksiyonlarını import edin

// Belirli bir kullanıcı ID'sine göre cihazları almak için GET isteği (korumalı rota)
router.get('/getdevicesbyuserId/:userId', protectRoute, getDevicesByUserId);

// Belirli bir chipId'ye göre kutu ve cihazları almak için GET isteği (korumalı rota)
router.get('/getboxwithdevicesbychipid/:chipId', protectRoute, getBoxWithDevicesByChipId);

// Cihaz türlerini almak için GET isteği (korumalı rota)
router.get('/getdevicetypes', protectRoute, getDeviceTypes);

// Kullanıcı ID'si ve menü ID'sine göre kontrol cihazlarını almak için GET isteği (korumalı rota)
router.get('/getcontroldevicesbyuseridandmenuid/:userId/:menuId', protectRoute, getControlDevicesByUserIdAndMenuId);

// Belirli bir kullanıcı ID'sine göre sensor cihazlarını almak için GET isteği (korumalı rota)
router.get('/getsensordevicesbyuserid/:userId', protectRoute, getSensorDevicesByUserId);

module.exports = router;
