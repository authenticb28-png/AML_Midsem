"""Verify the site data against COVERAGE.md and tick the Done column.

A unit gets ✅ when it is present in the site data with:
  - a concept explanation (at least 200 characters) and a source line,
  - a formula sheet, unless its COVERAGE row lists no formulas ("–"),
  - at least 5 practice questions,
  - every derivation ID and plot ID that its COVERAGE row lists,
  - every code file it links to present in data/code_bundle.js.
Otherwise it gets ☐, and the reason is printed.

It also checks the non-lecture pages (patterns, plan, revision, drills, mocks) and rewrites the
**Totals:** line of COVERAGE.md from the real counts.

Usage: python3 tools/verify.py            (updates COVERAGE.md in place)
       python3 tools/verify.py --dry-run  (report only)
Exit code 0 only when every unit and every page passes.
"""
import json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COV = os.path.join(ROOT, "COVERAGE.md")
dry = "--dry-run" in sys.argv

dump = os.path.join(tempfile.gettempdir(), "aml_dump_verify.json")
r = subprocess.run(["node", os.path.join(ROOT, "tools", "dump_data.js"), dump], capture_output=True, text=True)
print(r.stdout.strip())
if r.returncode != 0 or not os.path.exists(dump):
    print(r.stderr)
    sys.exit(2)
data = json.load(open(dump))
units = {u["id"]: u for lec in data["lectures"] for u in lec["units"]}
code_files = set(data["codeFiles"])
problems = [f"data load: {e}" for e in data["errors"]]

ROW = re.compile(r"^\| (L\d\d\.\d) \|")
lines = open(COV, encoding="utf-8").read().split("\n")
seen, ticked = set(), 0
for i, line in enumerate(lines):
    m = ROW.match(line)
    if not m:
        continue
    uid = m.group(1)
    seen.add(uid)
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    why = []
    u = units.get(uid)
    if not u:
        why.append("unit missing from site data")
    else:
        if len(u["concept"]) < 200:
            why.append("concept explanation too short")
        if not u["source"]:
            why.append("no source line")
        if cells[6] not in ("–", "-", "") and not u["formulas"]:
            why.append("no formula sheet")
        if len(u["questions"]) < 5:
            why.append(f"only {len(u['questions'])} questions")
        have_d = {d["id"] for d in u["deriv"]}
        have_p = {p["id"] for p in u["plots"]}
        for d in re.findall(r"D\d\d-[\w-]+", cells[4]):
            if d not in have_d:
                why.append(f"derivation {d} missing")
        for p in re.findall(r"P\d\d-[\w-]+", cells[5]):
            if p not in have_p:
                why.append(f"plot {p} missing")
        for c in u["code"]:
            for f in [c.get("scratch"), c.get("lib")] + [m[1] for m in c.get("more", [])]:
                if f and f not in code_files:
                    why.append(f"code file {f} not bundled")
    mark = "☐" if why else "✅"
    ticked += not why
    cells[-1] = mark
    lines[i] = "| " + " | ".join(cells) + " |"
    for w in why:
        problems.append(f"{uid}: {w}")

for uid in sorted(set(units) - seen):
    problems.append(f"{uid}: in site data but not listed in COVERAGE.md")

# non-lecture pages
docs = data.get("docs", {})
for key, minblocks in (("patterns", 3), ("plan", 1), ("revision", 3)):
    d = docs.get(key)
    if not d:
        problems.append(f"page '{key}' missing")
    elif len(d["body"]) + sum(len(b["md"]) for b in d["blocks"]) < 1500 or len(d["blocks"]) < minblocks:
        problems.append(f"page '{key}' looks incomplete")
if len(data.get("intDrill", [])) < 30:
    problems.append(f"integer drill has only {len(data.get('intDrill', []))} questions (want ≥ 30)")
if len(data.get("codeDrill", [])) < 20:
    problems.append(f"code drill has only {len(data.get('codeDrill', []))} questions (want ≥ 20)")
lecs_in = lambda qs: {q.get("lec") for q in qs}
for k in ("1", "2"):
    m = data.get("mocks", {}).get(k)
    if not m:
        problems.append(f"mock {k} missing")
        continue
    qs = [q for s in m["sections"] for q in s["questions"]]
    if any(q.get("lec") is None for q in qs):
        problems.append(f"mock {k}: some questions have no lecture tag")
    miss = set(range(16)) - lecs_in(qs)
    if miss:
        problems.append(f"mock {k}: lectures not covered {sorted(miss)}")
for name, qs in (("intDrill", data.get("intDrill", [])), ("codeDrill", data.get("codeDrill", []))):
    if any(q.get("lec") is None for q in qs):
        problems.append(f"{name}: some questions have no lecture tag")

# totals line
n_units = len(units)
n_der = sum(len(u["deriv"]) for u in units.values())
n_plots = len(data["plotInfo"])
n_q = sum(len(u["questions"]) for u in units.values())
n_extra = len(data.get("intDrill", [])) + len(data.get("codeDrill", [])) + sum(len(s["questions"]) for m in data.get("mocks", {}).values() for s in m["sections"]) + sum(len(b["qs"]) for d in docs.values() for b in d["blocks"])
n_prog = len([f for f in os.listdir(os.path.join(ROOT, "aml-practice")) if f.endswith(".py")])
totals = f"**Totals:** {n_units} teaching units · {n_der} derivation blocks · {n_plots} plots/diagrams · {n_q} lecture practice questions + {n_extra} in drills, mocks and the patterns page · {n_prog} practice programs."
lines = [totals if l.startswith("**Totals:**") else l for l in lines]

if not dry:
    open(COV, "w", encoding="utf-8").write("\n".join(lines))
print(f"units ticked: {ticked}/{len(seen)}")
print(totals)
print(f"{len(problems)} problem(s)")
for p in problems:
    print(" -", p)
sys.exit(1 if problems else 0)
