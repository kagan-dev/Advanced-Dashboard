const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllUserOrganisations,
  getUserOrganisationById,
  addUserOrganisation,
  updateUserOrganisation,
  deleteUserOrganisation
} = require('../controllers/userOrganisationController'); // Kontrolcü fonksiyonlarını import edin

// Tüm UserOrganisation'ları almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllUserOrganisations);

// Tek bir UserOrganisation'ı almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getUserOrganisationById);

// Yeni bir UserOrganisation eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addUserOrganisation);

// Var olan bir UserOrganisation'ı güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateUserOrganisation);

// Bir UserOrganisation'ı silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteUserOrganisation);

module.exports = router;
