// Small data-access layer for users and orders that works with both
// MongoDB and the in-memory fallback, so controllers stay simple.
const { getIsConnected } = require('../config/db');
const memoryStore = require('./memoryStore');

const toPlain = (doc) => {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  obj._id = String(obj._id);
  return obj;
};

// ---------- Users ----------
const findUserByEmail = async (email) => {
  const clean = String(email || '').trim().toLowerCase();
  if (getIsConnected()) {
    const User = require('../models/User');
    return toPlain(await User.findOne({ email: clean }).select('+passwordHash'));
  }
  return memoryStore.users.find((u) => u.email === clean) || null;
};

const findUserById = async (id) => {
  if (!id) return null;
  if (getIsConnected()) {
    const User = require('../models/User');
    try {
      return toPlain(await User.findById(id));
    } catch (err) {
      return null;
    }
  }
  return memoryStore.users.find((u) => u._id === String(id)) || null;
};

const createUser = async ({
  name,
  email,
  passwordHash,
  role = 'student',
  campusId = 'berkeley',
  studentProfile,
  idProofImage
}) => {
  const data = { name, email: String(email).trim().toLowerCase(), passwordHash, role, campusId, isActive: true };
  if (role === 'student' && studentProfile) {
    data.studentProfile = { ...studentProfile, verificationStatus: 'PENDING' };
    if (idProofImage) data.idProofImage = idProofImage;
  }
  if (getIsConnected()) {
    const User = require('../models/User');
    return toPlain(await User.create(data));
  }
  const user = {
    _id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...data,
    createdAt: new Date().toISOString()
  };
  memoryStore.users.push(user);
  return user;
};

const touchLastLogin = async (id) => {
  if (getIsConnected()) {
    const User = require('../models/User');
    await User.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } });
    return;
  }
  const u = memoryStore.users.find((x) => x._id === String(id));
  if (u) u.lastLoginAt = new Date().toISOString();
};

const listUsers = async () => {
  if (getIsConnected()) {
    const User = require('../models/User');
    return (await User.find().sort({ createdAt: -1 })).map(toPlain);
  }
  return [...memoryStore.users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const setUserActive = async (id, isActive) => {
  if (getIsConnected()) {
    const User = require('../models/User');
    try {
      return toPlain(await User.findByIdAndUpdate(id, { isActive }, { new: true }));
    } catch (err) {
      return null;
    }
  }
  const u = memoryStore.users.find((x) => x._id === String(id));
  if (u) u.isActive = isActive;
  return u || null;
};

const normalize = (v) => String(v || '').trim().toLowerCase();

// True if another student already registered this roll number at the same university
const rollNoTaken = async (universityName, rollNo, exceptId = null) => {
  const uni = normalize(universityName);
  const roll = normalize(rollNo);
  const users = await listUsers();
  return users.some(
    (u) =>
      String(u._id) !== String(exceptId) &&
      u.studentProfile &&
      normalize(u.studentProfile.universityName) === uni &&
      normalize(u.studentProfile.rollNo) === roll
  );
};

// Replace a student's profile (and optionally their ID photo). A changed profile goes back to PENDING.
const updateStudentProfile = async (id, profile, idProofImage) => {
  if (getIsConnected()) {
    const User = require('../models/User');
    const $set = { studentProfile: { ...profile, verificationStatus: 'PENDING' } };
    if (idProofImage) $set.idProofImage = idProofImage;
    try {
      return toPlain(await User.findByIdAndUpdate(id, { $set }, { new: true }));
    } catch (err) {
      return null;
    }
  }
  const u = memoryStore.users.find((x) => x._id === String(id));
  if (!u) return null;
  u.studentProfile = { ...profile, verificationStatus: 'PENDING' };
  if (idProofImage) u.idProofImage = idProofImage;
  return u;
};

const setVerificationStatus = async (id, status) => {
  if (getIsConnected()) {
    const User = require('../models/User');
    try {
      return toPlain(
        await User.findOneAndUpdate(
          { _id: id, role: 'student' },
          { $set: { 'studentProfile.verificationStatus': status } },
          { new: true }
        )
      );
    } catch (err) {
      return null;
    }
  }
  const u = memoryStore.users.find((x) => x._id === String(id) && x.role === 'student');
  if (u && u.studentProfile) u.studentProfile.verificationStatus = status;
  return u || null;
};

const getIdProofImage = async (id) => {
  if (getIsConnected()) {
    const User = require('../models/User');
    try {
      const doc = await User.findById(id).select('+idProofImage');
      return doc ? doc.idProofImage || null : null;
    } catch (err) {
      return null;
    }
  }
  const u = memoryStore.users.find((x) => x._id === String(id));
  return u ? u.idProofImage || null : null;
};

// Public-safe shape (never includes passwordHash or the ID photo itself).
// Admins are not students: they get no studentProfile at all.
const publicUser = (u) => {
  if (!u) return u;
  const out = {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    campusId: u.campusId,
    isActive: u.isActive !== false,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt || null
  };
  if (u.role === 'student' && u.studentProfile) {
    out.studentProfile = { ...u.studentProfile, hasIdProof: Boolean(u.studentProfile.idProofName) };
  }
  return out;
};

// ---------- Orders ----------
const createOrder = async (data) => {
  if (getIsConnected()) {
    const Order = require('../models/Order');
    return toPlain(await Order.create(data));
  }
  const order = {
    _id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ...data,
    createdAt: new Date().toISOString()
  };
  memoryStore.orders.unshift(order);
  return order;
};

const listOrders = async (filter = {}) => {
  if (getIsConnected()) {
    const Order = require('../models/Order');
    return (await Order.find(filter).sort({ createdAt: -1 })).map(toPlain);
  }
  return memoryStore.orders.filter((o) => Object.entries(filter).every(([k, v]) => o[k] === v));
};

const findOrderById = async (id) => {
  if (getIsConnected()) {
    const Order = require('../models/Order');
    try {
      return toPlain(await Order.findById(id));
    } catch (err) {
      return null;
    }
  }
  return memoryStore.orders.find((o) => o._id === String(id)) || null;
};

const updateOrderStatus = async (id, status) => {
  if (getIsConnected()) {
    const Order = require('../models/Order');
    return toPlain(await Order.findByIdAndUpdate(id, { status }, { new: true }));
  }
  const o = memoryStore.orders.find((x) => x._id === String(id));
  if (o) o.status = status;
  return o || null;
};

module.exports = {
  findOrderById,
  updateOrderStatus,
  findUserByEmail,
  findUserById,
  createUser,
  touchLastLogin,
  listUsers,
  setUserActive,
  publicUser,
  rollNoTaken,
  updateStudentProfile,
  setVerificationStatus,
  getIdProofImage,
  createOrder,
  listOrders
};
