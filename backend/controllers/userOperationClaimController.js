const UserOperationClaim = require('../models/UserOperationClaimModel'); // UserOperationClaim modelini import edin

// Tüm UserOperationClaim'leri almak için GET isteği
exports.getAllUserOperationClaims = async (req, res) => {
  try {
    const claims = await UserOperationClaim.find();
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tek bir UserOperationClaim'i almak için GET isteği (ID ile)
exports.getUserOperationClaimById = async (req, res) => {
  try {
    const claim = await UserOperationClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'UserOperationClaim not found' });
    res.status(200).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bir UserOperationClaim eklemek için POST isteği
exports.addUserOperationClaim = async (req, res) => {
  const { userId, operationClaimId } = req.body;
  try {
    const newClaim = new UserOperationClaim({
      userId,
      operationClaimId
    });
    await newClaim.save();
    res.status(201).json(newClaim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Var olan bir UserOperationClaim'i güncellemek için PUT isteği
exports.updateUserOperationClaim = async (req, res) => {
  try {
    const claim = await UserOperationClaim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!claim) return res.status(404).json({ message: 'UserOperationClaim not found' });
    res.status(200).json(claim);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bir UserOperationClaim'i silmek için DELETE isteği
exports.deleteUserOperationClaim = async (req, res) => {
  try {
    const claim = await UserOperationClaim.findByIdAndDelete(req.params.id);
    if (!claim) return res.status(404).json({ message: 'UserOperationClaim not found' });
    res.status(200).json({ message: 'UserOperationClaim deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
