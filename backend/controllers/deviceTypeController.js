const DeviceType = require('../models/DeviceTypeModel'); // DeviceType modelini import edin

// Tüm cihaz türlerini almak için GET isteği
exports.getAllDeviceTypes = async (req, res) => {
  try {
    const deviceTypes = await DeviceType.find();
    res.status(200).json(deviceTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir cihaz türünü almak için GET isteği (ID ile)
exports.getDeviceTypeById = async (req, res) => {
  try {
    const deviceType = await DeviceType.findById(req.params.id);
    if (!deviceType) return res.status(404).json({ message: 'Device type not found' });
    res.status(200).json(deviceType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir cihaz türü eklemek için POST isteği
exports.addDeviceType = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newDeviceType = new DeviceType({
      name,
      description
    });
    await newDeviceType.save();
    res.status(201).json(newDeviceType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir cihaz türünü güncellemek için PUT isteği
exports.updateDeviceType = async (req, res) => {
  try {
    const deviceType = await DeviceType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!deviceType) return res.status(404).json({ message: 'Device type not found' });
    res.status(200).json(deviceType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir cihaz türünü silmek için DELETE isteği
exports.deleteDeviceType = async (req, res) => {
  try {
    const deviceType = await DeviceType.findByIdAndDelete(req.params.id);
    if (!deviceType) return res.status(404).json({ message: 'Device type not found' });
    res.status(200).json({ message: 'Device type deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
