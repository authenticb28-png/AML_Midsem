/* app.js — router, renderers, quiz engine, mocks, progress. Works from file:// (no fetch). */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const KEY = 'amlprep.v1';

  /* ---------------- storage ---------------- */
  function blank() { return { done: {}, q: {}, mocks: {}, drills: {} }; }
  let S = blank();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(blank(), JSON.parse(raw)); } catch (e) { S = blank(); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage blocked: progress lives only in memory */ } }

  /* ---------------- markdown + math ---------------- */
  const BOXT = { hook: 'Hook', key: 'Key insight', warn: 'Warning', take: 'Takeaway', think: 'Think & discuss', reflect: 'Reflect', res: '⚠ Not covered in class – researched', practice: 'Practice', note: 'Note', case: 'Case study' };
  function md(src) {
    if (src == null) return '';
    if (Array.isArray(src)) src = src.join('\n\n');
    src = String(src).replace(/\\`/g, '`');   // data files write inline code as \`x\` inside R`...` templates
    const store = [];
    const keep = h => { store.push(h); return 'ZZKEEP' + (store.length - 1) + 'ZZ'; };
    src = src.replace(/^:::(\w+)[ \t]*([^\n]*)\n([\s\S]*?)\n:::[ \t]*$/gm, (_, t, title, inner) => keep(`<div class="box ${t === 'reflect' || t === 'practice' || t === 'note' || t === 'case' ? 'think' : t}"><div class="bt">${esc(title || BOXT[t] || t)}</div>${md(inner)}</div>`));
    src = src.replace(/```(\w*)\n([\s\S]*?)```/g, (_, l, code) => keep('<pre><code>' + esc(code.replace(/\n$/, '')) + '</code></pre>'));
    src = src.replace(/`([^`\n]+)`/g, (_, c) => keep('<code>' + esc(c) + '</code>'));
    src = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => keep('<span class="mathd">$$' + esc(m) + '$$</span>'));
    src = src.replace(/\$([^$\n]+?)\$/g, (_, m) => keep('$' + esc(m) + '$'));
    let html = window.marked ? marked.parse(src, { mangle: false, headerIds: false }) : '<p>' + esc(src) + '</p>';
    for (let k = 0; k < 3; k++) html = html.replace(/ZZKEEP(\d+)ZZ/g, (_, i) => store[+i]);
    return html;
  }
  function typeset(el) {
    if (!window.renderMathInElement) return;
    try { renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false, strict: false }); } catch (e) { console.warn('KaTeX', e); }
  }
  const tex = t => `<span class="mathd">$$${esc(t)}$$</span>`;

  /* ---------------- helpers ---------------- */
  const BADGE = { class: ['class', 'From class worksheet'], board: ['board', 'From class whiteboard/note'], res: ['res', '⚠ Not covered in class – researched'], extra: ['extra', 'Extra (beyond worksheet)'] };
  function badges(b) { return [].concat(b || 'class').map(k => { const v = BADGE[k] || ['tag', k]; return `<span class="badge ${v[0]}">${esc(v[1])}</span>`; }).join(' '); }
  const TYPE = { mcq: 'MCQ · single correct', msq: 'MSQ · multiple correct', int: 'Numerical (type the answer)', out: 'Code · predict the output', bug: 'Code · find the bug', fill: 'Code · fill the missing line', write: 'Code · write the function' };
  const lecs = () => window.LECTURES.slice().sort((a, b) => a.num - b.num);
  const lecById = n => window.LECTURES.find(l => l.num === +n);
  function allUnits() { return lecs().flatMap(l => l.units.map(u => Object.assign(u, { _lec: l.num }))); }
  // assign stable ids
  function prepQs(list, prefix) { (list || []).forEach((q, i) => { if (!q.id) q.id = prefix + '.q' + (i + 1); }); }
  lecs().forEach(l => l.units.forEach(u => prepQs(u.questions, u.id)));

  /* ---------------- sidebar ---------------- */
  function sidebar() {
    const nav = $('#sidebar');
    const lecLinks = lecs().map(l => { const d = l.units.filter(u => S.done[u.id]).length; return `<a href="#/lec/${l.num}" data-r="lec/${l.num}"><span>L${l.num} · ${esc(l.short || l.title)}</span><span class="pill">${d}/${l.units.length}</span></a>`; }).join('');
    nav.innerHTML = `<div class="grp">Start</div>
      <a href="#/home" data-r="home">🏠 Home & how to use</a>
      <a href="#/plan" data-r="plan">🗓️ 7-day study plan</a>
      <a href="#/patterns" data-r="patterns">🔎 Course quiz patterns</a>
      <div class="grp">Lectures</div>${lecLinks}
      <div class="grp">Practice</div>
      <a href="#/int-drill" data-r="int-drill">🔢 Integer drill</a>
      <a href="#/code-drill" data-r="code-drill">💻 Code drill</a>
      <a href="#/mock/1" data-r="mock/1">📝 Mock paper 1</a>
      <a href="#/mock/2" data-r="mock/2">📝 Mock paper 2</a>
      <div class="grp">Review</div>
      <a href="#/revision" data-r="revision">⚡ Last-night revision</a>
      <a href="#/progress" data-r="progress">📈 Progress</a>`;
    markActive();
  }
  function markActive() { const r = location.hash.replace(/^#\//, '').split('/').slice(0, 2).join('/'); $$('#sidebar a').forEach(a => a.classList.toggle('active', a.dataset.r === r || (r === '' && a.dataset.r === 'home'))); }

  /* ---------------- question engine ---------------- */
  const ctxs = {}; // id -> {q, mode, state}
  function qShell(q, n, mode) {
    const lecTag = q.lec !== undefined ? `<span class="badge tag">L${q.lec}</span>` : '';
    const marks = q.marks ? `<span class="badge tag">${q.marks} mark${q.marks > 1 ? 's' : ''}</span>` : '';
    let body = md(q.q);
    if (q.code) body += `<pre><code>${esc(q.code)}</code></pre>`;
    let input = '';
    const name = 'r_' + q.id.replace(/[^a-z0-9]/gi, '_');
    if (q.options) {
      const multi = q.type === 'msq';
      input = `<ul class="opts">${q.options.map((o, i) => `<li><label data-i="${i}"><input type="${multi ? 'checkbox' : 'radio'}" name="${name}" value="${i}"><span><b>${String.fromCharCode(65 + i)}.</b> ${md(o).replace(/^<p>|<\/p>\s*$/g, '')}</span></label></li>`).join('')}</ul>`;
    } else if (q.type === 'int') {
      input = `<div class="actions"><input class="num" type="text" inputmode="decimal" placeholder="your answer"> <span class="small muted">${esc(q.round || '')}</span></div>`;
    } else if (q.type === 'write') {
      input = `<textarea class="editor" spellcheck="false">${esc(q.starter || '')}</textarea>`;
    } else {
      const rows = Math.max(2, String([].concat(q.answer || '')[0]).split('\n').length + 1);
      input = `<div class="actions" style="display:block"><textarea class="txt editor" style="min-height:0" rows="${rows}" spellcheck="false" placeholder="type the exact output (one line per printed line)"></textarea></div>`;
    }
    let actions = '';
    if (mode === 'practice') {
      actions = q.type === 'write'
        ? `<button class="btn" data-act="run">▶ Run tests (Pyodide)</button><button class="btn ghost" data-act="reveal">Reveal reference solution</button>`
        : `<button class="btn" data-act="check">Check</button><button class="btn ghost" data-act="reveal">Reveal answer</button>`;
    } else if (q.type === 'write') {
      actions = `<button class="btn ghost" data-act="run">▶ Run tests (Pyodide)</button>`;
    }
    return `<div class="q" id="q-${esc(q.id)}" data-qid="${esc(q.id)}">
      <div class="qhead"><span class="qnum">Q${n}</span><span class="badge tag">${TYPE[q.type] || q.type}</span>${lecTag}${marks}<span class="badge tag">${esc(q.tag || 'GATE-style')}</span>${q.diff ? `<span class="badge tag">${esc({ E: 'Easy', M: 'Medium', H: 'Hard' }[q.diff] || q.diff)}</span>` : ''}${q.src ? `<span class="badge tag">${esc(q.src)}</span>` : ''}</div>
      <div class="qbody">${body}</div>${input}
      <div class="actions">${actions}<span class="verdict"></span></div>
      <pre class="runout output hidden"></pre>
      <div class="sol hidden"></div></div>`;
  }
  function solHTML(q) {
    let h = '';
    if (q.options) {
      const ans = [].concat(q.answer).map(i => String.fromCharCode(65 + i)).join(', ');
      h += `<p><b>Answer: ${ans}</b></p>`;
    } else if (q.type === 'int') {
      h += `<p><b>Answer: ${esc(q.answer)}</b>${q.tol ? ` <span class="small muted">(accepted within ±${q.tol})</span>` : ''}</p>`;
    } else if (q.type !== 'write' && q.answer !== undefined) {
      h += `<p><b>Answer:</b></p><pre class="output"><code>${esc([].concat(q.answer)[0])}</code></pre>`;
    }
    if (q.sol) h += md(q.sol);
    if (q.why && q.options) h += `<div class="whyopt"><b>Why each option is right/wrong:</b><ul>${q.why.map((w, i) => `<li><b>${String.fromCharCode(65 + i)}.</b> ${md(w).replace(/^<p>|<\/p>\s*$/g, '')}</li>`).join('')}</ul></div>`;
    if (q.fixed) h += `<p><b>Corrected code:</b></p><pre><code>${esc(q.fixed)}</code></pre>`;
    if (q.ref) h += `<p><b>Reference solution:</b></p><pre><code>${esc(q.ref)}</code></pre>`;
    if (q.tests) h += `<details><summary>Test cases used</summary><pre><code>${esc(q.tests)}</code></pre></details>`;
    if (q.expected) h += `<p><b>Expected output of the reference + tests:</b></p><pre class="output"><code>${esc(q.expected)}</code></pre>`;
    if (q.file) h += `<p class="small muted">Also saved as <span class="kbd">${esc(q.file)}</span> with these tests.</p>`;
    return h;
  }
  const norm = s => String(s).replace(/\r/g, '').split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter((l, i, a) => l !== '' || i < a.length - 1).join('\n').trim();
  function readAnswer(el, q) {
    if (q.options) { const v = $$('input', el).filter(i => i.checked).map(i => +i.value); return q.type === 'msq' ? v : (v.length ? v[0] : null); }
    if (q.type === 'int') { const t = $('input.num', el).value.trim(); return t === '' ? null : t; }
    if (q.type === 'write') return $('textarea', el).value;
    const t = $('textarea.txt', el); return t ? (t.value.trim() === '' ? null : t.value) : null;
  }
  function grade(q, a) {
    if (a === null || a === undefined || (Array.isArray(a) && !a.length)) return null;
    if (q.type === 'msq') { const want = [].concat(q.answer).sort().join(','); return a.slice().sort().join(',') === want; }
    if (q.options) return a === q.answer;
    if (q.type === 'int') { const v = parseFloat(String(a).replace(/,/g, '')); if (!isFinite(v)) return false; const tol = q.tol !== undefined ? q.tol : 1e-6; return Math.abs(v - Number(q.answer)) <= tol + 1e-12; }
    if (q.type === 'write') return null;
    return [].concat(q.answer).some(ans => norm(ans) === norm(a));
  }
  function showSol(el, q, ok) {
    const sol = $('.sol', el); sol.innerHTML = solHTML(q); sol.classList.remove('hidden'); typeset(sol);
    if (q.options) { const ans = [].concat(q.answer); $$('.opts label', el).forEach(l => { const i = +l.dataset.i; l.classList.toggle('right', ans.includes(i)); const inp = $('input', l); l.classList.toggle('wrong', inp.checked && !ans.includes(i)); }); }
    const v = $('.verdict', el);
    if (ok === true) { v.textContent = '✓ Correct'; v.className = 'verdict ok'; }
    else if (ok === false) { v.textContent = '✗ Not quite — read the solution'; v.className = 'verdict no'; }
  }
  function record(q, ok) { if (ok === null) return; const r = S.q[q.id] || { a: 0, c: 0 }; r.a++; if (ok) r.c++; r.last = ok; S.q[q.id] = r; save(); }

  /* Pyodide (online only). Offline: reference solution is still available via Reveal. */
  let pyP = null;
  function getPy() {
    if (!pyP) pyP = new Promise((res, rej) => {
      if (window.loadPyodide) { loadPyodide().then(res, rej); return; }
      const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js';
      s.onload = () => loadPyodide().then(res, rej); s.onerror = () => { pyP = null; rej(new Error('Pyodide could not be downloaded (you are probably offline).')); };
      document.head.appendChild(s);
    });
    return pyP;
  }
  async function runPy(code, outEl) {
    outEl.classList.remove('hidden'); outEl.textContent = 'Loading Python in your browser (first run downloads ~10 MB)…';
    let py; try { py = await getPy(); } catch (e) { outEl.textContent = 'Offline: ' + e.message + '\nUse "Reveal reference solution" and compare with your code, or run the .py file from aml-practice/ on your computer.'; return { ok: false, offline: true }; }
    let out = ''; py.setStdout({ batched: s => out += s + '\n' }); py.setStderr({ batched: s => out += s + '\n' });
    try { await py.loadPackagesFromImports(code); await py.runPythonAsync(code); outEl.textContent = out || '(no output)'; return { ok: true, out }; }
    catch (e) { outEl.textContent = out + '\n' + String(e.message || e); return { ok: false, out }; }
  }
  function bindQ(root) {
    root.addEventListener('click', async ev => {
      const btn = ev.target.closest('button[data-act]'); if (!btn) return;
      const el = btn.closest('.q'); const c = ctxs[el.dataset.qid]; if (!c) return; const q = c.q, mode = c.mode, onAns = c.onRun;
      if (btn.dataset.act === 'check') { const a = readAnswer(el, q); const ok = grade(q, a); if (ok === null) { $('.verdict', el).textContent = 'Attempt first, then check.'; $('.verdict', el).className = 'verdict no'; return; } record(q, ok); showSol(el, q, ok); refreshCounters(); }
      if (btn.dataset.act === 'reveal') { if (!confirm('Reveal the answer? Try it first — it sticks much better.')) return; showSol(el, q, undefined); }
      if (btn.dataset.act === 'run') { const code = readAnswer(el, q) + '\n\n' + (q.tests || '') + '\nprint("ALL TESTS PASSED")'; const r = await runPy(code, $('.runout', el)); const ok = r.ok && /ALL TESTS PASSED/.test(r.out || ''); if (!r.offline) { if (mode === 'practice') { record(q, ok); showSol(el, q, ok); refreshCounters(); } else if (onAns) onAns(q, ok ? 'PASS' : 'FAIL'); } }
    });
  }
  function renderQs(list, mode, startN = 1, onRun) { return list.map((q, i) => { ctxs[q.id] = { q, mode, onRun }; return qShell(q, startN + i, mode); }).join(''); }
  function refreshCounters() { $$('[data-counter]').forEach(el => { const ids = el.dataset.counter.split(','); const att = ids.filter(id => S.q[id]).length, cor = ids.filter(id => S.q[id] && S.q[id].last).length; el.textContent = `${cor} correct · ${att}/${ids.length} attempted`; }); }

  /* ---------------- plots, code, derivations ---------------- */
  function plotHTML(p) {
    let svg = ''; try { svg = PL.svgOf(p.spec); } catch (e) { svg = `<p class="weak">Plot error: ${esc(e.message)}</p>`; console.error(p.id, e); }
    return `<figure class="plot" id="plot-${esc(p.id)}" data-plot="${esc(p.id)}"><div class="ptitle">${md(p.title).replace(/^<p>|<\/p>\s*$/g, '')}</div>${svg}${p.notice ? `<div class="notice">${md(p.notice).replace(/^<p>|<\/p>\s*$/g, '')}</div>` : ''}</figure>`;
  }
  function codeHTML(c) {
    const tabs = [];
    if (c.scratch) tabs.push(['From scratch (NumPy)', c.scratch]);
    if (c.lib) tabs.push([c.libLabel || 'scikit-learn / statsmodels', c.lib]);
    (c.more || []).forEach(m => tabs.push(m));
    const panes = tabs.map((t, i) => { const f = window.CODE[t[1]]; const body = f ? `<div class="fname">aml-practice/${esc(t[1])}</div><pre><code>${esc(f.code)}</code></pre><div class="outlabel">Output (from actually running the file)</div><pre class="output"><code>${esc(f.output)}</code></pre>` : `<p class="weak">Missing code file ${esc(t[1])} — run tools/build_code.py</p>`; return `<div class="pane${i ? ' hidden' : ''}" data-pane="${i}">${body}</div>`; }).join('');
    return `<div class="codeblock"><h4>${esc(c.title || 'Code')}</h4>${c.note ? md(c.note) : ''}<div class="tabs">${tabs.map((t, i) => `<button data-tab="${i}" class="${i ? '' : 'on'}">${esc(t[0])}</button>`).join('')}</div>${panes}</div>`;
  }
  function derivHTML(d) {
    return `<div class="deriv" id="der-${esc(d.id)}" data-deriv="${esc(d.id)}"><h4>${esc(d.title)} ${d.badge ? badges(d.badge) : ''}</h4>${d.intro ? md(d.intro) : ''}<ol>${d.steps.map(s => `<li>${s.m ? tex(s.m) : ''}${s.t ? md(s.t) : ''}${s.why ? `<div class="why">${md(s.why).replace(/^<p>|<\/p>\s*$/g, '')}</div>` : ''}</li>`).join('')}</ol>${d.result ? `<div class="final">${tex('\\boxed{' + d.result + '}')}</div>` : ''}${d.after ? md(d.after) : ''}</div>`;
  }
  function formulaHTML(fs) {
    return `<table class="ftable"><thead><tr><th>Formula</th><th>Symbols & units</th><th>When to use</th></tr></thead><tbody>${fs.map(f => `<tr><td>${f.name ? `<b>${esc(f.name)}</b><br>` : ''}$${esc(f.tex)}$</td><td>${md(f.sym || '')}</td><td>${md(f.when || '')}</td></tr>`).join('')}</tbody></table>`;
  }
  function bindTabs(root) { root.addEventListener('click', ev => { const b = ev.target.closest('.tabs button'); if (!b) return; const cb = b.closest('.codeblock'); $$('.tabs button', cb).forEach(x => x.classList.toggle('on', x === b)); $$('.pane', cb).forEach(p => p.classList.toggle('hidden', p.dataset.pane !== b.dataset.tab)); }); }

  function unitHTML(u, l) {
    const sec = (title, inner) => inner ? `<div class="sec"><div class="sec-title">${title}</div>${inner}</div>` : '';
    const qids = (u.questions || []).map(q => q.id).join(',');
    return `<section class="card unit" id="u-${esc(u.id)}" data-unit="${esc(u.id)}">
      <div class="unit-head"><h2>${esc(u.id)} · ${esc(u.title)}</h2>
        <label class="donebox"><input type="checkbox" data-done="${esc(u.id)}" ${S.done[u.id] ? 'checked' : ''}> Mark as done</label></div>
      <div class="unit-meta">${badges(u.badge)} ${u.pages ? `· Worksheet pages ${esc(u.pages)}` : ''} ${u.ws ? `· ${esc(u.ws)}` : ''}</div>
      ${sec('Concept', md(u.concept))}
      ${sec('Derivation' + ((u.deriv || []).length > 1 ? 's' : '') + ' — every step', (u.deriv || []).map(derivHTML).join(''))}
      ${sec('Formula sheet', (u.formulas || []).length ? formulaHTML(u.formulas) : '')}
      ${sec('Plots & diagrams', (u.plots || []).map(plotHTML).join(''))}
      ${sec('Worked examples (solved by hand)', (u.examples || []).map(e => `<h4>${esc(e.title)}</h4>${md(e.body)}`).join(''))}
      ${sec('Code — from scratch and with libraries', (u.code || []).map(codeHTML).join(''))}
      ${sec('Exam traps & common mistakes', (u.traps || []).length ? `<ul>${u.traps.map(t => `<li>${md(t).replace(/^<p>|<\/p>\s*$/g, '')}</li>`).join('')}</ul>` : '')}
      ${u.researched ? sec('⚠ Not covered in class – researched (lower priority)', `<div class="box res">${md(u.researched)}</div>`) : ''}
      ${sec(`Practice set <span class="small muted" data-counter="${esc(qids)}"></span>`, renderQs(u.questions || [], 'practice'))}
      ${u.source ? `<div class="source"><b>Source:</b> ${md(u.source).replace(/^<p>|<\/p>\s*$/g, '')}</div>` : ''}
    </section>`;
  }

  /* ---------------- pages ---------------- */
  const main = () => $('#main');
  function page(html) { const m = main(); m.innerHTML = html; typeset(m); refreshCounters(); m.focus({ preventScroll: true }); }

  function pageHome() {
    const units = allUnits(), done = units.filter(u => S.done[u.id]).length, qs = Object.values(S.q), att = qs.length, cor = qs.filter(r => r.last).length;
    const nq = units.reduce((s, u) => s + (u.questions || []).length, 0);
    page(`<h1>AML exam prep — Lectures 0 to 15</h1>
      <p>Built from your 16 class worksheets, the Lecture 10 class note and 4 whiteboards. The exam has only <b>MCQs, numerical answers and Python coding</b>, so every unit teaches the concept (for MCQs), the formula and hand calculation (for numericals), and the code (from scratch and with libraries).</p>
      <div class="grid2">
        <div class="stat"><div class="small muted">Units marked done</div><div class="big">${done}/${units.length}</div><div class="bar"><i style="width:${units.length ? 100 * done / units.length : 0}%"></i></div></div>
        <div class="stat"><div class="small muted">Practice questions</div><div class="big">${cor}/${att}</div><div class="small muted">correct / attempted (of ${nq} in lectures)</div></div>
        <div class="stat"><div class="small muted">Mocks</div><div class="big">${Object.keys(S.mocks).length}/2</div><div class="small muted">submitted</div></div>
      </div>
      <h2>How to use this site</h2>
      <ol><li>Follow the <a href="#/plan">7-day plan</a> (1.5–2 h per day).</li>
      <li>In each lecture, read <i>Concept → Derivation → Formula sheet → Worked examples → Code</i>, then do the practice set. Answers stay hidden until you press <b>Check</b> or <b>Reveal</b>.</li>
      <li>Numerical questions tell you the rounding and accept a small tolerance.</li>
      <li>Coding questions run Python in your browser (Pyodide) when you are online. Offline, reveal the reference solution, or run the same file from <span class="kbd">aml-practice/</span>.</li>
      <li>Do the <a href="#/int-drill">Integer drill</a> and <a href="#/code-drill">Code drill</a> on days 4–5, <a href="#/mock/1">Mock 1</a> on day 6, <a href="#/mock/2">Mock 2</a> plus weak topics on day 7, and the <a href="#/revision">last-night sheet</a> before the exam.</li></ol>
      <h2>Source badges</h2><p>${badges('class')} came from the class worksheet. ${badges('board')} came from your teacher's whiteboard or class note. ${badges('res')} is an exam-relevant topic the worksheets do not cover — study it last. ${badges('extra')} is a helpful addition beyond the worksheet.</p>
      <h2>Lectures</h2><ul class="toc">${lecs().map(l => `<li><a href="#/lec/${l.num}">L${l.num} — ${esc(l.title)}</a> <span class="small muted">(${l.units.length} units)</span></li>`).join('')}</ul>`);
  }

  function pageLecture(n, unitId) {
    const l = lecById(n); if (!l) return page('<h1>Lecture not found</h1>');
    const done = l.units.filter(u => S.done[u.id]).length;
    const prev = lecById(+n - 1), next = lecById(+n + 1);
    page(`<h1>Lecture ${l.num} — ${esc(l.title)}</h1>
      <div class="unit-meta">Source file: <span class="kbd">${esc(l.file)}</span> · ${l.pages} pages ${l.extraFiles ? '· also ' + esc(l.extraFiles) : ''}</div>
      ${md(l.intro || '')}
      <div class="card"><b>Units in this lecture</b> <span class="small muted">(${done}/${l.units.length} done)</span><div class="bar" style="margin:6px 0 8px"><i style="width:${100 * done / l.units.length}%"></i></div>
      <ol class="toc">${l.units.map(u => `<li><a href="#/lec/${l.num}/${u.id}">${esc(u.id)} ${esc(u.title)}</a> ${S.done[u.id] ? '✅' : ''} ${[].concat(u.badge || 'class').includes('res') ? '<span class="badge res">researched</span>' : ''}</li>`).join('')}</ol></div>
      ${l.units.map(u => unitHTML(u, l)).join('')}
      <div class="actions">${prev ? `<a class="btn ghost" href="#/lec/${prev.num}">← L${prev.num}</a>` : ''}${next ? `<a class="btn" href="#/lec/${next.num}">L${next.num} →</a>` : ''}</div>`);
    if (unitId) { const el = document.getElementById('u-' + unitId); if (el) setTimeout(() => el.scrollIntoView(), 30); } else window.scrollTo(0, 0);
  }

  function pageDrill(kind) {
    const list = kind === 'int' ? EXTRA.intDrill : EXTRA.codeDrill; prepQs(list, kind === 'int' ? 'INT' : 'CODE');
    const ids = list.map(q => q.id).join(',');
    page(`<h1>${kind === 'int' ? '🔢 Integer / numerical drill' : '💻 Code drill'}</h1>
      <p>${kind === 'int' ? 'Quick numerical questions covering every formula in the course. Work on paper, type the answer, then press <b>Check</b>. The full working appears after you check.' : 'Predict-the-output, find-the-bug and fill-the-line questions. Every snippet was actually run in Python, so the expected output is exact.'}</p>
      <p class="small muted" data-counter="${esc(ids)}"></p>
      ${renderQs(list, 'practice')}`);
    window.scrollTo(0, 0);
  }

  /* ----- mocks ----- */
  const MOCK = {}; // runtime state
  function pageMock(n) {
    const m = EXTRA.mocks[n]; if (!m) return page('<h1>Mock not found</h1>');
    m.sections.forEach(sec => prepQs(sec.questions, 'M' + n + sec.name));
    const st = MOCK[n] || (MOCK[n] = { started: false, submitted: false, answers: {}, codeRuns: {} });
    const total = m.sections.reduce((s, sec) => s + sec.questions.reduce((t, q) => t + (q.marks || sec.marks || 1), 0), 0);
    const prev = S.mocks[n];
    if (!st.started) {
      page(`<h1>📝 ${esc(m.title)}</h1>${md(m.intro || '')}
        <table><tr><th>Section</th><th>Questions</th><th>Marks each</th><th>Type</th></tr>${m.sections.map(s => `<tr><td>${esc(s.name)}</td><td>${s.questions.length}</td><td>${s.marks}</td><td>${esc(s.desc)}</td></tr>`).join('')}<tr><th>Total</th><th>${m.sections.reduce((a, s) => a + s.questions.length, 0)}</th><th>${total} marks</th><th>${m.minutes} minutes</th></tr></table>
        <ul><li>Answers stay hidden until you press <b>Submit paper</b>, or the timer reaches zero.</li><li>MSQ = all correct options must be chosen (no partial marks). Numerical answers accept the stated tolerance.</li><li>Coding: predict-output, debug and fill-in questions are auto-marked. For write-from-scratch questions, run the tests in the browser (online); offline, you self-mark against the reference after submitting.</li><li>No negative marking (change this in your head if your exam has it).</li></ul>
        ${prev ? `<p class="small">Last attempt: <b>${prev.score}/${prev.total}</b> on ${esc(prev.date)}.</p>` : ''}
        <button class="btn" id="startMock">Start the ${m.minutes}-minute timer</button>`);
      $('#startMock').onclick = () => { st.started = true; st.end = Date.now() + m.minutes * 60000; pageMock(n); };
      return;
    }
    let qn = 1, html = `<h1>📝 ${esc(m.title)}</h1><div class="timer"><span>Time left</span><span class="clock" id="clock">--:--</span><button class="btn" id="submitMock" ${st.submitted ? 'disabled' : ''}>Submit paper</button><span id="mockScore" class="small"></span></div><div id="mockResult"></div>`;
    const onRun = (q, res) => { st.codeRuns[q.id] = res; };
    m.sections.forEach(sec => { sec.questions.forEach(q => { q.marks = q.marks || sec.marks; }); html += `<h2>Section ${esc(sec.name)} — ${esc(sec.desc)}</h2>` + renderQs(sec.questions, 'mock', qn, onRun); qn += sec.questions.length; });
    page(html);
    const tick = () => { if (st.submitted) return; const left = Math.max(0, st.end - Date.now()), mm = Math.floor(left / 60000), ss = Math.floor(left % 60000 / 1000); const c = $('#clock'); if (!c) return clearInterval(st.timer); c.textContent = `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`; c.classList.toggle('low', left < 5 * 60000); if (left <= 0) submit(true); };
    clearInterval(st.timer); st.timer = setInterval(tick, 1000); tick();
    $('#submitMock').onclick = () => { if (confirm('Submit the paper now?')) submit(false); };
    function submit(auto) {
      if (st.submitted) return; st.submitted = true; clearInterval(st.timer);
      let score = 0; const per = {}; const selfQ = [];
      m.sections.forEach(sec => sec.questions.forEach(q => {
        const el = document.getElementById('q-' + q.id); const a = readAnswer(el, q); let ok;
        if (q.type === 'write') { ok = st.codeRuns[q.id] === 'PASS' ? true : (st.codeRuns[q.id] === 'FAIL' ? false : null); if (ok === null) selfQ.push(q); }
        else ok = grade(q, a) === true;
        const mk = q.marks || sec.marks || 1; const L = 'L' + q.lec; per[L] = per[L] || { got: 0, max: 0, n: 0, ok: 0 }; per[L].max += mk; per[L].n++;
        if (ok) { score += mk; per[L].got += mk; per[L].ok++; }
        showSol(el, q, ok === null ? undefined : ok);
        if (ok === null) { const sv = document.createElement('div'); sv.className = 'actions'; sv.innerHTML = `<b>Self-mark:</b> <button class="btn small" data-self="1">I got it right (+${mk})</button><button class="btn ghost small" data-self="0">I did not</button>`; el.appendChild(sv); sv.addEventListener('click', e => { const b = e.target.closest('button[data-self]'); if (!b || sv.dataset.doneSelf) return; sv.dataset.doneSelf = 1; if (b.dataset.self === '1') { score += mk; per[L].got += mk; per[L].ok++; } sv.innerHTML = b.dataset.self === '1' ? '✓ self-marked correct' : '✗ self-marked wrong'; finish(); }); }
      }));
      $('#submitMock').disabled = true; $('#clock').textContent = auto ? 'TIME UP' : 'SUBMITTED';
      function finish() {
        const rows = Object.keys(per).sort((a, b) => +a.slice(1) - +b.slice(1)).map(L => { const p = per[L], pct = Math.round(100 * p.got / p.max); return `<tr><td>${L} ${esc((lecById(+L.slice(1)) || {}).short || '')}</td><td>${p.ok}/${p.n}</td><td>${p.got}/${p.max}</td><td class="${pct < 60 ? 'weak' : 'strong'}">${pct}%</td></tr>`; }).join('');
        const weak = Object.keys(per).filter(L => per[L].got / per[L].max < 0.6);
        $('#mockResult').innerHTML = `<div class="card"><h2>Score: ${score} / ${total} (${Math.round(100 * score / total)}%)</h2>${selfQ.length ? `<p class="small muted">${selfQ.length} coding question(s) still need self-marking (buttons under each). The score updates when you mark them.</p>` : ''}<table><tr><th>Lecture</th><th>Questions right</th><th>Marks</th><th>%</th></tr>${rows}</table>${weak.length ? `<p class="weak">Weak topics — revise these first: ${weak.map(L => `<a href="#/lec/${L.slice(1)}">${L}</a>`).join(', ')}</p>` : '<p class="strong">No weak lecture (all ≥ 60%). Great!</p>'}</div>`;
        $('#mockScore').textContent = `Score ${score}/${total}`;
        S.mocks[n] = { score, total, date: new Date().toLocaleString(), per }; save();
      }
      finish(); window.scrollTo(0, 0);
    }
    if (st.submitted) { st.submitted = false; submit(false); }
  }

  function pageProgress() {
    const rows = lecs().map(l => { const d = l.units.filter(u => S.done[u.id]).length; const ids = l.units.flatMap(u => (u.questions || []).map(q => q.id)); const att = ids.filter(i => S.q[i]).length, cor = ids.filter(i => S.q[i] && S.q[i].last).length; return `<tr><td><a href="#/lec/${l.num}">L${l.num} ${esc(l.short || l.title)}</a></td><td>${d}/${l.units.length}</td><td>${cor}/${att} <span class="small muted">of ${ids.length}</span></td><td>${att ? Math.round(100 * cor / att) + '%' : '–'}</td></tr>`; }).join('');
    const mocks = Object.entries(S.mocks).map(([k, v]) => `<li>Mock ${k}: <b>${v.score}/${v.total}</b> (${esc(v.date)})</li>`).join('') || '<li>No mock submitted yet.</li>';
    page(`<h1>📈 Progress</h1><p class="small muted">Saved in this browser (localStorage). It will not sync to other devices.</p>
      <table><tr><th>Lecture</th><th>Units done</th><th>Questions correct / attempted</th><th>Accuracy</th></tr>${rows}</table>
      <h2>Mocks</h2><ul>${mocks}</ul>
      <h2>Reset</h2><button class="btn ghost" id="resetAll">Reset all progress</button>`);
    $('#resetAll').onclick = () => { if (confirm('Erase all saved progress, scores and done-marks?')) { S = blank(); save(); sidebar(); pageProgress(); } };
  }

  function pageDoc(key) { const d = EXTRA[key]; if (!d) return page('<h1>Not found</h1>'); let h = `<h1>${esc(d.title)}</h1>` + md(d.body || ''); (d.blocks || []).forEach(b => { if (b.md) h += md(b.md); if (b.plot) h += plotHTML(b.plot); if (b.qs) { prepQs(b.qs, key.toUpperCase()); h += renderQs(b.qs, 'practice'); } if (b.code) h += codeHTML(b.code); }); page(h); window.scrollTo(0, 0); }

  /* ---------------- router ---------------- */
  function route() {
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    markActive(); $('#sidebar').classList.remove('open');
    switch (parts[0]) {
      case 'lec': return pageLecture(parts[1], parts[2]);
      case 'plan': return pageDoc('plan');
      case 'revision': return pageDoc('revision');
      case 'patterns': return pageDoc('patterns');
      case 'int-drill': return pageDrill('int');
      case 'code-drill': return pageDrill('code');
      case 'mock': return pageMock(parts[1]);
      case 'progress': return pageProgress();
      default: return pageHome();
    }
  }

  /* ---------------- global events ---------------- */
  document.addEventListener('change', e => { const cb = e.target.closest('input[data-done]'); if (cb) { S.done[cb.dataset.done] = cb.checked; if (!cb.checked) delete S.done[cb.dataset.done]; save(); sidebar(); } });
  bindQ(document.getElementById('main'));
  bindTabs(document.getElementById('main'));
  $('#menuBtn').onclick = () => $('#sidebar').classList.toggle('open');
  $('#printBtn').onclick = () => window.print();
  $('#themeBtn').onclick = () => { const cur = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); const nx = cur === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', nx); try { localStorage.setItem('amlprep.theme', nx); } catch (e) { } };
  window.addEventListener('hashchange', route);
  sidebar(); route();
  window.AMLAPP = { md, S: () => S };
})();
