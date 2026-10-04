"""Find LaTeX written with single backslashes inside plain '...' or "..." JS strings in data/*.js.
JS silently drops an unknown escape ('\\mathbf' -> 'mathbf'), so KaTeX never sees the command.
Strings inside R`...` / `...` templates are fine (String.raw keeps backslashes).
Usage: python3 tools/lint_sources.py [files...]"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files = sys.argv[1:] or sorted(glob.glob(os.path.join(ROOT, "aml-exam-prep", "data", "*.js")))
bad = 0
for path in files:
    if path.endswith("code_bundle.js"):
        continue
    src = open(path, encoding="utf-8").read()
    i, n, line = 0, len(src), 1
    stack = []  # 'tpl' for template literal; '${' nesting is not used in data files
    while i < n:
        ch = src[i]
        if ch == "\n":
            line += 1
        if ch == "/" and src[i:i + 2] == "//" and not stack:
            j = src.find("\n", i); i = n if j < 0 else j; continue
        if ch == "/" and src[i:i + 2] == "/*" and not stack:
            j = src.find("*/", i); line += src[i:j].count("\n"); i = j + 2; continue
        if ch == "`":
            j = i + 1
            while j < n and src[j] != "`":
                if src[j] == "\\" and src[j + 1] == "`":
                    j += 2; continue
                j += 1
            line += src[i:j].count("\n"); i = j + 1; continue
        if ch in "'\"":
            q, j = ch, i + 1
            while j < n and src[j] != q:
                if src[j] == "\\":
                    nxt = src[j + 1]
                    if nxt.isalpha() and nxt not in "nrtbfvux0" or nxt in "{}()[],;: ":
                        print(f"{os.path.basename(path)}:{line}: lone backslash '\\{nxt}' in quoted string: {src[max(i, j - 25):j + 15]!r}")
                        bad += 1
                    elif re.match(r"n(abla|eq|u\b|ot\b|orm|ewline)|t(heta|au|imes|ext|ilde|frac|o\b)|b(ar|eta|oldsymbol|ig|egin)|f(rac)|r(ho|ight|angle)|v(ec|ar)", src[j + 1:j + 10]):
                        print(f"{os.path.basename(path)}:{line}: '\\{nxt}{src[j + 2]}' looks like LaTeX eaten by a JS escape: {src[max(i, j - 25):j + 15]!r}")
                        bad += 1
                    j += 2; continue
                if src[j] == "\n":
                    break
                j += 1
            i = j + 1; continue
        i += 1
print(f"{bad} problem(s)")
sys.exit(1 if bad else 0)
