// End-to-end Playwright pass over the whole site (file://, headless Chromium).
// 1. Renders every page (home, plan, revision, patterns, drills, mocks, progress, all lectures) and reports
//    KaTeX errors, plot/code errors, unrendered $math$, broken markdown tables and horizontal overflow
//    at desktop (1280 px) and phone (390 px) widths.
// 2. Drives the quiz flows: Check on MCQ / numerical / predict-output / find-the-bug questions, Mark as done,
//    progress page, both mock papers (start → answer → submit → self-mark), persistence after reload, theme toggle.
// 3. Optionally runs one write-the-function question in Pyodide (needs network; reported, not failed, if offline).
// Usage: NODE_PATH=$(npm root -g) node tools/site_test.js [--shots DIR] [--no-pyodide]
const path = require('path');
const { chromium } = require('playwright');
const args = process.argv.slice(2);
const shots = args.includes('--shots') ? args[args.indexOf('--shots') + 1] : null;
const site = 'file://' + path.join(__dirname, '..', 'aml-exam-prep', 'index.html');
let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) failures++; };

async function audit(page) {
  return page.evaluate(() => ({
    katex: [...document.querySelectorAll('#main .katex-error')].map(e => e.getAttribute('title') || e.textContent).slice(0, 5),
    weak: [...document.querySelectorAll('#main p.weak')].map(e => e.textContent).slice(0, 5),
    raw: [...document.querySelectorAll('#main p, #main li, #main td')].filter(e => !e.closest('pre') && /\$[^$\s][^$]*\$/.test(e.textContent)).map(e => e.textContent.slice(0, 80)).slice(0, 5),
    brokenTable: [...document.querySelectorAll('#main p')].filter(e => /\|\s*-{3,}/.test(e.textContent) || /^\|.*\|$/.test(e.textContent.trim())).map(e => e.textContent.slice(0, 80)).slice(0, 5),
    overflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    textLen: document.querySelector('#main').innerText.length
  }));
}

