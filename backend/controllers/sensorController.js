const Sensor = require('../models/SensorModel'); // Sensor modelini import edin

// Tüm sensörleri almak için GET isteği
exports.getAllSensors = async (req, res) => {
  try {
    const sensors = await Sensor.find();
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir sensörü almak için GET isteği (ID ile)
exports.getSensorById = async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir sensör eklemek için POST isteği
exports.addSensor = async (req, res) => {
  const { name, type, status } = req.body;
  try {
    const newSensor = new Sensor({
      name,
      type,
      status
    });
    await newSensor.save();
    res.status(201).json(newSensor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir sensörü güncellemek için PUT isteği
exports.updateSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.status(200).json(sensor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir sensörü silmek için DELETE isteği
exports.deleteSensor = async (req, res) => {
  try {
    const sensor = await Sensor.findByIdAndDelete(req.params.id);
    if (!sensor) return res.status(404).json({ message: 'Sensor not found' });
    res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
