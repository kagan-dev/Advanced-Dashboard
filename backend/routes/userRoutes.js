const express = require('express');
const router = express.Router();
const { protectRoute } = require('../middleware/protectRoute'); // Middleware'i import edin
const {
  getAllUsers,
  getUserById,
  getUserByUsername,
  getUserClaims,
  addUser,
  updateUserPassword,
  updateUser,
  deleteUser
} = require('../controllers/userController'); // Kontrolcü fonksiyonlarını import edin

// Tüm kullanıcıları almak için GET isteği (korumalı rota)
router.get('/getall', protectRoute, getAllUsers);

// Tek bir kullanıcıyı almak için GET isteği (ID ile, korumalı rota)
router.get('/get/:id', protectRoute, getUserById);

// Kullanıcı adını kullanarak kullanıcıyı almak için GET isteği (username ile, korumalı rota)
router.get('/getbyusername/:username', protectRoute, getUserByUsername);

// Kullanıcı taleplerini almak için POST isteği (korumalı rota)
router.post('/getuserclaims', protectRoute, getUserClaims);

// Yeni bir kullanıcı eklemek için POST isteği (korumalı rota)
router.post('/add', protectRoute, addUser);

// Kullanıcı şifresini güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/passupdate/:id', protectRoute, updateUserPassword);

// Kullanıcı bilgilerini güncellemek için PUT isteği (ID ile, korumalı rota)
router.put('/update/:id', protectRoute, updateUser);

// Bir kullanıcıyı silmek için DELETE isteği (ID ile, korumalı rota)
router.delete('/delete/:id', protectRoute, deleteUser);

module.exports = router;