(async () => {
  const browser = await chromium.launch();
  for (const [label, viewport] of [['desktop', { width: 1280, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('dialog', d => d.accept());
    await page.goto(site);
    const lecs = await page.evaluate(() => LECTURES.map(l => l.num).sort((a, b) => a - b));
    const routes = ['home', 'plan', 'revision', 'patterns', 'int-drill', 'code-drill', 'progress', 'mock/1', 'mock/2', ...lecs.map(n => 'lec/' + n)];
    let bad = 0;
    for (const r of routes) {
      await page.goto(site + '#/' + r);
      await page.waitForTimeout(r.startsWith('lec') ? 350 : 200);
      const a = await audit(page);
      const probs = [...a.katex.map(x => 'KATEX ' + x), ...a.weak.map(x => 'WEAK ' + x), ...a.raw.map(x => 'RAW$ ' + x), ...a.brokenTable.map(x => 'TABLE ' + x)];
      if (a.overflow) probs.push('horizontal overflow');
      if (a.textLen < 200) probs.push('page nearly empty');
      if (probs.length) { bad++; console.log(`  [${label}] #/${r}:`); probs.forEach(p => console.log('     ' + p)); }
      if (shots && label === 'desktop' && !r.startsWith('lec')) await page.screenshot({ path: path.join(shots, r.replace('/', '-') + '.png'), fullPage: true });
      if (shots && label === 'phone' && ['home', 'patterns', 'mock/1', 'lec/7'].includes(r)) await page.screenshot({ path: path.join(shots, 'phone-' + r.replace('/', '-') + '.png') });
    }
    ok(bad === 0, `[${label}] ${routes.length} pages render cleanly (KaTeX, plots, tables, math, overflow)`);
    ok(errs.length === 0, `[${label}] no console or page errors` + (errs.length ? ': ' + errs.slice(0, 3).join(' | ') : ''));
    await ctx.close();
  }

  /* ---------------- interaction flows ---------------- */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on('dialog', d => d.accept());
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(site);
  await page.evaluate(() => localStorage.clear());
  await page.goto(site + '#/home'); await page.reload();

  const verdictOf = async id => page.locator(`[data-qid="${id}"] .verdict`).getAttribute('class');
  async function answerQ(q, right) {
    const el = page.locator(`[data-qid="${q.id}"]`);
    if (q.options) {
      const want = right ? [].concat(q.answer) : [([].concat(q.answer)[0] + 1) % q.options.length];
      for (const i of want) await el.locator(`label[data-i="${i}"] input`).check();
    } else if (q.type === 'int') await el.locator('input.num').fill(right ? String(q.answer) : String(Number(q.answer) + 1000));
    else if (q.type !== 'write') await el.locator('textarea.txt').fill(right ? [].concat(q.answer)[0] : 'nope');
  }

  // integer drill: one right, one wrong
  await page.goto(site + '#/int-drill'); await page.waitForTimeout(200);
  const ints = await page.evaluate(() => EXTRA.intDrill.slice(0, 2).map(q => ({ id: q.id, type: q.type, answer: q.answer })));
  await answerQ(ints[0], true); await page.locator(`[data-qid="${ints[0].id}"] button[data-act="check"]`).click();
  await answerQ(ints[1], false); await page.locator(`[data-qid="${ints[1].id}"] button[data-act="check"]`).click();
  ok(/ok/.test(await verdictOf(ints[0].id)) && /no/.test(await verdictOf(ints[1].id)), 'integer drill: right answer marked ✓, wrong answer marked ✗, solution shown');
  ok(await page.locator(`[data-qid="${ints[0].id}"] .sol`).isVisible(), 'integer drill: worked solution is revealed after Check');

  // code drill: predict-output and find-the-bug
  await page.goto(site + '#/code-drill'); await page.waitForTimeout(200);
  const cq = await page.evaluate(() => { const o = EXTRA.codeDrill.find(q => q.type === 'out'), b = EXTRA.codeDrill.find(q => q.type === 'bug'); return [o, b].map(q => ({ id: q.id, type: q.type, answer: q.answer, options: q.options })); });
  for (const q of cq) { await answerQ(q, true); await page.locator(`[data-qid="${q.id}"] button[data-act="check"]`).click(); }
  ok(/ok/.test(await verdictOf(cq[0].id)) && /ok/.test(await verdictOf(cq[1].id)), 'code drill: exact output and bug choice graded correct');

  // lecture page: MCQ + mark done + sidebar counter
  await page.goto(site + '#/lec/3'); await page.waitForTimeout(300);
  const lq = await page.evaluate(() => { const u = LECTURES.find(l => l.num === 3).units[0]; const q = u.questions.find(q => q.type === 'mcq'); return { id: q.id, type: q.type, answer: q.answer, options: q.options, unit: u.id }; });
  await answerQ(lq, true); await page.locator(`[data-qid="${lq.id}"] button[data-act="check"]`).click();
  ok(/ok/.test(await verdictOf(lq.id)), 'lecture practice MCQ graded correct');
  await page.locator(`input[data-done="${lq.unit}"]`).check();
  await page.waitForTimeout(100);
  ok(/^1\//.test(await page.locator('#sidebar a[data-r="lec/3"] .pill').innerText()), 'Mark as done updates the sidebar counter');

  // progress page
  await page.goto(site + '#/progress'); await page.waitForTimeout(150);
  ok(/1\/1/.test(await page.locator('#main table tr', { hasText: 'L3 ' }).first().innerText()), 'progress page shows the attempted lecture question');

  // mock 1: answer everything right, submit, self-mark the write questions
  await page.goto(site + '#/mock/1'); await page.waitForTimeout(150);
  await page.locator('#startMock').click(); await page.waitForTimeout(250);
  const m1 = await page.evaluate(() => EXTRA.mocks[1].sections.flatMap(s => s.questions.map(q => ({ id: q.id, type: q.type, answer: q.answer, options: q.options, marks: q.marks }))));
  ok(/\d\d:\d\d/.test(await page.locator('#clock').innerText()), 'mock timer is running');
  for (const q of m1) await answerQ(q, true);
  await page.locator('#submitMock').click(); await page.waitForTimeout(300);
  const total = m1.reduce((s, q) => s + q.marks, 0), writeMarks = m1.filter(q => q.type === 'write').reduce((s, q) => s + q.marks, 0);
  const s1 = await page.locator('#mockResult h2').innerText();
  ok(s1.includes(`${total - writeMarks} / ${total}`), `mock 1 auto-marks every non-coding answer (${s1})`);
  while (await page.locator('button[data-self="1"]').count()) await page.locator('button[data-self="1"]').first().click();
  ok((await page.locator('#mockResult h2').innerText()).includes(`${total} / ${total}`), 'mock 1 self-marking adds the coding marks');

  // mock 2: all answers right → every non-coding mark awarded; then a fresh blank attempt → 0 and weak topics
  await page.goto(site + '#/mock/2'); await page.waitForTimeout(150);
  await page.locator('#startMock').click(); await page.waitForTimeout(250);
  const m2 = await page.evaluate(() => EXTRA.mocks[2].sections.flatMap(s => s.questions.map(q => ({ id: q.id, type: q.type, answer: q.answer, options: q.options, marks: q.marks }))));
  for (const q of m2) await answerQ(q, true);
  await page.locator('#submitMock').click(); await page.waitForTimeout(300);
  const t2 = m2.reduce((s, q) => s + q.marks, 0), w2 = m2.filter(q => q.type === 'write').reduce((s, q) => s + q.marks, 0);
  ok((await page.locator('#mockResult h2').innerText()).includes(`${t2 - w2} / ${t2}`), 'mock 2 auto-marks every non-coding answer');
  await page.reload(); await page.goto(site + '#/mock/2'); await page.waitForTimeout(150);
  await page.locator('#startMock').click(); await page.waitForTimeout(200);
  await page.locator('#submitMock').click(); await page.waitForTimeout(300);
  ok(/^Score: 0 \//.test(await page.locator('#mockResult h2').innerText()) && await page.locator('#mockResult .weak').count() > 0, 'mock 2 blank submission scores 0 and lists weak topics');

  // persistence and theme
  await page.reload(); await page.goto(site + '#/progress'); await page.waitForTimeout(200);
  const prog = await page.locator('#main').innerText();
  ok(/Mock 1: \d+\/61/.test(prog) && /Mock 2: 0\/61/.test(prog), 'mock scores persist after reload (localStorage)');
  await page.locator('#themeBtn').click();
  ok(['dark', 'light'].includes(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))), 'theme toggle sets data-theme');
  ok(errs.length === 0, 'no page errors during the flows' + (errs.length ? ': ' + errs.join(' | ') : ''));

  // Pyodide (optional)
  if (!args.includes('--no-pyodide')) {
    await page.goto(site + '#/code-drill'); await page.waitForTimeout(200);
    const w = await page.evaluate(() => { const q = EXTRA.codeDrill.find(q => q.type === 'write'); return { id: q.id, ref: q.ref }; });
    await page.locator(`[data-qid="${w.id}"] textarea.editor`).fill(w.ref);
    await page.locator(`[data-qid="${w.id}"] button[data-act="run"]`).click();
    try {
      await page.waitForFunction(id => /ALL TESTS PASSED|Offline|Error/.test(document.querySelector(`[data-qid="${id}"] .runout`).textContent), w.id, { timeout: 90000 });
      const out = await page.locator(`[data-qid="${w.id}"] .runout`).innerText();
      if (/Offline/.test(out)) console.log('SKIP  Pyodide could not be downloaded here (offline); the offline message is shown as designed');
      else ok(/ALL TESTS PASSED/.test(out), 'Pyodide runs the reference solution and its tests in the browser');
    } catch (e) { console.log('SKIP  Pyodide did not finish within 90 s'); }
  }
  await browser.close();
  console.log(failures ? `${failures} check(s) FAILED` : 'all checks passed');
  process.exit(failures ? 1 : 0);
})();
