const Device = require('../models/DeviceModel'); // Device modelini import edin
const Box = require('../models/BoxModel'); // Box modelini import edin

// Belirli bir kullanıcı ID'sine göre cihazları almak için GET isteği
exports.getDevicesByUserId = async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.params.userId });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir chipId'ye göre kutu ve cihazları almak için GET isteği
exports.getBoxWithDevicesByChipId = async (req, res) => {
  try {
    const box = await Box.findOne({ chipId: req.params.chipId }).populate('devices');
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json(box);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cihaz türlerini almak için GET isteği
exports.getDeviceTypes = async (req, res) => {
  try {
    const deviceTypes = await Device.distinct('type');
    res.status(200).json(deviceTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı ID'si ve menü ID'sine göre kontrol cihazlarını almak için GET isteği
exports.getControlDevicesByUserIdAndMenuId = async (req, res) => {
  try {
    const { userId, menuId } = req.params;
    const controlDevices = await Device.find({ userId, menuId, type: 'control' });
    res.status(200).json(controlDevices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir kullanıcı ID'sine göre sensor cihazlarını almak için GET isteği
exports.getSensorDevicesByUserId = async (req, res) => {
  try {
    const sensorDevices = await Device.find({ userId: req.params.userId, type: 'sensor' });
    res.status(200).json(sensorDevices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
