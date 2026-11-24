const mongoose = require('mongoose');
const {
  initialListings,
  initialBundles,
  initialWanted,
  initialWishlist,
  initialWatchlists,
  initialHubs
} = require('../utils/seedData');

let isConnected = false;

const seedDatabaseIfEmpty = async () => {
  try {
    const Listing = require('../models/Listing');
    const Bundle = require('../models/Bundle');
    const Wanted = require('../models/Wanted');
    const Wishlist = require('../models/Wishlist');
    const Watchlist = require('../models/Watchlist');
    const Hub = require('../models/Hub');
    const Verification = require('../models/Verification');

    // Ensure all initial listings are present with full schema fields
    for (const item of initialListings) {
      await Listing.findOneAndUpdate(
        { $or: [{ id: item.id }, { title: item.title }] },
        { $set: item },
        { upsert: true, new: true }
      );
    }

    // Upsert (not insertMany) so older databases also get the string `id` field
    for (const item of initialBundles) {
      await Bundle.findOneAndUpdate(
        { $or: [{ id: item.id }, { title: item.title }] },
        { $set: item },
        { upsert: true, new: true }
      );
    }

    const wantedCount = await Wanted.countDocuments();
    if (wantedCount === 0) {
      console.log('Seeding initial wanted board requests...');
      await Wanted.insertMany(initialWanted);
    }

    const wishlistCount = await Wishlist.countDocuments();
    if (wishlistCount === 0) {
      console.log('Seeding initial wishlist items...');
      await Wishlist.insertMany(initialWishlist);
    }

    const watchlistCount = await Watchlist.countDocuments();
    if (watchlistCount === 0) {
      console.log('Seeding initial course watchlists...');
      await Watchlist.insertMany(initialWatchlists);
    }

    const hubCount = await Hub.countDocuments();
    if (hubCount === 0) {
      console.log('Seeding initial meetup hubs...');
      await Hub.insertMany(initialHubs);
    }

    const verifyCount = await Verification.countDocuments();
    if (verifyCount === 0) {
      console.log('Seeding initial verification profile...');
      await Verification.create({
        campus: 'UC Berkeley – Main Campus',
        academicEmail: 'alex.morgan@berkeley.edu',
        studentType: 'Undergraduate',
        idScanFileName: 'cal1_front_scan_2025.png',
        status: 'VERIFIED',
        studentName: 'Alex Morgan',
        studentId: '3034928190',
        department: 'Haas School of Business',
        expirationDate: 'MAY 2026',
        matriculated: true,
        trustScore: 99.4,
        safeExchanges: 42,
        disputes: 0,
        positiveReviews: 38
      });
    }

    console.log('Database seeded and synchronized successfully.');
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campuszon';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedDatabaseIfEmpty();
  } catch (err) {
    isConnected = false;
    console.warn(`MongoDB not accessible at ${uri} (${err.message}).`);
    console.warn('Running with In-Memory fallback store. Full CRUD functionality will still work.');
  }
};

const getIsConnected = () => isConnected;

module.exports = {
  connectDB,
  getIsConnected
};
