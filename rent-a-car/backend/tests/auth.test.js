const test = require('node:test');
const assert = require('node:assert/strict');
const { getJwtSecret, authenticate } = require('../middleware/authMiddleware');
const { verifyPassword } = require('../controllers/authController');

test('getJwtSecret requires JWT_SECRET to be configured', () => {
  const previous = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;

  try {
    assert.throws(() => getJwtSecret(), /JWT_SECRET/);
  } finally {
    if (previous) {
      process.env.JWT_SECRET = previous;
    }
  }
});

test('authenticate rejects requests without a bearer token', () => {
  const req = { headers: {} };
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };

  authenticate(req, res, () => {
    throw new Error('next should not be called');
  });

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { message: 'Not authenticated.' });
});

test('verifyPassword accepts legacy plaintext passwords and upgrades them to hashes', async () => {
  const updates = [];
  const user = {
    password: 'admin123',
    async update(payload) {
      updates.push(payload);
      return payload;
    },
  };

  const result = await verifyPassword('admin123', user.password, user);

  assert.equal(result, true);
  assert.equal(updates.length, 1);
  assert.notEqual(updates[0].password, 'admin123');
  assert.match(updates[0].password, /^\$2[aby]\$/);
});
