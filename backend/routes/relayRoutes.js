const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllRelays,
  getRelayById,
  addRelay,
  updateRelay,
  deleteRelay
} = require('../controllers/relayController'); // Kontrolcü fonksiyonlarını import edin

// Tüm relay'leri almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllRelays);

// Tek bir relay'i almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getRelayById);

// Yeni bir relay eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addRelay);

// Var olan bir relay'i güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateRelay);

// Bir relay'i silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteRelay);

module.exports = router;
