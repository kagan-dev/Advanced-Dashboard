const UserDevice = require('../models/UserDeviceModel'); // UserDevice modelini import edin

// Tüm UserDevice'leri almak için GET isteği
exports.getAllUserDevices = async (req, res) => {
  try {
    const userDevices = await UserDevice.find();
    res.status(200).json(userDevices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir UserDevice'i almak için GET isteği (ID ile)
exports.getUserDeviceById = async (req, res) => {
  try {
    const userDevice = await UserDevice.findById(req.params.id);
    if (!userDevice) return res.status(404).json({ message: 'UserDevice not found' });
    res.status(200).json(userDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir UserDevice eklemek için POST isteği
exports.addUserDevice = async (req, res) => {
  const { userId, deviceId, deviceTypeId, boxId } = req.body;
  try {
    const newUserDevice = new UserDevice({
      userId,
      deviceId,
      deviceTypeId,
      boxId
    });
    await newUserDevice.save();
    res.status(201).json(newUserDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir UserDevice'i güncellemek için PUT isteği
exports.updateUserDevice = async (req, res) => {
  try {
    const userDevice = await UserDevice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!userDevice) return res.status(404).json({ message: 'UserDevice not found' });
    res.status(200).json(userDevice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir UserDevice'i silmek için DELETE isteği
exports.deleteUserDevice = async (req, res) => {
  try {
    const userDevice = await UserDevice.findByIdAndDelete(req.params.id);
    if (!userDevice) return res.status(404).json({ message: 'UserDevice not found' });
    res.status(200).json({ message: 'UserDevice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
