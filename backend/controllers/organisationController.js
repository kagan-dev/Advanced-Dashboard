const Organisation = require('../models/OrganisationModel'); // Organisation modelini import edin

// Tüm organizasyonları almak için GET isteği
exports.getAllOrganisations = async (req, res) => {
  try {
    const organisations = await Organisation.find();
    res.status(200).json(organisations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir organizasyonu almak için GET isteği (ID ile)
exports.getOrganisationById = async (req, res) => {
  try {
    const organisation = await Organisation.findById(req.params.id);
    if (!organisation) return res.status(404).json({ message: 'Organisation not found' });
    res.status(200).json(organisation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir organizasyon eklemek için POST isteği
exports.addOrganisation = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newOrganisation = new Organisation({
      name,
      description
    });
    await newOrganisation.save();
    res.status(201).json(newOrganisation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir organizasyonu güncellemek için PUT isteği
exports.updateOrganisation = async (req, res) => {
  try {
    const organisation = await Organisation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!organisation) return res.status(404).json({ message: 'Organisation not found' });
    res.status(200).json(organisation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir organizasyonu silmek için DELETE isteği
exports.deleteOrganisation = async (req, res) => {
  try {
    const organisation = await Organisation.findByIdAndDelete(req.params.id);
    if (!organisation) return res.status(404).json({ message: 'Organisation not found' });
    res.status(200).json({ message: 'Organisation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
