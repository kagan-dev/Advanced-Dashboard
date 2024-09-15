  const express = require('express');
  const router = express.Router();
  const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
  const {
    getAllBoxes,
    getBoxById,
    addBox,
    updateBox,
    deleteBox
  } = require('../controllers/boxController'); // Kontrolcü fonksiyonlarını import edin

  // Tüm kutuları almak için GET isteği (korumalı rota)
  router.get('/getall', protectRoute, getAllBoxes);

  // Tek bir kutuyu almak için GET isteği (ID ile, korumalı rota)
  router.get('/get/:id', protectRoute, getBoxById);

  // Yeni bir kutu eklemek için POST isteği (korumalı rota)
  router.post('/add', protectRoute, addBox);

  // Var olan bir kutuyu güncellemek için PUT isteği (ID ile, korumalı rota)
  router.put('/update/:id', protectRoute, updateBox);

  // Bir kutuyu silmek için DELETE isteği (ID ile, korumalı rota)
  router.delete('/delete/:id', protectRoute, deleteBox);

  module.exports = router;
