// Load the site's data files in a sandbox (no browser), render every plot spec, and dump JSON for verify.py.
// Usage: node tools/dump_data.js [out.json]
const fs = require('fs'), path = require('path'), vm = require('vm');
const SITE = path.join(__dirname, '..', 'aml-exam-prep');
const ctx = { console, Math, JSON, Date, Array, Object, String, Number, Set, Map, isFinite, parseFloat, parseInt };
ctx.window = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]).filter(s => !s.startsWith('vendor/') && s !== 'js/app.js');
const errors = [];
for (const s of scripts) {
  const p = path.join(SITE, s);
  if (!fs.existsSync(p)) { errors.push('missing script ' + s); continue; }
  try { vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: s }); } catch (e) { errors.push(`${s}: ${e.message}`); }
}
// render all plots to catch runtime errors
const plotInfo = {};
function renderPlot(p, where) {
  try { const svg = ctx.PL.svgOf(p.spec); plotInfo[p.id] = { ok: /<svg/.test(svg), len: svg.length, where }; if (!/<svg/.test(svg)) errors.push(`plot ${p.id} produced no svg`); }
  catch (e) { plotInfo[p.id] = { ok: false, where }; errors.push(`plot ${p.id} (${where}): ${e.message}`); }
}
const L = (ctx.LECTURES || []).slice().sort((a, b) => a.num - b.num);
L.forEach(l => l.units.forEach(u => (u.plots || []).forEach(p => renderPlot(p, u.id))));
const E = ctx.EXTRA || {};
['plan', 'revision', 'patterns'].forEach(k => { if (E[k]) (E[k].blocks || []).forEach(b => b.plot && renderPlot(b.plot, k)); });
const strip = q => { const o = {}; for (const k in q) if (typeof q[k] !== 'function') o[k] = q[k]; return o; };
const out = {
  errors, scripts, plotInfo,
  lectures: L.map(l => ({ num: l.num, title: l.title, file: l.file, units: l.units.map(u => ({
    id: u.id, title: u.title, badge: u.badge, concept: u.concept ? String(u.concept) : '', formulas: u.formulas || [],
    deriv: (u.deriv || []).map(d => ({ id: d.id, title: d.title, steps: d.steps.length, result: d.result || '' })),
    plots: (u.plots || []).map(p => ({ id: p.id, title: p.title, notice: p.notice || '' })),
    examples: (u.examples || []).map(e => ({ title: e.title, body: String(e.body) })),
    code: (u.code || []).map(c => ({ scratch: c.scratch, lib: c.lib, more: c.more || [] })),
    traps: u.traps || [], researched: u.researched || '', source: u.source || '',
    questions: (u.questions || []).map(strip) })) })),
  intDrill: (E.intDrill || []).map(strip), codeDrill: (E.codeDrill || []).map(strip),
  mocks: Object.fromEntries(Object.entries(E.mocks || {}).map(([k, m]) => [k, { title: m.title, minutes: m.minutes, sections: m.sections.map(s => ({ name: s.name, marks: s.marks, desc: s.desc, questions: s.questions.map(strip) })) }])),
  docs: Object.fromEntries(['plan', 'revision', 'patterns'].filter(k => E[k]).map(k => [k, { title: E[k].title, body: String(E[k].body || ''), blocks: (E[k].blocks || []).map(b => ({ md: b.md ? String(b.md) : '', plot: b.plot ? b.plot.id : null, qs: (b.qs || []).map(strip), code: b.code || null })) }])),
  codeFiles: Object.keys(ctx.CODE || {})
};
const target = process.argv[2];
if (target) fs.writeFileSync(target, JSON.stringify(out));
const nq = out.lectures.reduce((s, l) => s + l.units.reduce((t, u) => t + u.questions.length, 0), 0);
console.log(`lectures=${out.lectures.length} units=${out.lectures.reduce((s, l) => s + l.units.length, 0)} questions=${nq} plots=${Object.keys(plotInfo).length} errors=${errors.length}`);
errors.slice(0, 40).forEach(e => console.log('  ERR', e));
