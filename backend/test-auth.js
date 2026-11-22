// Tests for login/signup, roles, ownership and orders.
// Runs against the in-memory store (no MongoDB needed): `npm run test:auth`
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-test-secret-test-secret';
process.env.ADMIN_EMAIL = 'admin@campus.test';
process.env.ADMIN_PASSWORD = 'a-Strong-Admin-Pass-42';

const auth = require('./utils/auth');
const authController = require('./controllers/authController');
const orderController = require('./controllers/orderController');
const adminController = require('./controllers/adminController');
const listingController = require('./controllers/listingController');
const bundleController = require('./controllers/bundleController');
const { authenticate, requireRole } = require('./middleware/auth');
const seedAdmin = require('./utils/seedAdmin');
const memoryStore = require('./utils/memoryStore');
const verifyController = require('./controllers/verifyController');
const dataStore = require('./utils/dataStore');

const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
// Required student details collected at signup
const stu = (roll, extra = {}) => ({ universityName: 'UC Berkeley', rollNo: roll, idProofImage: TINY_PNG, idProofName: 'id.png', ...extra });

let passed = 0;
let failed = 0;
const check = (name, cond) => {
  if (cond) {
    passed++;
    console.log(`✅ [PASS] ${name}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${name}`);
  }
};

// Minimal fake req/res so controllers and middleware can be called directly
const call = async (handler, { body = {}, params = {}, query = {}, token = null, user } = {}) => {
  const req = { body, params, query, headers: token ? { authorization: `Bearer ${token}` } : {}, user };
  const out = { status: 200, body: null, nextErr: null, nextCalled: false };
  const res = {
    status(c) { out.status = c; return res; },
    json(b) { out.body = b; return res; }
  };
  await handler(req, res, (err) => { out.nextCalled = true; out.nextErr = err || null; });
  out.req = req;
  return out;
};

// Runs a chain like [authenticate, requireRole('admin'), handler] the way Express would
const chain = async (handlers, opts) => {
  const req = { body: opts.body || {}, params: opts.params || {}, query: {}, headers: opts.token ? { authorization: `Bearer ${opts.token}` } : {} };
  const out = { status: 200, body: null };
  let stopped = false;
  const res = {
    status(c) { out.status = c; return res; },
    json(b) { out.body = b; stopped = true; return res; }
  };
  for (const h of handlers) {
    if (stopped) break;
    let advanced = false;
    await h(req, res, (err) => { if (err) throw err; advanced = true; });
    if (!advanced) break;
  }
  return out;
};

