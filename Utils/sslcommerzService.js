const axios = require('axios');
const qs = require('querystring');

const storeId = process.env.SSL_STORE_ID;
const storePass = process.env.SSL_STORE_PASS;
const isLive = process.env.SSL_IS_LIVE === 'true';

const base = isLive
  ? 'https://securepay.sslcommerz.com'
  : 'https://sandbox.sslcommerz.com';

// ✅ Initiate session
async function createSession(postData) {
  const url = `${base}/gwprocess/v3/api.php`;
  const res = await axios.post(
    url,
    qs.stringify({
      ...postData,
      store_id: storeId,
      store_passwd: storePass,
    }),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 20000,
    }
  );
  return res.data;
}

// ✅ Validate by val_id
async function validateByValId(val_id) {
  const url = `${base}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(
    val_id
  )}&store_id=${storeId}&store_passwd=${storePass}&v=1&format=json`;
  const res = await axios.get(url, { timeout: 15000 });
  return res.data;
}

module.exports = { createSession, validateByValId };
