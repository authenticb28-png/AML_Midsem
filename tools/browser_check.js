// Open the site from file:// in headless Chromium, visit each lecture page, and report
// console errors, KaTeX render errors, plot errors and missing code files.
// Usage: NODE_PATH=$(npm root -g) node tools/browser_check.js [lecture numbers...]
const path = require('path');
const { chromium } = require('playwright');
(async () => {
  const site = 'file://' + path.join(__dirname, '..', 'aml-exam-prep', 'index.html');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.goto(site);
  const nums = process.argv.slice(2).map(Number);
  const all = nums.length ? nums : await page.evaluate(() => LECTURES.map(l => l.num).sort((a, b) => a - b));
  for (const n of all) {
    await page.goto(site + '#/lec/' + n);
    await page.waitForTimeout(400);
    const r = await page.evaluate(() => ({
      units: document.querySelectorAll('section.unit').length,
      katexErr: [...document.querySelectorAll('.katex-error')].map(e => e.getAttribute('title') || e.textContent).slice(0, 8),
      plotErr: [...document.querySelectorAll('.weak')].map(e => e.textContent).slice(0, 8),
      rawDollar: [...document.querySelectorAll('.unit p, .unit li, .unit td')].filter(e => /\$[^$]+\$/.test(e.textContent)).map(e => e.textContent.slice(0, 80)).slice(0, 8),
      wide: document.documentElement.scrollWidth > window.innerWidth + 2
    }));
    console.log(`L${n}: units=${r.units} katexErrors=${r.katexErr.length} plotOrCodeErrors=${r.plotErr.length} unrenderedMath=${r.rawDollar.length}`);
    r.katexErr.forEach(e => console.log('   KATEX', e));
    r.plotErr.forEach(e => console.log('   WEAK', e));
    r.rawDollar.forEach(e => console.log('   RAW$', e));
  }
  errs.forEach(e => console.log('  ', e));
  await browser.close();
})();