(async () => {
  console.log('Testing auth, roles, ownership and orders...\n');

  // ---- Helpers ----
  const h = auth.hashPassword('hunter2-hunter2');
  check('password hash is salted (not plaintext)', !h.includes('hunter2') && h.startsWith('scrypt$'));
  check('correct password verifies', auth.verifyPassword('hunter2-hunter2', h));
  check('wrong password is rejected', !auth.verifyPassword('wrong', h));
  check('two hashes of one password differ', auth.hashPassword('x') !== auth.hashPassword('x'));

  const t = auth.signToken({ sub: 'u1', role: 'student' });
  check('valid token verifies', auth.verifyToken(t)?.sub === 'u1');
  const [a, b, c] = t.split('.');
  const forged = `${a}.${Buffer.from(JSON.stringify({ sub: 'u1', role: 'admin', exp: 9999999999 })).toString('base64url')}.${c}`;
  check('tampered token (role changed) is rejected', auth.verifyToken(forged) === null);
  check('expired token is rejected', auth.verifyToken(auth.signToken({ sub: 'u1' }, -10)) === null);
  const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  check('alg=none token is rejected', auth.verifyToken(`${noneHeader}.${b}.`) === null);
  check('garbage token is rejected', auth.verifyToken('abc') === null);

  // ---- Signup ----
  let r = await call(authController.signup, { body: { name: 'Sam Seller', email: 'sam@berkeley.edu', password: 'seller-pass-1', ...stu('R-100') } });
  check('signup succeeds (201)', r.status === 201 && !!r.body.data.token);
  const sam = r.body.data;
  check('signup always creates a student', sam.user.role === 'student');
  check('signup response never leaks the password hash', !JSON.stringify(sam).includes('passwordHash') && !JSON.stringify(sam).includes('scrypt$'));

  r = await call(authController.signup, { body: { name: 'Evil', email: 'evil@berkeley.edu', password: 'evil-pass-123', role: 'admin', ...stu('R-101') } });
  check('client cannot self-assign admin role on signup', r.status === 201 && r.body.data.user.role === 'student');

  r = await call(authController.signup, { body: { name: 'Sam Again', email: 'SAM@berkeley.edu', password: 'another-pass-1', ...stu('R-102') } });
  check('duplicate email rejected (409, case-insensitive)', r.status === 409);
  r = await call(authController.signup, { body: { name: 'X', email: 'not-an-email', password: 'longenough1', ...stu('R-103') } });
  check('invalid email rejected (400)', r.status === 400);
  r = await call(authController.signup, { body: { name: 'X', email: 'x@y.edu', password: 'short', ...stu('R-104') } });
  check('short password rejected (400)', r.status === 400);

  r = await call(authController.signup, { body: { name: 'Bea Buyer', email: 'bea@berkeley.edu', password: 'buyer-pass-1', ...stu('R-105') } });
  const bea = r.body.data;

  // ---- Student details at signup ----
  const samUser = memoryStore.users.find((u) => u.email === 'sam@berkeley.edu');
  check('signup stores roll number, college and ID proof', samUser.studentProfile.rollNo === 'R-100' && samUser.studentProfile.universityName === 'UC Berkeley' && !!samUser.idProofImage);
  check('new student starts as PENDING (not auto-verified)', samUser.studentProfile.verificationStatus === 'PENDING');
  check('signup response includes profile but never the ID image', sam.user.studentProfile?.rollNo === 'R-100' && !JSON.stringify(sam).includes('base64'));
  r = await call(authController.signup, { body: { name: 'No Roll', email: 'noroll@berkeley.edu', password: 'long-enough-1', ...stu(''), } });
  check('signup without roll number rejected (400)', r.status === 400);
  r = await call(authController.signup, { body: { name: 'No ID', email: 'noid@berkeley.edu', password: 'long-enough-1', ...stu('R-200', { idProofImage: undefined }) } });
  check('signup without ID proof rejected (400)', r.status === 400);
  r = await call(authController.signup, { body: { name: 'Bad ID', email: 'badid@berkeley.edu', password: 'long-enough-1', ...stu('R-201', { idProofImage: 'data:text/html;base64,PHNjcmlwdD4=' }) } });
  check('non-image ID proof rejected (400)', r.status === 400);
  r = await call(authController.signup, { body: { name: 'Dup Roll', email: 'dup@berkeley.edu', password: 'long-enough-1', ...stu('r-100') } });
  check('duplicate roll number at same university rejected (409)', r.status === 409);
  check('rejected signups create no account', !memoryStore.users.some((u) => ['noroll@berkeley.edu', 'noid@berkeley.edu', 'badid@berkeley.edu', 'dup@berkeley.edu'].includes(u.email)));

  // ---- Login ----
  r = await call(authController.login, { body: { email: 'sam@berkeley.edu', password: 'seller-pass-1' } });
  check('login with correct credentials works', r.status === 200 && !!r.body.data.token);
  r = await call(authController.login, { body: { email: 'sam@berkeley.edu', password: 'nope-nope-nope' } });
  const wrongPw = r;
  r = await call(authController.login, { body: { email: 'ghost@berkeley.edu', password: 'nope-nope-nope' } });
  check('wrong password and unknown email both give 401', wrongPw.status === 401 && r.status === 401);
  check('login error message does not reveal which was wrong', wrongPw.body.message === r.body.message);

  // ---- Admin seeding ----
  await seedAdmin();
  r = await call(authController.login, { body: { email: 'admin@campus.test', password: 'a-Strong-Admin-Pass-42' } });
  check('seeded admin can log in with role=admin', r.status === 200 && r.body.data.user.role === 'admin');
  const admin = r.body.data;
  check('admin has no student profile', admin.user.studentProfile === undefined);
  check('admin account stores no student data', !memoryStore.users.find((u) => u.role === 'admin').studentProfile);
  r = await chain([authenticate, requireRole('student'), verifyController.getVerificationProfile], { token: admin.token });
  check('admin is blocked from the student route (403)', r.status === 403);
  r = await chain([authenticate, verifyController.getVerificationProfile], { token: admin.token });
  check('verification profile endpoint refuses admin (403)', r.status === 403);
  r = await chain([authenticate, verifyController.submitVerification], { token: admin.token, body: stu('X-1', { universityEmail: 'a@b.edu' }) });
  check('verification submit refuses admin (403)', r.status === 403);
  r = await chain([authenticate, verifyController.getVerificationProfile], { token: sam.token });
  check('student can read their own profile', r.status === 200 && r.body.data.rollNo === 'R-100' && r.body.data.verificationStatus === 'PENDING');
  r = await chain([authenticate, verifyController.submitVerification], { token: sam.token, body: { ...stu('R-100', { department: 'CS', phone: '+1 555 123 4567', idProofImage: undefined }), universityEmail: 'sam@berkeley.edu' } });
  check('student can update details without re-uploading the ID', r.status === 200 && r.body.data.department === 'CS' && !!memoryStore.users.find((u) => u.email === 'sam@berkeley.edu').idProofImage);
  r = await chain([authenticate, requireRole('admin'), adminController.setVerification], { token: sam.token, params: { id: sam.user.id }, body: { status: 'VERIFIED' } });
  check('student cannot verify themselves (403)', r.status === 403);
  r = await chain([authenticate, requireRole('admin'), adminController.setVerification], { token: admin.token, params: { id: sam.user.id }, body: { status: 'VERIFIED' } });
  check('admin can verify a student', r.status === 200 && r.body.data.studentProfile.verificationStatus === 'VERIFIED');
  r = await chain([authenticate, requireRole('admin'), adminController.setVerification], { token: admin.token, params: { id: admin.user.id }, body: { status: 'VERIFIED' } });
  check('admin cannot be given a student verification (404)', r.status === 404);
  r = await chain([authenticate, requireRole('admin'), adminController.getIdProof], { token: admin.token, params: { id: sam.user.id } });
  check('admin can view a student ID photo', r.status === 200 && r.body.data.image.startsWith('data:image/png'));
  r = await chain([authenticate, requireRole('admin'), adminController.getIdProof], { token: sam.token, params: { id: sam.user.id } });
  check('student cannot use the admin ID-photo route (403)', r.status === 403);
  r = await chain([authenticate, verifyController.submitVerification], { token: sam.token, body: { ...stu('R-100', { idProofImage: undefined }), universityEmail: 'sam@berkeley.edu', department: 'Math' } });
  check('editing details sends the student back to PENDING', memoryStore.users.find((u) => u.email === 'sam@berkeley.edu').studentProfile.verificationStatus === 'PENDING');
  const _unused = dataStore;
  process.env.ADMIN_EMAIL = 'weak@campus.test';
  process.env.ADMIN_PASSWORD = 'admin123';
  await seedAdmin();
  check('weak/placeholder admin password does not create an account', !memoryStore.users.some((u) => u.email === 'weak@campus.test'));

  // ---- Middleware ----
  r = await call(authenticate, {});
  check('no token -> 401', r.status === 401 && !r.nextCalled);
  r = await call(authenticate, { token: 'garbage' });
  check('bad token -> 401', r.status === 401);
  r = await call(authenticate, { token: sam.token });
  check('good token attaches req.user', r.nextCalled && r.req.user.email === 'sam@berkeley.edu' && r.req.user.role === 'student');

  r = await chain([authenticate, requireRole('admin'), adminController.getOverview], { token: sam.token });
  check('student is blocked from admin overview (403)', r.status === 403);
  r = await chain([authenticate, requireRole('admin'), adminController.getOrders], { token: undefined });
  check('anonymous is blocked from admin orders (401)', r.status === 401);
  r = await chain([authenticate, requireRole('admin'), adminController.getUsers], { token: admin.token });
  check('admin can list users', r.status === 200 && r.body.count >= 3);
  check('admin user list has no password hashes', !JSON.stringify(r.body).includes('passwordHash') && !JSON.stringify(r.body).includes('scrypt$'));

  // ---- Listings: seller identity + ownership ----
  r = await call(listingController.createListing, {
    user: { id: sam.user.id, name: sam.user.name, role: 'student' },
    body: { title: 'Calculus Textbook', price: 40, originalPrice: 100, category: 'Textbooks', seller: { name: 'Alex Morgan' } }
  });
  check('listing created (201)', r.status === 201);
  const listing = r.body.data;
  check('seller is the logged-in user, not a spoofed/hardcoded name', listing.seller.name === 'Sam Seller' && listing.sellerId === sam.user.id);

  const delAs = (user) => call(listingController.deleteListing, { params: { id: listing.id }, user });
  r = await delAs({ id: bea.user.id, role: 'student' });
  check("another student cannot delete someone else's listing (403)", r.status === 403);
  check('listing still exists after blocked delete', memoryStore.listings.some((l) => l.id === listing.id));

  // ---- Orders ----
  const asUser = (u) => ({ id: u.user.id, name: u.user.name, email: u.user.email, role: u.user.role });
  r = await call(orderController.createOrderHandler, { user: asUser(sam), body: { itemType: 'listing', itemId: listing.id } });
  check('seller cannot buy their own listing (400)', r.status === 400);
  r = await call(orderController.createOrderHandler, { user: asUser(bea), body: { itemType: 'listing', itemId: 'does-not-exist' } });
  check('ordering a missing item -> 404', r.status === 404);
  r = await call(orderController.createOrderHandler, { user: asUser(bea), body: { itemType: 'car', itemId: 'x' } });
  check('invalid itemType -> 400', r.status === 400);

  r = await call(orderController.createOrderHandler, { user: asUser(bea), body: { itemType: 'listing', itemId: listing.id, price: 1 } });
  check('buyer can purchase a listing (201)', r.status === 201);
  const order = r.body.data;
  check('order price comes from the listing, not the client ($1 ignored)', order.price === 40);
  check('order stores original price and discount rate (60%)', order.originalPrice === 100 && order.discountPct === 60);
  check('order records buyer and seller', order.buyerId === bea.user.id && order.sellerId === sam.user.id && order.sellerName === 'Sam Seller');
  check('new order starts as pending (escrow deposit)', order.status === 'pending');

  r = await call(orderController.completeOrder, { params: { id: order._id }, user: asUser(sam) });
  check('someone other than the buyer cannot complete the order (403)', r.status === 403);
  r = await call(orderController.completeOrder, { params: { id: order._id }, user: asUser(bea) });
  check('buyer completes the order at handshake (200)', r.status === 200 && r.body.data.status === 'completed');
  r = await call(orderController.completeOrder, { params: { id: order._id }, user: asUser(bea) });
  check('an order cannot be completed twice (409)', r.status === 409);
  r = await call(orderController.completeOrder, { params: { id: 'nope' }, user: asUser(bea) });
  check('completing an unknown order -> 404', r.status === 404);

  // ---- Bundles ----
  const bundle = memoryStore.bundles.find((x) => !x.claimed);
  const bundlePrice = bundle.price;
  r = await call(bundleController.claimBundle, { params: { id: bundle._id }, user: asUser(bea) });
  check('buyer can claim a bundle (200) and an order is returned', r.status === 200 && r.body.order?.itemType === 'bundle');
  check('bundle order uses stored bundle price', r.body.order.price === bundlePrice);
  r = await call(bundleController.claimBundle, { params: { id: bundle._id }, user: asUser(sam) });
  check('claimed bundle cannot be claimed twice (409)', r.status === 409);
  r = await call(orderController.createOrderHandler, { user: asUser(sam), body: { itemType: 'bundle', itemId: bundle.id } });
  check('bundle can also be found by its string id and is not re-sellable', r.status === 409);
  const bundleOrderId = memoryStore.orders.find((x) => x.itemType === 'bundle')._id;
  await call(orderController.completeOrder, { params: { id: bundleOrderId }, user: asUser(bea) });

  // ---- Admin sees everything ----
  r = await chain([authenticate, requireRole('admin'), adminController.getOrders], { token: admin.token });
  check('admin sees both orders with buyer/seller/price', r.status === 200 && r.body.count === 2 && r.body.data.every((o) => o.buyerName && o.title && o.price >= 0));
  r = await chain([authenticate, requireRole('admin'), adminController.getOverview], { token: admin.token });
  const o = r.body.data;
  check('overview: order count and revenue are correct', o.totalOrders === 2 && o.totalRevenue === 40 + bundlePrice);
  check('overview: average discount is reported', typeof o.averageDiscountPct === 'number' && o.averageDiscountPct > 0);
  r = await chain([authenticate, requireRole('admin'), adminController.getListings], { token: admin.token });
  check('admin sees listings with price and discount', r.status === 200 && r.body.data.some((l) => l.title === 'Calculus Textbook' && l.discountPct === 60));

  r = await call(orderController.getMyOrders, { user: asUser(bea) });
  check('buyer sees own purchases', r.body.data.bought.length === 2 && r.body.data.sold.length === 0);
  r = await call(orderController.getMyOrders, { user: asUser(sam) });
  check('seller sees own sales', r.body.data.sold.length === 1);

  // ---- Admin can moderate ----
  r = await call(listingController.deleteListing, { params: { id: listing.id }, user: asUser(admin) });
  check('admin can delete any listing', r.status === 200);

  r = await chain([authenticate, requireRole('admin'), adminController.setUserStatus], { token: admin.token, params: { id: bea.user.id }, body: { isActive: false } });
  check('admin can deactivate a user', r.status === 200 && r.body.data.isActive === false);
  r = await call(authenticate, { token: bea.token });
  check('deactivated user is locked out immediately (401)', r.status === 401);
  r = await call(authController.login, { body: { email: 'bea@berkeley.edu', password: 'buyer-pass-1' } });
  check('deactivated user cannot log in', r.status === 401);
  r = await call(adminController.setUserStatus, { params: { id: admin.user.id }, body: { isActive: false }, user: asUser(admin) });
  check('admin cannot deactivate themselves', r.status === 400);

  console.log(`\n========================================`);
  console.log(`Auth Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================`);
  process.exit(failed > 0 ? 1 : 0);
})().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
