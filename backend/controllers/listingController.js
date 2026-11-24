const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const Wishlist = require('../models/Wishlist');
const { getIsConnected } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// Helper to find a listing by either MongoDB _id or custom string id
const findListingQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { id: id }] };
  }
  return { id: id };
};

// GET /api/listings
exports.getAllListings = async (req, res, next) => {
  try {
    const { cat, category, condition, fastResponder, search, sort, campusId } = req.query;

    if (getIsConnected()) {
      let query = {};
      const targetCat = cat || category;
      if (targetCat && targetCat !== 'all' && targetCat !== 'All Items (3,420)') {
        query.$or = [
          { cat: { $regex: targetCat, $options: 'i' } },
          { category: { $regex: targetCat, $options: 'i' } }
        ];
      }
      if (condition && condition !== 'All Grades') {
        query.condition = condition;
      }
      if (fastResponder === 'true') {
        query.fastResponder = true;
      }
      if (campusId) {
        query.$or = [
          { campusId: campusId },
          { campusId: { $exists: false } },
          { campusId: null }
        ];
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { desc: { $regex: search, $options: 'i' } },
          { sub: { $regex: search, $options: 'i' } },
          { courseCode: { $regex: search, $options: 'i' } }
        ];
      }

      let sortOption = { isFeatured: -1, createdAt: -1 };
      if (sort === 'Price: Low to High') sortOption = { price: 1 };
      if (sort === 'Price: High to Low') sortOption = { price: -1 };
      if (sort === 'Newest First') sortOption = { createdAt: -1 };

      const listings = await Listing.find(query).sort(sortOption).lean();

      // Normalize fields for both React and vanilla frontends
      const normalized = listings.map((l) => ({
        ...l,
        id: l.id || l._id.toString(),
        meetupLocation: l.meetupLocation || l.loc || 'Moffitt Library North Steps',
        loc: l.loc || l.meetupLocation || 'Moffitt Library North Steps',
        category: l.category || l.cat || 'Textbooks & Courseware',
        cat: l.cat || (l.category ? l.category.toLowerCase().split(' ')[0] : 'textbooks'),
        originalPrice: l.originalPrice || l.origPrice || Math.round(l.price * 1.5),
        origPrice: l.origPrice || l.originalPrice || Math.round(l.price * 1.5),
        isWishlisted: Boolean(l.isWishlisted),
        seller: {
          name: l.seller?.name || 'Cal Student',
          role: l.seller?.role || `${l.seller?.cls || 'Sr'} • ${l.seller?.hub || 'Main Campus'}`,
          avatar: l.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          rating: l.seller?.rating || 4.9,
          verified: l.seller?.verified !== undefined ? l.seller.verified : true,
          cls: l.seller?.cls || 'Sr',
          hub: l.seller?.hub || 'Main Campus',
          initials: l.seller?.initials || (l.seller?.name ? l.seller.name.split(' ').map((n) => n[0]).join('') : 'CS'),
          avCls: l.seller?.avCls || 'avatar-ml'
        }
      }));

      return res.status(200).json({
        success: true,
        count: normalized.length,
        data: normalized
      });
    }

    // In-memory fallback
    let results = [...memoryStore.listings];
    const targetCat = cat || category;
    if (targetCat && targetCat !== 'all' && targetCat !== 'All Items (3,420)') {
      results = results.filter(
        (item) =>
          (item.cat && item.cat.toLowerCase().includes(targetCat.toLowerCase())) ||
          (item.category && item.category.toLowerCase().includes(targetCat.toLowerCase()))
      );
    }
    if (condition && condition !== 'All Grades') {
      results = results.filter((item) => item.condition === condition);
    }
    if (fastResponder === 'true') {
      results = results.filter((item) => item.fastResponder);
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.desc && item.desc.toLowerCase().includes(q)) ||
          (item.sub && item.sub.toLowerCase().includes(q)) ||
          (item.courseCode && item.courseCode.toLowerCase().includes(q))
      );
    }

    if (sort === 'Price: Low to High') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'Price: High to Low') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'Newest First') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const normalized = results.map((l) => ({
      ...l,
      id: l.id || l._id,
      meetupLocation: l.meetupLocation || l.loc || 'Moffitt Library North Steps',
      loc: l.loc || l.meetupLocation || 'Moffitt Library North Steps',
      category: l.category || l.cat || 'Textbooks & Courseware',
      cat: l.cat || (l.category ? l.category.toLowerCase().split(' ')[0] : 'textbooks'),
      originalPrice: l.originalPrice || l.origPrice || Math.round(l.price * 1.5),
      origPrice: l.origPrice || l.originalPrice || Math.round(l.price * 1.5),
      isWishlisted: Boolean(l.isWishlisted)
    }));

    res.status(200).json({
      success: true,
      count: normalized.length,
      data: normalized
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/listings/:id
exports.getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const listing = await Listing.findOne(findListingQuery(id));
      if (!listing) {
        return res.status(404).json({ success: false, message: 'Listing not found' });
      }
      return res.status(200).json({ success: true, data: listing });
    }

    const listing = memoryStore.listings.find((item) => item._id === id || item.id === id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    next(error);
  }
};

