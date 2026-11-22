// Validation for the student details collected at signup (and editable later on
// the Student Verification page). Admins are not students and have no profile.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const YEARS = [
  '1st Year / Freshman',
  '2nd Year / Sophomore',
  '3rd Year / Junior',
  'Final Year / Senior',
  "Postgraduate / Master's",
  'Ph.D. Scholar',
  'Faculty / Staff'
];

// ID photo arrives as a data URL (the browser shrinks it first). Cap the size anyway.
const MAX_ID_IMAGE_CHARS = 2_500_000;
const ID_IMAGE_RE = /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=]+$/;

const clean = (v, max = 120) => String(v ?? '').trim().slice(0, max);

/**
 * @param {object} body       request body
 * @param {object} opts
 * @param {boolean} opts.requireIdProof  true at signup; false when updating (keeps the existing photo)
 * @returns {{ error?: string, profile?: object, idProofImage?: string }}
 */
const parseStudentProfile = (body = {}, { requireIdProof = true } = {}) => {
  const universityName = clean(body.universityName);
  const rollNo = clean(body.rollNo, 40);
  const universityEmail = clean(body.universityEmail, 120).toLowerCase();
  const personalEmail = clean(body.personalEmail, 120).toLowerCase();
  const department = clean(body.department);
  const phone = clean(body.phone, 30);
  const yearOfStudy = YEARS.includes(body.yearOfStudy) ? body.yearOfStudy : '';

  if (!universityName) return { error: 'University / college name is required' };
  if (!rollNo) return { error: 'University roll number / student ID is required' };
  if (!universityEmail || !EMAIL_RE.test(universityEmail)) {
    return { error: 'A valid university email is required' };
  }
  if (personalEmail && !EMAIL_RE.test(personalEmail)) {
    return { error: 'Personal email is not a valid email address' };
  }
  if (phone && !/^[0-9+()\-.\s]{6,30}$/.test(phone)) {
    return { error: 'Phone number can only contain digits, spaces and + ( ) - .' };
  }

  let idProofImage;
  const rawImage = body.idProofImage;
  if (rawImage) {
    if (typeof rawImage !== 'string' || rawImage.length > MAX_ID_IMAGE_CHARS || !ID_IMAGE_RE.test(rawImage)) {
      return { error: 'Student ID photo must be a PNG, JPG or WebP image under about 1.5 MB' };
    }
    idProofImage = rawImage;
  } else if (requireIdProof) {
    return { error: 'Please upload a photo of your student ID card as proof of enrollment' };
  }

  return {
    profile: {
      universityName,
      rollNo,
      universityEmail,
      personalEmail,
      department,
      phone,
      yearOfStudy,
      idProofName: clean(body.idProofName, 120) || 'student-id'
    },
    idProofImage
  };
};

module.exports = { parseStudentProfile, YEARS };
