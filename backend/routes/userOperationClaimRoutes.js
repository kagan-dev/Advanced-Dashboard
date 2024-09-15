const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllUserOperationClaims,
  getUserOperationClaimById,
  addUserOperationClaim,
  updateUserOperationClaim,
  deleteUserOperationClaim
} = require('../controllers/userOperationClaimController'); // Kontrolcü fonksiyonlarını import edin

// Tüm UserOperationClaim'leri almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllUserOperationClaims);

// Tek bir UserOperationClaim'i almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getUserOperationClaimById);

// Yeni bir UserOperationClaim eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addUserOperationClaim);

// Var olan bir UserOperationClaim'i güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateUserOperationClaim);

// Bir UserOperationClaim'i silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteUserOperationClaim);

module.exports = router;