// POST /api/listings
exports.createListing = async (req, res, next) => {
  try {
    const {
      title,
      price,
      originalPrice,
      origPrice,
      category,
      cat,
      condition,
      conditionBadge,
      courseCode,
      meetupLocation,
      loc,
      image,
      imgKey,
      desc,
      seller,
      tags,
      campusId
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and price for the listing'
      });
    }

    const numPrice = Number(price);
    const numOrig = Number(originalPrice || origPrice) || Math.round(numPrice * 1.6);
    const customId = req.body.id || `item-${Date.now()}`;

    const newListingData = {
      id: customId,
      title,
      price: numPrice,
      originalPrice: numOrig,
      origPrice: numOrig,
      discount: req.body.discount || `${Math.round((1 - numPrice / numOrig) * 100)}% off`,
      badge: req.body.badge || (courseCode ? 'COURSE MATCHED' : 'STUDENT DROP'),
      badgeType: req.body.badgeType || 'royal',
      badgeCls: req.body.badgeCls || 'badge-course',
      courseCode: courseCode || 'General Campus',
      category: category || cat || 'Textbooks & Courseware',
      cat: cat || (category ? category.toLowerCase().split(' ')[0] : 'textbooks'),
      condition: condition || 'Good',
      conditionBadge: conditionBadge || 'Verified student item',
      meetupLocation: meetupLocation || loc || 'Moffitt Library North Steps',
      loc: loc || meetupLocation || 'Moffitt Library North Steps',
      image: image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      imgKey: imgKey || '',
      grad: req.body.grad || 'linear-gradient(135deg,#4a6080,#2d4060)',
      desc: desc || 'Newly posted item directly from a verified UC Berkeley student.',
      // Seller identity always comes from the logged-in account, never from the request body
      sellerId: req.user.id,
      seller: {
        name: req.user.name,
        role: seller?.role || 'Student',
        avatar: seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5.0,
        verified: true,
        cls: seller?.cls || 'Jr',
        hub: seller?.hub || 'Main Campus',
        initials: req.user.name
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'ST',
        avCls: seller?.avCls || 'avatar-ml'
      },
      tags: tags || [(category || 'Item').split(' ')[0], courseCode || 'Campus'],
      isWishlisted: false,
      campusId: campusId || 'berkeley',
      fastResponder: true,
      isFeatured: true,
      likesCount: 0
    };

    if (getIsConnected()) {
      const created = await Listing.create(newListingData);
      return res.status(201).json({
        success: true,
        message: 'Listing saved to database successfully',
        data: created
      });
    }

    const mockItem = {
      _id: `list_${Date.now()}`,
      ...newListingData,
      createdAt: new Date().toISOString()
    };
    memoryStore.listings.unshift(mockItem);

    res.status(201).json({
      success: true,
      message: 'Listing saved to database successfully (in-memory)',
      data: mockItem
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/listings/:id/wishlist
exports.toggleWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isWishlisted } = req.body;

    const nextState = isWishlisted !== undefined ? Boolean(isWishlisted) : true;

    if (getIsConnected()) {
      const listing = await Listing.findOne(findListingQuery(id));
      if (!listing) {
        return res.status(404).json({ success: false, message: 'Listing not found' });
      }
      listing.isWishlisted = nextState;
      await listing.save();

      // Sync with Wishlist collection
      if (nextState) {
        await Wishlist.findOneAndUpdate(
          { $or: [{ id: listing.id }, { title: listing.title }] },
          {
            userId: 'me',
            title: listing.title,
            price: listing.price,
            seller: listing.seller?.name || 'Cal Student',
            hub: listing.meetupLocation || listing.loc || 'Campus Hub',
            desc: listing.desc || ''
          },
          { upsert: true, new: true }
        );
      } else {
        await Wishlist.findOneAndDelete({ $or: [{ id: listing.id }, { title: listing.title }] });
      }

      return res.status(200).json({
        success: true,
        message: nextState ? 'Added to wishlist' : 'Removed from wishlist',
        isWishlisted: nextState,
        data: listing
      });
    }

    // In-memory update
    const item = memoryStore.listings.find((l) => l._id === id || l.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    item.isWishlisted = nextState;

    if (nextState) {
      if (!memoryStore.wishlist.some((w) => w.title === item.title || w.id === item.id)) {
        memoryStore.wishlist.unshift({
          id: item.id || `wish_${Date.now()}`,
          title: item.title,
          price: item.price,
          seller: item.seller?.name || 'Cal Student',
          hub: item.meetupLocation || 'Campus Hub',
          desc: item.desc || ''
        });
      }
    } else {
      const wIdx = memoryStore.wishlist.findIndex((w) => w.title === item.title || w.id === item.id);
      if (wIdx !== -1) memoryStore.wishlist.splice(wIdx, 1);
    }

    res.status(200).json({
      success: true,
      message: nextState ? 'Added to wishlist' : 'Removed from wishlist',
      isWishlisted: nextState,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/listings/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const listing = await Listing.findOne(findListingQuery(id));
      if (!listing) {
        return res.status(404).json({ success: false, message: 'Listing not found' });
      }
      listing.likesCount = (listing.likesCount || 0) + 1;
      await listing.save();
      return res.status(200).json({ success: true, likesCount: listing.likesCount });
    }

    const item = memoryStore.listings.find((l) => l._id === id || l.id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    item.likesCount = (item.likesCount || 0) + 1;

    res.status(200).json({ success: true, likesCount: item.likesCount });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/listings/:id
exports.deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Only the seller or an admin may delete a listing
    const canDelete = (listing) =>
      req.user.role === 'admin' || (listing.sellerId && String(listing.sellerId) === req.user.id);

    if (getIsConnected()) {
      const existing = await Listing.findOne(findListingQuery(id));
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Listing not found' });
      }
      if (!canDelete(existing)) {
        return res.status(403).json({ success: false, message: 'You can only delete your own listings' });
      }
      await existing.deleteOne();
      return res.status(200).json({ success: true, message: 'Listing deleted' });
    }

    const index = memoryStore.listings.findIndex((l) => l._id === id || l.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }
    if (!canDelete(memoryStore.listings[index])) {
      return res.status(403).json({ success: false, message: 'You can only delete your own listings' });
    }
    memoryStore.listings.splice(index, 1);

    res.status(200).json({ success: true, message: 'Listing deleted from memory store' });
  } catch (error) {
    next(error);
  }
};

// GET /api/listings/stats/summary
exports.getMarketplaceStats = async (req, res, next) => {
  try {
    let count = 3420;
    if (getIsConnected()) {
      const dbCount = await Listing.countDocuments();
      count = Math.max(3420, dbCount);
    } else {
      count = Math.max(3420, memoryStore.listings.length);
    }

    res.status(200).json({
      success: true,
      data: {
        activeListings: count,
        onCampusHandoffs: '98%',
        eduVerified: '100%',
        liveFeed: [
          '● Maya L. swapped Bio 1A Notes at Moffitt Library (2m ago)',
          '● David K. sold Dorm Chair at Unit 2 Towle Lounge (8m ago)',
          '● Sarah T. completed TI-84 handoff at MLK Union (15m ago)'
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};
