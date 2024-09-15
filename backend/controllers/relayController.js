const Relay = require('../models/RelayModel'); // Relay modelini import edin

// Tüm relay'leri almak için GET isteği
exports.getAllRelays = async (req, res) => {
  try {
    const relays = await Relay.find();
    res.status(200).json(relays);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir relay'i almak için GET isteği (ID ile)
exports.getRelayById = async (req, res) => {
  try {
    const relay = await Relay.findById(req.params.id);
    if (!relay) return res.status(404).json({ message: 'Relay not found' });
    res.status(200).json(relay);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir relay eklemek için POST isteği
exports.addRelay = async (req, res) => {
  const { name, type, status } = req.body;
  try {
    const newRelay = new Relay({
      name,
      type,
      status
    });
    await newRelay.save();
    res.status(201).json(newRelay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir relay'i güncellemek için PUT isteği
exports.updateRelay = async (req, res) => {
  try {
    const relay = await Relay.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!relay) return res.status(404).json({ message: 'Relay not found' });
    res.status(200).json(relay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir relay'i silmek için DELETE isteği
exports.deleteRelay = async (req, res) => {
  try {
    const relay = await Relay.findByIdAndDelete(req.params.id);
    if (!relay) return res.status(404).json({ message: 'Relay not found' });
    res.status(200).json({ message: 'Relay deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
