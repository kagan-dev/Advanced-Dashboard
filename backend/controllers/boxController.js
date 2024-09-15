const Box = require('../models/BoxModel'); // Box modelini import edin

// Tüm kutuları almak için GET isteği
exports.getAllBoxes = async (req, res) => {
  try {
    const boxes = await Box.find();
    res.status(200).json(boxes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir kutuyu almak için GET isteği (ID ile)
exports.getBoxById = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id);
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json(box);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir kutu eklemek için POST isteği
exports.addBox = async (req, res) => {
  const { name, chipId, organisationId, active, topicRec, topicRes, version } = req.body;
  try {
    const newBox = new Box({
      name,
      chipId,
      organisationId,
      active,
      topicRec,
      topicRes,
      version
    });
    await newBox.save();
    res.status(201).json(newBox);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir kutuyu güncellemek için PUT isteği
exports.updateBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json(box);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir kutuyu silmek için DELETE isteği
exports.deleteBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndDelete(req.params.id);
    if (!box) return res.status(404).json({ message: 'Box not found' });
    res.status(200).json({ message: 'Box deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
