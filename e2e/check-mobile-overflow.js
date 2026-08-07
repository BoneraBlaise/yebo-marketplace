const { chromium } = require("@playwright/test");

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "414", width: 414, height: 896 },
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle", timeout: 60000 });
    await page.waitForTimeout(1000);

    const metrics = await page.evaluate(() => {
      const header = document.querySelector(".home-header");
      const mainRow = document.querySelector(".home-header__main-row");
      const searchRow = document.querySelector(".home-header__search-row");
      const searchForm = document.querySelector(".home-header__search-form");
      const headerStyle = header ? getComputedStyle(header) : null;
      const searchRowStyle = searchRow ? getComputedStyle(searchRow) : null;
      const mainRowStyle = mainRow ? getComputedStyle(mainRow) : null;

      const offenders = [];
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.right > window.innerWidth + 1) {
          offenders.push({
            tag: el.tagName,
            cls: (el.className || "").toString().slice(0, 60),
            right: Math.round(r.right),
            vw: window.innerWidth,
          });
        }
      });

      return {
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasOverflow: document.documentElement.scrollWidth > window.innerWidth,
        headerRight: header ? Math.round(header.getBoundingClientRect().right) : null,
        searchRowFlex: searchRowStyle?.flex,
        searchRowWidth: searchRow ? Math.round(searchRow.getBoundingClientRect().width) : null,
        mainRowWrap: mainRowStyle?.flexWrap,
        offenderCount: offenders.length,
        topOffenders: offenders.slice(0, 8),
      };
    });

    console.log(`\n=== ${vp.name}px ===`);
    console.log(JSON.stringify(metrics, null, 2));
  }

  await browser.close();
})();
