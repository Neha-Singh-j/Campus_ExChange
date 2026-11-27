/**
 * Demo data for development:  npm run seed        (add demo data)
 *                             npm run seed:reset  (remove demo data, then add it again)
 *
 * All demo accounts use the address domain "demo.gla.ac.in" (not a real mailbox), so
 * they can be found and removed without touching real students' data.
 * Edit the CAMPUS section to match your real campus before demoing.
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const config = require('../config');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Offer = require('../models/Offer');
const Wishlist = require('../models/Wishlist');
const Wanted = require('../models/Wanted');

// ---------------- CAMPUS (edit me) ----------------
const DEMO_DOMAIN = 'demo.gla.ac.in';
const SPOTS = [
  'Central Library entrance',
  'Main Gate security desk',
  'Admin block lobby',
  'Canteen / food court',
  'Hostel gate',
];
// --------------------------------------------------

const PEOPLE = [
  { name: 'Aarav Sharma', slug: 'aarav', department: 'B.Tech CSE', year: '3rd Year' },
  { name: 'Diya Verma', slug: 'diya', department: 'B.Tech ECE', year: '2nd Year' },
  { name: 'Rohan Gupta', slug: 'rohan', department: 'BBA', year: '4th Year' },
];

const IMG = {
  book: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  chair: 'https://images.unsplash.com/photo-1580481077195-c2901a6134b2?auto=format&fit=crop&w=600&q=80',
  calc: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
  lab: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80',
};
const img = (key) => [{ url: IMG[key], publicId: `seed-${key}`, storage: 'external' }];

const LISTINGS = (u) => [
  { by: 0, title: 'Engineering Mathematics - B.S. Grewal', category: 'Textbooks & Courseware', courseCode: 'BAS-203', price: 250, originalPrice: 700, condition: 'Good', conditionBadge: 'Clean pages, no highlights', meetupLocation: SPOTS[0], images: img('book'), tags: ['Maths', 'Semester 3'] },
  { by: 0, title: 'Casio fx-991ES Plus Scientific Calculator', category: 'Electronics & Calculators', price: 600, originalPrice: 1200, condition: 'Like New', conditionBadge: 'Works perfectly, cover included', meetupLocation: SPOTS[2], images: img('calc'), tags: ['Calculator'] },
  { by: 1, title: 'Ergonomic Study Chair', category: 'Dorm & Furniture', price: 900, originalPrice: 2500, condition: 'Good', conditionBadge: 'Height adjustable', meetupLocation: SPOTS[4], images: img('chair'), tags: ['Hostel', 'Furniture'] },
  { by: 1, title: 'Digital Electronics Lab Manual + Breadboard Kit', category: 'Lab Equipment', courseCode: 'ECE-201', price: 350, originalPrice: 800, condition: 'Good', conditionBadge: 'All components included', meetupLocation: SPOTS[0], images: img('lab'), tags: ['Lab', 'ECE'] },
  { by: 2, title: 'Engineering Drawing Drafter + Set Squares', category: 'Campus Gear & Merch', price: 200, originalPrice: 650, condition: 'Fair (Usable)', conditionBadge: 'Minor scratches', meetupLocation: SPOTS[3], images: [], tags: ['Drafter', '1st Year'] },
  { by: 2, title: 'Mini Cooler / Table Fan', category: 'Dorm & Furniture', price: 500, originalPrice: 1400, condition: 'Like New', conditionBadge: 'Used one summer', meetupLocation: SPOTS[4], images: [], tags: ['Hostel'] },
].map((l) => ({ ...l, sellerId: u[l.by]._id, campusId: config.campusId }));

const reset = async () => {
  const demoUsers = await User.find({ email: new RegExp(`@${DEMO_DOMAIN.replace(/\./g, '\\.')}$`) }).select('_id');
  const ids = demoUsers.map((u) => u._id);
  await Offer.deleteMany({ $or: [{ buyer: { $in: ids } }, { seller: { $in: ids } }] });
  await Wishlist.deleteMany({ user: { $in: ids } });
  await Listing.deleteMany({ sellerId: { $in: ids } });
  await Wanted.deleteMany({ user: { $in: ids } });
  await User.deleteMany({ _id: { $in: ids } });
  console.log(`Removed demo data (${ids.length} demo users and their records).`);
};

(async () => {
  if (config.isProd && !process.argv.includes('--force')) {
    console.error('Refusing to seed demo data in production (add --force if you really mean it).');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-exchange');

  if (process.argv.includes('--reset')) await reset();

  const password = process.env.SEED_PASSWORD || 'Demo@12345';
  const passwordHash = await bcrypt.hash(password, 12);

  const users = [];
  for (const p of PEOPLE) {
    const email = `${p.slug}@${DEMO_DOMAIN}`;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: p.name, email, passwordHash, campusId: config.campusId,
        department: p.department, year: p.year, isVerified: true, verifiedAt: new Date(),
      });
    }
    users.push(user);
  }

  if ((await Listing.countDocuments({ sellerId: { $in: users.map((u) => u._id) } })) === 0) {
    await Listing.insertMany(LISTINGS(users));
  }
  if ((await Wanted.countDocuments({ user: { $in: users.map((u) => u._id) } })) === 0) {
    await Wanted.insertMany([
      { user: users[0]._id, campusId: config.campusId, title: 'ISO: Data Structures textbook (Cormen / Tanenbaum)', budget: '300 - 500', desc: 'Need it for this semester. Can meet at the library.', zone: SPOTS[0], urgency: 'This Week', category: 'Textbooks & Notes' },
      { user: users[1]._id, campusId: config.campusId, title: 'Looking for a hostel mattress (single)', budget: 'Up to 800', desc: 'Clean, no stains please.', zone: SPOTS[4], urgency: 'Flexible', category: 'Dorm & Living' },
    ]);
  }

  console.log('\nDemo data ready. Log in with any of these (password: %s):', password);
  PEOPLE.forEach((p) => console.log(`  ${p.slug}@${DEMO_DOMAIN}`));
  await mongoose.disconnect();
})().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
