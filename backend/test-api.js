const app = require('./app');

// In-memory mock HTTP test runner that bypasses socket network layer
const createMockReqRes = (method, url, body = null) => {
  const { EventEmitter } = require('events');

  const req = new EventEmitter();
  req.method = method;
  req.url = url;
  req.headers = { 'content-type': 'application/json' };
  req.body = body;

  const res = new EventEmitter();
  let statusCode = 200;
  let responseData = '';
  const headers = {};

  res.statusCode = 200;
  res.status = (code) => {
    statusCode = code;
    res.statusCode = code;
    return res;
  };
  res.setHeader = (key, val) => {
    headers[key.toLowerCase()] = val;
  };
  res.getHeader = (key) => headers[key.toLowerCase()];
  res.json = (obj) => {
    responseData = JSON.stringify(obj);
    res.emit('finish');
    return res;
  };
  res.send = (str) => {
    responseData = typeof str === 'object' ? JSON.stringify(str) : String(str);
    res.emit('finish');
    return res;
  };
  res.end = (chunk) => {
    if (chunk) responseData += chunk;
    res.emit('finish');
  };

  const execute = () => {
    return new Promise((resolve, reject) => {
      res.on('finish', () => {
        try {
          const parsed = responseData ? JSON.parse(responseData) : null;
          resolve({ status: statusCode, ok: statusCode >= 200 && statusCode < 300, body: parsed });
        } catch (e) {
          resolve({ status: statusCode, ok: statusCode >= 200 && statusCode < 300, raw: responseData });
        }
      });
      try {
        app.handle(req, res);
      } catch (err) {
        reject(err);
      }
    });
  };

  return { execute };
};

const runDirectTests = async () => {
  console.log('Testing CampusZon Express MVC API persistence & endpoints...');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  };

  // 1. Health check
  await test('GET /api/health', async () => {
    const { execute } = createMockReqRes('GET', '/api/health');
    const res = await execute();
    if (!res.ok || res.body.status !== 'online') throw new Error(`Health status: ${res.body?.status}`);
  });

  // 2. Initial Listings
  await test('GET /api/listings retrieves initial items', async () => {
    const { execute } = createMockReqRes('GET', '/api/listings');
    const res = await execute();
    if (!res.ok || !Array.isArray(res.body.data) || res.body.data.length === 0) {
      throw new Error(`Failed to retrieve listings count: ${res.body?.count}`);
    }
  });

  // 3. Post an Item and verify persistence
  let createdCustomId = `item-test-${Date.now()}`;
  await test('POST /api/listings persists new item with frontend schema', async () => {
    const { execute } = createMockReqRes('POST', '/api/listings', {
      id: createdCustomId,
      title: 'Chemistry Lab Goggles & Splash Apron',
      price: 25,
      originalPrice: 50,
      category: 'Lab Equipment',
      courseCode: 'CHEM 1A',
      meetupLocation: 'Latimer Hall Steps',
      condition: 'Like New'
    });
    const res = await execute();
    if (!res.ok || !res.body.data?.title) throw new Error(`Create listing returned ${res.status}`);
  });

  await test('GET /api/listings includes the newly posted item', async () => {
    const { execute } = createMockReqRes('GET', '/api/listings');
    const res = await execute();
    const found = res.body.data.find(
      (item) => item.id === createdCustomId || item.title === 'Chemistry Lab Goggles & Splash Apron'
    );
    if (!found) throw new Error('Newly created item was not found in GET /api/listings');
    if (!found.meetupLocation || !found.category) throw new Error('Normalized fields missing');
  });

  // 4. Wishlist Toggle and persistence
  await test('PATCH /api/listings/:id/wishlist toggles item wishlist status to true', async () => {
    const { execute } = createMockReqRes('PATCH', `/api/listings/${createdCustomId}/wishlist`, {
      isWishlisted: true
    });
    const res = await execute();
    if (!res.ok || res.body.isWishlisted !== true) throw new Error('Toggle wishlist failed');
  });

  await test('GET /api/listings verifies item isWishlisted is persisted as true', async () => {
    const { execute } = createMockReqRes('GET', '/api/listings');
    const res = await execute();
    const item = res.body.data.find((l) => l.id === createdCustomId);
    if (!item) throw new Error('Item not found');
    if (item.isWishlisted !== true) throw new Error('Item isWishlisted was not persisted');
  });

  await test('GET /api/wishlist returns the wishlisted item', async () => {
    const { execute } = createMockReqRes('GET', '/api/wishlist');
    const res = await execute();
    if (!res.ok || !Array.isArray(res.body.data)) throw new Error('Wishlist query failed');
    const found = res.body.data.some((w) => w.title === 'Chemistry Lab Goggles & Splash Apron');
    if (!found) throw new Error('Item not found in Wishlist collection');
  });

  console.log(`\n========================================`);
  console.log(`Test Results: ${passed} passed, ${failed} failed`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
};

runDirectTests().catch((err) => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
