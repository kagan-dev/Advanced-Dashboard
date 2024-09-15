const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllOrganisations,
  getOrganisationById,
  addOrganisation,
  updateOrganisation,
  deleteOrganisation
} = require('../controllers/organisationController'); // Kontrolcü fonksiyonlarını import edin

// Tüm organizasyonları almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllOrganisations);

// Tek bir organizasyonu almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getOrganisationById);

// Yeni bir organizasyon eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addOrganisation);

// Var olan bir organizasyonu güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateOrganisation);

// Bir organizasyonu silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteOrganisation);

module.exports = router;
