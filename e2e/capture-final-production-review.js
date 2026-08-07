/**
 * Final Executive Production Review — full-page screenshot audit.
 * Documentation only. Does not modify application code.
 */
const { chromium } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "audit-screenshots", "final-production-review");
const BASE = "http://localhost:3000";

const VIEWPORTS = [
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-414", width: 414, height: 896 },
  { name: "mobile-390", width: 390, height: 844 },
];

const ROUTES = [
  { slug: "home", path: "/", auth: false },
  { slug: "products", path: "/products", auth: false },
  { slug: "products-category", path: "/products?category=Fashion", auth: false },
  { slug: "product-detail", path: "/product/placeholder", auth: false, dynamic: true },
  { slug: "search", path: "/search?q=phone", auth: false },
  { slug: "best-selling", path: "/best-selling", auth: false },
  { slug: "property-mobility", path: "/property-mobility", auth: false },
  { slug: "events", path: "/events", auth: false },
  { slug: "flash-sales", path: "/flash-sales", auth: false },
  { slug: "checkout", path: "/checkout", auth: false },
  { slug: "login", path: "/login", auth: false },
  { slug: "sign-up", path: "/sign-up", auth: false },
  { slug: "about", path: "/about", auth: false },
  { slug: "faq", path: "/faq", auth: false },
  { slug: "profile", path: "/profile", auth: true },
  { slug: "settings", path: "/settings", auth: true },
  { slug: "dashboard", path: "/dashboard", auth: true },
  { slug: "dashboard-orders", path: "/dashboard-orders", auth: true },
  { slug: "inbox", path: "/inbox", auth: true },
  { slug: "shop-login", path: "/shop-login", auth: false },
  { slug: "admin-dashboard", path: "/admin/dashboard", auth: true, admin: true },
  { slug: "not-found", path: "/this-route-does-not-exist-404", auth: false },
  { slug: "vendors-legacy", path: "/vendors", auth: false },
  { slug: "categories-legacy", path: "/categories", auth: false },
  { slug: "property-legacy", path: "/property", auth: false },
  { slug: "mobility-legacy", path: "/mobility", auth: false },
  { slug: "wishlist-legacy", path: "/wishlist", auth: false },
  { slug: "cart-legacy", path: "/cart", auth: false },
  { slug: "auth-login-legacy", path: "/auth/login", auth: false },
];

const auditLog = [];

async function resolveProductId(page) {
  await page.goto(`${BASE}/products`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1500);
  const href = await page.evaluate(() => {
    const link = document.querySelector('a[href*="/product/"]');
    return link ? link.getAttribute("href") : null;
  });
  return href || "/products";
}

async function resolveShopId(page) {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 90000 });
  const href = await page.evaluate(() => {
    const link = document.querySelector('a[href*="/shop/"]');
    return link ? link.getAttribute("href") : null;
  });
  return href;
}

async function resolveListingId(page) {
  await page.goto(`${BASE}/property-mobility`, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2000);
  const href = await page.evaluate(() => {
    const link = document.querySelector('a[href*="/property-mobility/listing/"]');
    return link ? link.getAttribute("href") : null;
  });
  return href;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const productPath = await resolveProductId(page);
  const shopPath = await resolveShopId(page);
  const listingPath = await resolveListingId(page);

  const extraRoutes = [];
  if (productPath && productPath.includes("/product/")) {
    extraRoutes.push({ slug: "product-detail", path: productPath, auth: false });
  }
  if (shopPath) {
    extraRoutes.push({ slug: "vendor-shop", path: shopPath, auth: false });
  }
  if (listingPath) {
    extraRoutes.push({ slug: "property-listing-detail", path: listingPath, auth: false });
  }

  const allRoutes = [...ROUTES.filter((r) => r.slug !== "product-detail"), ...extraRoutes];

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const route of allRoutes) {
      const filename = `${vp.name}-${route.slug}.png`;
      const filepath = path.join(OUT, filename);
      let status = "ok";
      let title = "";
      let scrollOk = true;
      let httpLike = "unknown";
      let hasContent = false;
      let is404 = false;
      let redirectedTo = null;

      try {
        const response = await page.goto(`${BASE}${route.path}`, {
          waitUntil: "networkidle",
          timeout: 90000,
        });
        httpLike = response ? String(response.status()) : "no-response";
        await page.waitForTimeout(route.auth ? 800 : 1500);

        title = await page.title();
        const finalUrl = page.url();
        if (finalUrl !== `${BASE}${route.path}` && !route.path.includes("?")) {
          redirectedTo = finalUrl.replace(BASE, "");
        }

        is404 = await page.evaluate(() => {
          const t = document.body?.innerText?.toLowerCase() || "";
          return (
            t.includes("404") ||
            t.includes("not found") ||
            t.includes("page not found") ||
            document.title.toLowerCase().includes("not found")
          );
        });

        hasContent = await page.evaluate(
          () => (document.body?.innerText?.trim().length || 0) > 100
        );

        scrollOk = await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 2
        );

        if (route.slug === "home") {
          await page.evaluate(() => {
            const el = document.getElementById("discover-products");
            if (el) el.scrollIntoView({ block: "start" });
          });
          await page.waitForTimeout(600);
          await page.screenshot({
            path: path.join(OUT, `${vp.name}-home-discover-products-viewport.png`),
            fullPage: false,
          });
        }

        await page.screenshot({ path: filepath, fullPage: true });
      } catch (err) {
        status = "error";
        auditLog.push({
          viewport: vp.name,
          route: route.slug,
          path: route.path,
          filename,
          status,
          error: err.message,
        });
        continue;
      }

      auditLog.push({
        viewport: vp.name,
        route: route.slug,
        path: route.path,
        filename,
        status,
        httpLike,
        title,
        scrollOk,
        hasContent,
        is404,
        redirectedTo,
        auth: route.auth || false,
      });

      console.log(`${vp.name} / ${route.slug} → ${filename} (404:${is404}, scroll:${scrollOk})`);
    }
  }

  fs.writeFileSync(path.join(OUT, "audit-log.json"), JSON.stringify(auditLog, null, 2));
  fs.writeFileSync(
    path.join(OUT, "resolved-paths.json"),
    JSON.stringify({ productPath, shopPath, listingPath }, null, 2)
  );

  await browser.close();
  console.log("Done —", OUT, "entries:", auditLog.length);
})();
