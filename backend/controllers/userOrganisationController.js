const UserOrganisation = require('../models/UserOrganisationModel'); // UserOrganisation modelini import edin

// Tüm UserOrganisation'ları almak için GET isteği
exports.getAllUserOrganisations = async (req, res) => {
  try {
    const organisations = await UserOrganisation.find();
    res.status(200).json(organisations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir UserOrganisation'ı almak için GET isteği (ID ile)
exports.getUserOrganisationById = async (req, res) => {
  try {
    const organisation = await UserOrganisation.findById(req.params.id);
    if (!organisation) return res.status(404).json({ message: 'UserOrganisation not found' });
    res.status(200).json(organisation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir UserOrganisation eklemek için POST isteği
exports.addUserOrganisation = async (req, res) => {
  const { userId, organisationId } = req.body;
  try {
    const newOrganisation = new UserOrganisation({
      userId,
      organisationId
    });
    await newOrganisation.save();
    res.status(201).json(newOrganisation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir UserOrganisation'ı güncellemek için PUT isteği
exports.updateUserOrganisation = async (req, res) => {
  try {
    const organisation = await UserOrganisation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!organisation) return res.status(404).json({ message: 'UserOrganisation not found' });
    res.status(200).json(organisation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir UserOrganisation'ı silmek için DELETE isteği
exports.deleteUserOrganisation = async (req, res) => {
  try {
    const organisation = await UserOrganisation.findByIdAndDelete(req.params.id);
    if (!organisation) return res.status(404).json({ message: 'UserOrganisation not found' });
    res.status(200).json({ message: 'UserOrganisation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
