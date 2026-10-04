"""Check every lecture question mechanically.

- 'out' questions: run the code with Python and compare stdout with the stored answer (same whitespace
  normalisation as the site's grader).
- 'int' questions with a 'verify' expression: evaluate it and compare with the answer within the tolerance.
- options questions: answer indices in range, 'why' has one entry per option, MSQ answers are lists.
- every unit has >= 5 questions.

Usage: python3 tools/check_questions.py [lecture numbers...]
"""
import json, os, re, subprocess, sys, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
want = {int(a) for a in sys.argv[1:]}
dump = os.path.join(tempfile.gettempdir(), "aml_dump_check.json")
r = subprocess.run(["node", os.path.join(ROOT, "tools", "dump_data.js"), dump], capture_output=True, text=True)
print(r.stdout.strip())
data = json.load(open(dump))
problems = list(data["errors"])


def norm(s):
    lines = [re.sub(r"\s+", " ", l).strip() for l in str(s).replace("\r", "").split("\n")]
    return "\n".join(lines).strip()


def run_py(code):
    p = subprocess.run([sys.executable, "-W", "ignore", "-c", code], capture_output=True, text=True, timeout=120, cwd=tempfile.gettempdir())
    return p.stdout, p.stderr


def eval_verify(expr):
    # 'a; b; expr' -> exec everything but the last statement, eval the last
    parts = [x.strip() for x in expr.split(";")]
    env = {}
    for st in parts[:-1]:
        exec(st, env)
    return eval(parts[-1], env)


def check_q(q, where):
    t = q.get("type")
    if q.get("options") is not None:
        n = len(q["options"])
        ans = q["answer"] if isinstance(q["answer"], list) else [q["answer"]]
        if t == "msq" and not isinstance(q["answer"], list):
            problems.append(f"{where}: msq answer must be a list")
        if t == "mcq" and isinstance(q["answer"], list):
            problems.append(f"{where}: mcq answer must be an int")
        if any((not isinstance(a, int)) or a < 0 or a >= n for a in ans):
            problems.append(f"{where}: answer index out of range")
        if q.get("why") and len(q["why"]) != n:
            problems.append(f"{where}: why has {len(q['why'])} entries for {n} options")
    if t == "out":
        out, err = run_py(q["code"])
        answers = q["answer"] if isinstance(q["answer"], list) else [q["answer"]]
        if not any(norm(a) == norm(out) for a in answers):
            problems.append(f"{where}: OUTPUT MISMATCH\n  expected: {answers[0]!r}\n  got:      {out!r}\n  stderr:   {err[-300:]!r}")
    if t == "int":
        if "verify" in q:
            try:
                v = float(eval_verify(q["verify"]))
                tol = q.get("tol", 1e-6)
                if abs(v - float(q["answer"])) > tol + 1e-9:
                    problems.append(f"{where}: INT MISMATCH answer={q['answer']} verify={v} (tol {tol})")
            except Exception as e:  # noqa
                problems.append(f"{where}: verify error {e}")
        else:
            problems.append(f"{where}: int question without verify")


nq = 0
for lec in data["lectures"]:
    if want and lec["num"] not in want:
        continue
    for u in lec["units"]:
        if len(u["questions"]) < 5:
            problems.append(f"{u['id']}: only {len(u['questions'])} questions")
        for i, q in enumerate(u["questions"]):
            nq += 1
            check_q(q, f"{u['id']}.q{i + 1}")
for key in ["intDrill", "codeDrill"]:
    if not want:
        for i, q in enumerate(data.get(key, [])):
            nq += 1
            check_q(q, f"{key}.{i + 1}")
if not want:
    for k, m in data.get("mocks", {}).items():
        for s in m["sections"]:
            for i, q in enumerate(s["questions"]):
                nq += 1
                check_q(q, f"mock{k}.{s['name']}.{i + 1}")

print(f"checked {nq} questions, {len(problems)} problem(s)")
for p in problems:
    print(" -", p)
sys.exit(1 if problems else 0)
