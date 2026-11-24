const Wanted = require('../models/Wanted');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// GET /api/wanted
exports.getAllWanted = async (req, res, next) => {
  try {
    const { category, urgency, zone, search } = req.query;

    if (getIsConnected()) {
      let query = {};
      if (category && category !== 'all') {
        query.category = category;
      }
      if (urgency && urgency !== 'all' && urgency !== 'Urgency Timeline') {
        query.urgency = urgency.toLowerCase().includes('urgent') ? 'urgent' : 'this_week';
      }
      if (zone && zone !== 'All Campus Zones' && zone !== 'Campus Zone / Dorm') {
        query.zone = { $regex: zone, $options: 'i' };
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { desc: { $regex: search, $options: 'i' } }
        ];
      }

      const items = await Wanted.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    }

    let results = [...memoryStore.wanted];
    if (category && category !== 'all') {
      results = results.filter(w => w.category === category);
    }
    if (urgency && urgency !== 'all' && urgency !== 'Urgency Timeline') {
      const matchUrgent = urgency.toLowerCase().includes('urgent');
      results = results.filter(w => (matchUrgent ? w.urgency === 'urgent' : w.urgency !== 'urgent'));
    }
    if (zone && zone !== 'All Campus Zones' && zone !== 'Campus Zone / Dorm') {
      results = results.filter(w => w.zone.toLowerCase().includes(zone.toLowerCase()));
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        w => w.title.toLowerCase().includes(q) || w.desc.toLowerCase().includes(q)
      );
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/wanted/:id
exports.getWantedById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const item = await Wanted.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Wanted request not found' });
      }
      return res.status(200).json({ success: true, data: item });
    }

    const item = memoryStore.wanted.find(w => w._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Wanted request not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// POST /api/wanted
exports.createWanted = async (req, res, next) => {
  try {
    const { title, desc, budget, zone, urgency, category } = req.body;

    if (!title || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and offered budget'
      });
    }

    const isUrgent = urgency === 'urgent' || urgency === 'Most Urgent';
    const wantedData = {
      title,
      desc: desc || 'Looking to acquire this item on campus from a fellow Cal student.',
      budget: budget.startsWith('$') ? budget : `$${budget}`,
      border: isUrgent ? '#ef4444' : '#0f1fa8',
      userId: req.user.id,
      initials: req.user.name.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'ST',
      avCls: 'avatar-ar',
      name: req.user.name,
      course: 'Student',
      timeAgo: 'Just now',
      tags: [
        { t: isUrgent ? 'Urgent Need' : 'Campus Need', cls: isUrgent ? 'chip-red' : 'chip-blue' },
        { t: 'Trade Eligible', cls: 'chip-green' }
      ],
      zone: zone || 'Sproul Plaza / MLK Union',
      activity: 'Be the first to reply',
      actColor: 'var(--muted)',
      urgency: isUrgent ? 'urgent' : 'this_week',
      category: category || 'course',
      offers: []
    };

    if (getIsConnected()) {
      const created = await Wanted.create(wantedData);
      return res.status(201).json({
        success: true,
        message: 'Wanted request published to board',
        data: created
      });
    }

    const mockItem = {
      _id: `wntd_${Date.now()}`,
      ...wantedData,
      createdAt: new Date().toISOString()
    };
    memoryStore.wanted.unshift(mockItem);

    res.status(201).json({
      success: true,
      message: 'Wanted request published to board (in-memory)',
      data: mockItem
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/wanted/:id/offer
exports.submitOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, message } = req.body;

    const offer = {
      offeredById: req.user.id,
      offeredBy: req.user.name,
      amount: Number(amount) || 0,
      message: message || 'I have this item available for meetup on campus!',
      createdAt: new Date()
    };

    if (getIsConnected()) {
      const item = await Wanted.findById(id);
      if (!item) {
        return res.status(404).json({ success: false, message: 'Wanted request not found' });
      }
      item.offers.push(offer);
      item.activity = `● ${item.offers.length} offer${item.offers.length > 1 ? 's' : ''} received`;
      item.actColor = '#22c55e';
      await item.save();

      return res.status(200).json({
        success: true,
        message: 'Your offer has been submitted securely to the student.',
        data: item
      });
    }

    const item = memoryStore.wanted.find(w => w._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Wanted request not found' });
    }
    if (!item.offers) item.offers = [];
    item.offers.push(offer);
    item.activity = `● ${item.offers.length} offer${item.offers.length > 1 ? 's' : ''} received`;
    item.actColor = '#22c55e';

    res.status(200).json({
      success: true,
      message: 'Your offer has been submitted securely to the student.',
      data: item
    });
  } catch (error) {
    next(error);
  }
};
