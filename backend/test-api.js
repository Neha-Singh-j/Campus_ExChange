/**
 * End-to-end API check. Needs a running server + MongoDB:
 *
 *     npm start            (terminal 1)
 *     npm test             (terminal 2)
 *
 * Creates throw-away users at @demo.gla.ac.in (accepted as a subdomain of gla.ac.in).
 */
const BASE = process.env.API_URL || 'http://localhost:5000/api';
const DOMAIN = process.env.TEST_EMAIL_DOMAIN || 'demo.gla.ac.in';
const PASSWORD = 'Test@12345';
const run = Date.now().toString(36);

let passed = 0;
let failed = 0;

const call = async (method, path, { token, json, form } = {}) => {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE}${path}`, { method, headers, body: json ? JSON.stringify(json) : form });
  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
};

const check = (name, condition, extra = '') => {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${name} ${extra}`);
  }
};

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

const signUp = async (label) => {
  const email = `${label}-${run}@${DOMAIN}`;
  const reg = await call('POST', '/auth/register', { json: { name: `Test ${label}`, email, password: PASSWORD } });
  return { email, token: reg.body.token, user: reg.body.user, status: reg.status };
};

(async () => {
  console.log(`\nTesting ${BASE}\n`);

  console.log('Health');
  const health = await call('GET', '/health');
  check('API is online', health.body.status === 'online');

  console.log('\nRegistration rules');
  let r = await call('POST', '/auth/register', { json: { name: 'Bad Domain', email: `x-${run}@gmail.com`, password: PASSWORD } });
  check('non-campus email rejected', r.status === 400 && r.body.code === 'EMAIL_DOMAIN');
  r = await call('POST', '/auth/register', { json: { name: 'Weak', email: `weak-${run}@${DOMAIN}`, password: 'abc' } });
  check('weak password rejected', r.status === 400 && r.body.code === 'WEAK_PASSWORD');

  console.log('\nSign-up + login');
  const email = `login-${run}@${DOMAIN}`;
  r = await call('POST', '/auth/register', { json: { name: 'Login Test', email, password: PASSWORD } });
  check('register returns 201 and a token', r.status === 201 && Boolean(r.body.token));
  r = await call('POST', '/auth/register', { json: { name: 'Login Test', email, password: PASSWORD } });
  check('duplicate email rejected', r.status === 409);
  r = await call('POST', '/auth/login', { json: { email, password: 'Wrong@12345' } });
  check('wrong password rejected', r.status === 401);
  r = await call('POST', '/auth/login', { json: { email, password: PASSWORD } });
  check('login works', r.status === 200 && Boolean(r.body.token));
  r = await call('GET', '/auth/me');
  check('/auth/me needs a token', r.status === 401);

  console.log('\nListings + ownership + image upload');
  const seller = await signUp('seller');
  const buyer = await signUp('buyer');
  check('seller and buyer signed up', seller.status === 201 && buyer.status === 201);

  const form = new FormData();
  form.append('title', 'Test Calculus Book');
  form.append('price', '300');
  form.append('category', 'Textbooks & Courseware');
  form.append('condition', 'Good');
  form.append('meetupLocation', 'Central Library entrance');
  form.append('images', new Blob([PNG], { type: 'image/png' }), 'one.png');
  form.append('images', new Blob([PNG], { type: 'image/png' }), 'two.png');
  r = await call('POST', '/listings', { form });
  check('anonymous cannot post', r.status === 401);
  r = await call('POST', '/listings', { token: seller.token, form });
  check('seller can post with 2 images', r.status === 201 && r.body.data.images.length === 2, JSON.stringify(r.body));
  const listingId = r.body.data?.id;
  check('seller is taken from the token', r.body.data?.seller.id === seller.user.id);

  const fake = new FormData();
  fake.append('title', 'Fake image');
  fake.append('price', '10');
  fake.append('category', 'Textbooks & Courseware');
  fake.append('meetupLocation', 'Central Library entrance');
  fake.append('images', new Blob([Buffer.from('not really an image at all')], { type: 'image/png' }), 'x.png');
  r = await call('POST', '/listings', { token: seller.token, form: fake });
  check('fake image file rejected', r.status === 400 && r.body.code === 'BAD_IMAGE');

  r = await call('PATCH', `/listings/${listingId}`, { token: buyer.token, json: { price: 1 } });
  check("buyer cannot edit seller's listing", r.status === 403);
  r = await call('DELETE', `/listings/${listingId}`, { token: buyer.token });
  check("buyer cannot delete seller's listing", r.status === 403);

  console.log('\nWishlist');
  r = await call('POST', '/wishlist', { token: buyer.token, json: { listingId } });
  check('save to wishlist', r.status === 201);
  r = await call('GET', '/wishlist', { token: buyer.token });
  check('wishlist lists it', r.body.count === 1);
  r = await call('GET', '/listings', { token: buyer.token });
  check('listing shows isWishlisted for the buyer', r.body.data.find((l) => l.id === listingId)?.isWishlisted === true);
  r = await call('DELETE', `/wishlist/${listingId}`, { token: buyer.token });
  check('remove from wishlist', r.status === 200);

  console.log('\nOffers + negotiation');
  r = await call('POST', '/offers', { token: seller.token, json: { listingId, amount: 100 } });
  check('seller cannot offer on own item', r.status === 400);
  r = await call('POST', '/offers', { token: buyer.token, json: { listingId, amount: 200, message: 'Can you do 200?' } });
  check('buyer sends an offer', r.status === 201 && r.body.data.status === 'open');
  const offerId = r.body.data?.id;
  r = await call('POST', '/offers', { token: buyer.token, json: { listingId, amount: 210 } });
  check('duplicate open offer rejected', r.status === 409);
  r = await call('POST', `/offers/${offerId}/respond`, { token: buyer.token, json: { action: 'accept' } });
  check("buyer cannot accept on the seller's turn", r.status === 409);
  r = await call('POST', `/offers/${offerId}/respond`, { token: seller.token, json: { action: 'counter', amount: 250 } });
  check('seller counters 250', r.status === 200 && r.body.data.currentAmount === 250 && r.body.data.turn === 'buyer');
  r = await call('POST', `/offers/${offerId}/respond`, { token: buyer.token, json: { action: 'accept' } });
  check('buyer accepts the counter', r.status === 200 && r.body.data.status === 'accepted' && r.body.data.finalAmount === 250);
  r = await call('GET', `/listings/${listingId}`);
  check('listing is now reserved', r.body.data.status === 'reserved');
  r = await call('POST', `/offers/${offerId}/complete`, { token: buyer.token });
  check('buyer cannot complete the deal', r.status === 403);
  r = await call('POST', `/offers/${offerId}/complete`, { token: seller.token });
  check('seller completes the deal', r.status === 200 && r.body.data.status === 'completed');
  r = await call('GET', `/listings/${listingId}`);
  check('listing is now sold', r.body.data.status === 'sold');

  console.log('\nCleanup');
  r = await call('DELETE', `/listings/${listingId}`, { token: seller.token });
  check('seller can delete own listing', r.status === 200);

  console.log(`\n${passed} passed, ${failed} failed`);
  console.log('(Test users @' + DOMAIN + ' remain in the database; "npm run seed:reset" removes them.)');
  process.exit(failed ? 1 : 0);
})().catch((err) => {
  console.error('Test run crashed:', err.message);
  process.exit(1);
});
