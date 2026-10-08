Source of `../AML_MidSem_OneShot_Notes.pdf`.

The PDF is the concatenation of `p0_head.html` … `p9_tail.html`, rendered in headless Chromium with KaTeX.
To rebuild: copy `aml-exam-prep/vendor/katex` into this folder as `katex/`, then run
`NODE_PATH=$(npm root -g) node build.js "$PWD" out.pdf`.
Fonts: Kalam and Caveat (SIL Open Font License, Google Fonts).
