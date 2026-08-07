/**
 * E2E credentials — load ONLY from environment (never hardcode secrets in repo).
 * Copy e2e/.env.e2e.example → e2e/.env.e2e.local (gitignored) or set CI secrets.
 */

function vendorCredentials() {
  const email = process.env.E2E_VENDOR_EMAIL || process.env.E2E_SELLER_EMAIL;
  const password = process.env.E2E_VENDOR_PASSWORD || process.env.E2E_SELLER_PASSWORD;
  return { email, password, ready: Boolean(email && password) };
}

function buyerCredentials() {
  const email = process.env.E2E_BUYER_EMAIL;
  const password = process.env.E2E_BUYER_PASSWORD;
  return { email, password, ready: Boolean(email && password) };
}

function sellerCredentials() {
  const email = process.env.E2E_SELLER_EMAIL;
  const password = process.env.E2E_SELLER_PASSWORD;
  return { email, password, ready: Boolean(email && password) };
}

function skipIfMissing(testInfo, creds, label) {
  if (!creds.ready) {
    testInfo.skip(
      true,
      `Missing ${label}. Set credentials in e2e/.env.e2e.local (see e2e/.env.e2e.example).`
    );
  }
}

module.exports = {
  vendorCredentials,
  buyerCredentials,
  sellerCredentials,
  skipIfMissing,
};
