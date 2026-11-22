const {
  initialListings,
  initialBundles,
  initialWanted,
  initialSearchResults,
  initialWishlist,
  initialWatchlists,
  initialHubs
} = require('./seedData');

// Generate unique mock IDs for memory store items
const withIds = (arr, prefix = 'id') =>
  arr.map((item, index) => ({
    _id: item.id || `${prefix}_${Date.now()}_${index}`,
    ...item,
    createdAt: new Date().toISOString()
  }));

const memoryStore = {
  listings: withIds(initialListings, 'list'),
  bundles: withIds(initialBundles, 'bndl'),
  wanted: withIds(initialWanted, 'wntd'),
  searchResults: withIds(initialSearchResults, 'srch'),
  wishlist: withIds(initialWishlist, 'wish'),
  watchlists: withIds(initialWatchlists, 'wtch'),
  hubs: withIds(initialHubs, 'hub'),
  verification: {
    _id: 'verif_001',
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
    positiveReviews: 38,
    consent: true,
    createdAt: new Date().toISOString()
  }
};

module.exports = memoryStore;
