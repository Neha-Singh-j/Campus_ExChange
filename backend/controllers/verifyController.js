const {
  findUserById,
  updateStudentProfile,
  rollNoTaken,
  publicUser
} = require('../utils/dataStore');
const { parseStudentProfile } = require('../utils/studentProfile');

// Admins are not students: they have no student profile and no verification page.
const rejectAdmin = (req, res) => {
  if (req.user.role === 'admin') {
    res.status(403).json({ success: false, message: 'Administrators are not students and have no student profile' });
    return true;
  }
  return false;
};

// GET /api/verify/profile  -> the logged-in student's own details and verification status
exports.getVerificationProfile = async (req, res, next) => {
  try {
    if (rejectAdmin(req, res)) return;
    const user = publicUser(await findUserById(req.user.id));
    res.status(200).json({
      success: true,
      data: { name: user.name, email: user.email, ...(user.studentProfile || {}) }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/verify/request  -> update the student's details (and optionally the ID photo).
// Any change puts the account back to PENDING until an admin reviews it.
exports.submitVerification = async (req, res, next) => {
  try {
    if (rejectAdmin(req, res)) return;
    const parsed = parseStudentProfile(req.body, { requireIdProof: false });
    if (parsed.error) {
      return res.status(400).json({ success: false, message: parsed.error });
    }
    if (await rollNoTaken(parsed.profile.universityName, parsed.profile.rollNo, req.user.id)) {
      return res
        .status(409)
        .json({ success: false, message: 'That roll number is already registered at this university' });
    }
    const updated = await updateStudentProfile(req.user.id, parsed.profile, parsed.idProofImage);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    const user = publicUser(updated);
    res.status(200).json({
      success: true,
      message: 'Details saved. An administrator will review your student ID.',
      data: { name: user.name, email: user.email, ...user.studentProfile }
    });
  } catch (error) {
    next(error);
  }
};
