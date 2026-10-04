/* Lecture 0 — Setting the Foundation: from code to learning */
LECTURES.push({
  num: 0, short: 'Foundations', title: 'Foundations — Traditional Code vs AI, ML & DL; Data, Learning Strategies, Core Tasks',
  file: 'AML_Lecture 0_Worksheet_Filled.pdf', pages: 10,
  intro: R`**Exam weight:** low on maths, but easy MCQ marks. Learn the *definitions*, the **Data + Answers → Rules** flip, the four learning paradigms and the three task types. Spend about 30 minutes here.`,
  units: [
  /* ---------------------------------------------------------------- L00.1 */
  {
    id: 'L00.1', title: 'Traditional programming and the paradigm flip', badge: 'class', pages: '1–3', ws: 'Parts 1 and 3',
    concept: R`
:::hook Hook (worksheet)
You write a spam filter with rules: block emails containing 'FREE', 'WINNER', 'CRYPTO'. It works until spammers write 'FR33' or 'W1NNER'. You patch it, they change again. What is the *structural* problem?
:::

**Traditional programming** is a paradigm in which human engineers manually write explicit logical rules to process input data and produce outputs.

*Analogy:* it is a rigid cookbook recipe. The developer must understand the whole problem, every rule, every edge case and every branch, and dictate them to the computer. The computer only executes; it has zero autonomy.

**Why it fails in the real world.** When a spammer changes "FREE" to "F-R-E-E" or "FR33", the code breaks. To fix it you edit the source, add another \`if-else\`, and recompile. Traditional programs are **structurally rigid ("set in stone")**: when the environment shifts (unusual weather in a logistics system, new user slang), the program cannot adapt.

:::reflect Reflect — "structurally rigid, set in stone" means…
The behaviour is fixed at the moment the rules are written. Any new pattern the programmer did not foresee is handled wrongly until a human edits the code again. The program cannot change its own rules from new data.
:::

:::key Key insight
Traditional programs cannot adapt dynamically; they need manual intervention every time the world shifts. This rigidity is the core motivation for Machine Learning.
:::

**The paradigm flip (Part 3).**

| Traditional programming | Machine learning |
|---|---|
| Input: **Data + Rules** → Output: **Answers** | Input: **Data + Answers** → Output: **Rules** |

Instead of writing the rules, give the computer 50,000 real emails *and* 50,000 spam emails (data **with** answers) and let it *learn* what makes them different. The learned "rules" are the model.

:::take Takeaway
Traditional programming: Data + Rules → Answers (hard-coded, rigid, breaks when the world changes). ML: Data + Answers → Rules (the algorithm discovers the patterns; humans supply examples).
:::`,
    formulas: [
      { name: 'Traditional programming', tex: R`\text{Data} + \text{Rules} \;\longrightarrow\; \text{Answers}`, sym: 'Rules are written by a human.', when: 'Problem is fully understood and stable (tax calculation, sorting).' },
      { name: 'Machine learning (training)', tex: R`\text{Data} + \text{Answers} \;\longrightarrow\; \text{Rules (model)}`, sym: 'Answers = labels / targets; Rules = learned parameters.', when: 'Rules are too many, fuzzy, or keep changing (spam, fraud, speech).' },
      { name: 'Machine learning (use)', tex: R`\text{New data} + \text{Model} \;\longrightarrow\; \text{Prediction}`, sym: 'The learned model is applied to unseen inputs.', when: 'After training, at prediction time.' }
    ],
    plots: [
      { id: 'P00-trad-flow', title: 'Traditional programming: the human supplies the rules', notice: 'Both Rules and Data are *inputs*. The only output is the answer, so nothing is learned.',
        spec: { type: 'flow', w: 600, h: 170, nodes: [
          { id: 'r', x: 90, y: 50, w: 140, h: 40, t: 'Rules / Logic', c: 's2' }, { id: 'd', x: 90, y: 120, w: 140, h: 40, t: 'Data', c: 's2' },
          { id: 'p', x: 300, y: 85, w: 160, h: 70, t: 'Traditional\nProgramming', c: 's1', bold: true }, { id: 'a', x: 510, y: 85, w: 130, h: 44, t: 'Answers', c: 's3' }],
          edges: [{ a: 'r', b: 'p' }, { a: 'd', b: 'p' }, { a: 'p', b: 'a' }] } },
      { id: 'P00-ifelse', title: 'A hard-coded IF–ELSE rule (worksheet flowchart)', notice: 'Every branch is decided in advance. A case the programmer did not foresee ("FR33") falls into the wrong branch.',
        spec: { type: 'flow', w: 460, h: 260, nodes: [
          { id: 's', x: 230, y: 30, w: 70, h: 30, t: 'start', shape: 'round', c: 's7' },
          { id: 'q', x: 230, y: 105, w: 170, h: 70, t: 'contains\n"FREE"?', shape: 'diamond', c: 's1' },
          { id: 'b', x: 90, y: 190, w: 130, h: 40, t: 'B: mark spam', c: 's4' }, { id: 'c', x: 370, y: 190, w: 130, h: 40, t: 'C: inbox', c: 's3' },
          { id: 'e', x: 230, y: 240, w: 70, h: 30, t: 'end', shape: 'round', c: 's7' }],
          edges: [{ a: 's', b: 'q' }, { a: 'q', b: 'b', t: 'TRUE', dx: -14 }, { a: 'q', b: 'c', t: 'FALSE', dx: 14 }, { a: 'b', b: 'e' }, { a: 'c', b: 'e' }] } },
      { id: 'P00-flip', title: 'The paradigm flip: ML takes answers as input and outputs rules', notice: 'Training turns (data, answers) into a model. Prediction then uses the model on new data.',
        spec: { type: 'flow', w: 640, h: 200, nodes: [
          { id: 'd', x: 80, y: 50, w: 120, h: 38, t: 'Data', c: 's2' }, { id: 'a', x: 80, y: 120, w: 120, h: 38, t: 'Answers\n(labels)', c: 's2' },
          { id: 'ml', x: 270, y: 85, w: 150, h: 64, t: 'Machine\nLearning', c: 's5', bold: true }, { id: 'r', x: 450, y: 85, w: 130, h: 44, t: 'Rules = model', c: 's3' },
          { id: 'n', x: 450, y: 170, w: 130, h: 36, t: 'New data', c: 's7' }, { id: 'p', x: 590, y: 170, w: 90, h: 36, t: 'Prediction', c: 's1' }],
          edges: [{ a: 'd', b: 'ml' }, { a: 'a', b: 'ml' }, { a: 'ml', b: 'r' }, { a: 'r', b: 'p', dash: true }, { a: 'n', b: 'p' }] } }
    ],
    examples: [
      { title: 'Why the keyword filter breaks (worked)', body: R`Rules: spam if the email contains FREE, WINNER or CRYPTO.
- "Claim your FREE gift" → contains FREE → **spam** ✓
- "You are a W1NNER" → no rule matches → **inbox** ✗ (spam slips through)
- "Meeting at 5" → **inbox** ✓

To catch "W1NNER" a human must add a rule and redeploy, and the spammer can change it again. An ML filter trained on labelled emails learns *many weak signals* (sender, links, wording) and can be retrained automatically as new spam is labelled.` }
    ],
    traps: [
      'ML still needs **data + answers** for supervised learning; it does not remove the need for examples.',
      'The ML output of *training* is the **model (rules)**; the output of *prediction* is an answer. Do not mix up the two arrows.',
      'Traditional programming is not "wrong". It is the right choice when the rules are known and stable (Lecture 1: "can a SQL query solve it? then skip ML").'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Which statement best describes **traditional programming**?', options: ['Data + Answers → Rules', 'Data + Rules → Answers', 'Rules + Answers → Data', 'Data → Clusters'], answer: 1,
        sol: 'In traditional programming the human writes the rules, so the inputs are data and rules and the output is the answer.',
        why: ['This is the *ML* paradigm (it learns the rules).', 'Correct.', 'Nonsense: data is never the output.', 'This describes clustering, an unsupervised ML task.'] },
      { type: 'mcq', diff: 'E', q: 'In the machine-learning paradigm, what is the **output** of training?', options: ['Answers for the training emails', 'A set of learned rules (the model)', 'The raw data', 'A new list of if-else statements written by the programmer'], answer: 1,
        sol: 'ML: Data + Answers → **Rules**. The learned rules are the model, which is then applied to unseen data.',
        why: ['The answers were an *input* to training.', 'Correct.', 'Data is an input.', 'The point of ML is that a human does *not* write these rules.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** reasons the worksheet gives for why traditional programs fail in the real world.', options: ['They are structurally rigid ("set in stone")', 'They need manual code edits whenever the environment changes', 'They cannot run on modern computers', 'They cannot adapt dynamically to new patterns such as "FR33"'], answer: [0, 1, 3],
        sol: 'The worksheet says traditional programs are structurally rigid, need manual intervention and recompilation for every change, and cannot adapt dynamically.',
        why: ['Correct.', 'Correct: add another if-else and recompile.', 'False: they run fine; the problem is adaptability, not hardware.', 'Correct.'] },
      { type: 'out', diff: 'E', q: 'Predict the **exact output** (three lines).', code: R`def is_spam(email):
    banned = ["FREE", "WINNER", "CRYPTO"]
    return any(word in email.upper() for word in banned)

for e in ["Claim your FREE gift", "You are a W1NNER", "Meeting at 5"]:
    print(is_spam(e))`, answer: 'True\nFalse\nFalse',
        sol: R`\`email.upper()\` makes the check case-insensitive. Line 1 contains "FREE" → True. "W1NNER" uses the digit 1, so "WINNER" is **not** a substring → False. Line 3 has no banned word → False. This is exactly the rigidity the hook describes.` },
      { type: 'mcq', diff: 'M', q: 'Which problem is the **best fit for traditional programming** rather than ML?', options: ['Recognising handwritten digits', 'Computing income tax from a fixed government slab table', 'Detecting new fraud patterns at checkout', 'Understanding spoken commands'], answer: 1,
        sol: 'Tax slabs are explicit, fully known and stable rules, so you simply code them. The others involve fuzzy, changing patterns that are learned better from data.',
        why: ['Fuzzy visual patterns → ML (DL).', 'Correct: rules are known exactly.', 'Patterns change constantly → ML with retraining.', 'Speech is unstructured audio → DL.'] },
      { type: 'mcq', diff: 'E', q: 'According to the worksheet, what is the **core motivation** for the field of Machine Learning?', options: ['Computers are faster than humans', 'Traditional programs cannot adapt dynamically when the world shifts', 'Data is cheap to label', 'Neural networks are fashionable'], answer: 1,
        sol: 'Key insight of Part 1: the rigidity of traditional programs, which need manual intervention every time the world changes, is the core motivation for ML.',
        why: ['Speed is not the argument.', 'Correct.', 'Labelling is actually *expensive* (Part 5).', 'Not a reason given.'] }
    ],
    source: 'Worksheet L0 pp.1–3; Géron, *Hands-On ML* ch.1 ("Why use ML?").'
  },
  /* ---------------------------------------------------------------- L00.2 */
  {
    id: 'L00.2', title: 'AI ⊃ ML ⊃ DL, and structured vs unstructured data', badge: 'class', pages: '2–5', ws: 'Parts 2, 3, 4',
    concept: R`
:::hook Hook (Part 2)
If rigid code breaks when the real world gets messy, how do humans tell a spam email from a real one, even with a word they have never seen? What ability are we trying to give computers?
:::

**Artificial Intelligence (AI)** is the broad, overarching field of computer science dedicated to creating hardware and software that **mimic human-like intelligence**. Its goal is systems that independently reason, solve problems, perceive environments and make autonomous decisions *without a human hard-coding every scenario*. Humans use millions of flexible, fuzzy, pattern-based rules that they keep updating; AI aspires to that adaptability.

Key areas of modern AI (worksheet list): **search algorithms** (Google Maps/Uber routing through millions of routes), **LLMs** (coherent, context-aware text), **robotics** (physical agents that navigate the world), **NLP** (Siri/Google Assistant: audio → grammar → meaning → response), **game NPCs** that adapt to how you play, and **computer vision** (identify, track and classify objects using deep networks).

:::key Key insight
AI is the *aspiration*; ML is one of the primary *engines* used to achieve it. AI also includes **non-learning** systems such as search algorithms. So ML ⊂ AI, but AI ≠ ML.
:::

**Machine Learning (ML)** is a specialised **subset of AI** that develops mathematical models and algorithms that let computers **extract patterns and learn directly from data** instead of following explicit, hard-coded instructions. *Workflow:* analyse historical records (training data) → find implicit statistical relationships → build a generalised mathematical representation → apply it to new, unseen data. Classic examples: spam detection (retrained from billions of user "mark as spam" actions), stock-price prediction, and medical diagnostics from lab panels and vitals.

**Deep Learning (DL).** Standard ML is great for **structured data** (spreadsheets, clean databases; features such as square footage or number of bedrooms). It struggles with **unstructured raw data** (images, audio, long essays) because humans must first hand-engineer features (edges, shapes, frequency changes). Example: if a cat tilts its head, every pixel value changes.

*Brain analogy:* the first layer of neurons sees edges, and each later layer builds a more abstract representation.

**Deep Learning** is a highly specialised **subfield of ML** that uses **multi-layered artificial neural networks** to automatically discover, extract and optimise representations directly from raw, unstructured data. **"Deep"** refers to architecture: dozens or hundreds of stacked **hidden layers**.

What DL does (completed worksheet column): **image recognition** (self-driving cars find pedestrians, lane markings and stop signs frame by frame); **voice assistants** (strip background noise from the waveform, isolate the voice, transcribe the words).

:::key Key insight
DL solves the **feature-engineering bottleneck** of standard ML for unstructured data. Depth = many sequential hidden layers, each more abstract than the last.
:::

:::take Takeaway
DL ⊂ ML ⊂ AI. ML, Search, NLP, CV and Robotics are sub-domains inside AI. Depth = automatic hierarchical feature learning from raw unstructured data.
:::`,
    formulas: [
      { name: 'Nesting of fields', tex: R`\text{DL} \subset \text{ML} \subset \text{AI}`, sym: 'Every DL model is an ML model; every ML system is an AI system; not the other way round.', when: 'MCQs that ask "which is a subset of which" or "is search ML?".' },
      { name: 'Deep network (idea)', tex: R`\hat y = f_L(\dots f_2(f_1(\mathbf x)))`, sym: R`$f_\ell$ = one hidden layer; $L$ = depth.`, when: 'Explaining what "deep" means: many stacked layers.' }
    ],
    plots: [
      { id: 'P00-venn', title: 'Visualizing the ecosystem: AI ⊃ ML ⊃ DL', notice: 'Search algorithms sit inside AI but **outside** ML: AI includes non-learning systems.',
        spec: { type: 'svg', svg: () => PL.nested(['Artificial Intelligence', 'Machine Learning', 'Deep Learning'], ['search, robotics, NLP, CV, LLMs…', 'learns rules from data', 'many hidden layers, raw data']) } },
      { id: 'P00-nn', title: 'A deep (multi-layer) neural network', notice: 'Each hidden layer re-represents the previous one. More hidden layers means a "deeper" network.',
        spec: { type: 'svg', svg: () => PL.nn([4, 5, 5, 3], ['input layer', 'hidden 1', 'hidden 2', 'output']) } }
    ],
    examples: [
      { title: 'Classify each system (worked)', body: R`| System | AI? | ML? | DL? | Why |
|---|---|---|---|---|
| Google Maps shortest route (A* search) | ✓ | ✗ | ✗ | searches combinations; nothing is learned from labelled data |
| Gmail spam filter | ✓ | ✓ | maybe | learns from users' spam/inbox labels |
| Face unlock from camera pixels | ✓ | ✓ | ✓ | raw images → deep CNN learns features |
| House price from sq-ft and bedrooms | ✓ | ✓ | usually ✗ | structured table; standard ML is enough |` }
    ],
    traps: [
      '"AI = ML" is false: search algorithms and rule-based expert systems are AI without learning.',
      '"Deep" refers to the **number of hidden layers**, not the dataset size or how "intelligent" the model is.',
      'Structured data does not *need* DL; DL shines on unstructured data (images, audio, text).'
    ],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Which ordering of the fields is correct?', options: ['AI ⊂ ML ⊂ DL', 'DL ⊂ ML ⊂ AI', 'ML ⊂ DL ⊂ AI', 'DL ⊂ AI ⊂ ML'], answer: 1, sol: 'Deep learning is a subfield of ML, which is a subset of AI.', why: ['Reversed.', 'Correct.', 'DL is inside ML, not the reverse.', 'ML is inside AI.'] },
      { type: 'mcq', diff: 'M', q: 'A GPS app finds the shortest route with a graph-search algorithm and **no training data**. This is:', options: ['AI but not ML', 'ML but not AI', 'Deep learning', 'Neither AI nor ML'], answer: 0, sol: 'The worksheet lists search algorithms as an AI area. Nothing is learned from data, so it is not ML.', why: ['Correct.', 'Impossible: ML ⊂ AI.', 'No neural network or learning.', 'It is AI (an area listed in Part 2).'] },
      { type: 'mcq', diff: 'E', q: 'The word **"deep"** in deep learning refers to:', options: ['the size of the training set', 'many stacked hidden layers in the network', 'the depth of a decision tree', 'deep (fine) feature engineering by humans'], answer: 1, sol: '"Deep" refers to structural architecture: dozens or hundreds of sequential hidden layers.', why: ['Not the definition.', 'Correct.', 'Trees have depth too, but that is not DL.', 'The opposite: DL *removes* manual feature engineering.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** data that the worksheet calls **unstructured**, where standard ML struggles.', options: ['Images', 'Audio', 'Long essays', 'An Excel sheet of square footage and bedrooms'], answer: [0, 1, 2], sol: 'Images, audio and long text are unstructured; a clean table with named columns is structured.', why: ['Correct.', 'Correct.', 'Correct.', 'This is the worksheet example of *structured* data.'] },
      { type: 'mcq', diff: 'M', q: 'Which problem does deep learning solve for standard ML on unstructured data?', options: ['The need for labelled data', 'The feature-engineering bottleneck', 'Overfitting on small tables', 'The need for a loss function'], answer: 1, sol: 'Key insight of Part 4: DL automatically learns the features (edges → shapes → objects) that humans had to hand-craft for standard ML.', why: ['DL usually needs *more* labelled data.', 'Correct.', 'Deep nets overfit small tables more easily.', 'DL still minimises a loss.'] }
    ],
    source: 'Worksheet L0 pp.2–5; Goodfellow et al., *Deep Learning* ch.1; Géron ch.1.'
  },
  /* ---------------------------------------------------------------- L00.3 */
  {
    id: 'L00.3', title: 'Labelled vs unlabelled data', badge: 'class', pages: '5–6', ws: 'Part 5',
    concept: R`
:::hook Hook
Folder A: every pet image is tagged "cat" or "dog". Folder B: only images, no tags. How would you figure out what is in Folder B?
:::

Data comes in two fundamental formats depending on whether the **ground-truth answer** is attached. This decides which learning paradigm you can use.

- **Labelled data:** a set of input features **coupled with the explicit target outcome** (the correct answer, the ground truth).
- **Unlabelled data:** raw data with **only the input features**, no target tags, categories or outcomes.

**PRACTICE P3 (answered):** 50,000 emails tagged 'spam' / 'not spam' → **labelled**. 200,000 chest X-rays with no radiologist annotations → **unlabelled**.

:::reflect Reflect — why is labelled data expensive?
Labels need human domain experts. For example, a radiologist must study every X-ray and annotate tumours; lawyers must tag contracts; linguists must annotate sentences. Expert time is costly and slow, so large labelled sets are rare. This is why semi-supervised learning exists.
:::

:::key Key insight
The presence or absence of a ground-truth label decides the learning paradigm. Labelling needs human experts (radiologists, lawyers, linguists), which is costly and slow.
:::
:::take Takeaway
Labelled = input + correct answer. Unlabelled = input only.
:::`,
    formulas: [
      { name: 'Labelled dataset', tex: R`D = \{(\mathbf x_i, y_i)\}_{i=1}^{n}`, sym: R`$\mathbf x_i$ features, $y_i$ label (ground truth).`, when: 'Supervised learning (regression, classification).' },
      { name: 'Unlabelled dataset', tex: R`D = \{\mathbf x_i\}_{i=1}^{n}`, sym: 'Features only.', when: 'Unsupervised learning (clustering, PCA in L11).' }
    ],
    plots: [
      { id: 'P00-labelled', title: 'Folder A (labelled) vs Folder B (unlabelled)', notice: 'Same images in both folders. Only Folder A carries the ground-truth answer.',
        spec: { type: 'flow', w: 560, h: 210, nodes: [
          { id: 'A', x: 140, y: 30, w: 220, h: 34, t: 'Folder A — labelled', c: 's3', bold: true }, { id: 'B', x: 420, y: 30, w: 220, h: 34, t: 'Folder B — unlabelled', c: 's7', bold: true },
          { id: 'a1', x: 85, y: 95, w: 100, h: 44, t: '🐱 → "cat"', c: 's3' }, { id: 'a2', x: 195, y: 95, w: 100, h: 44, t: '🐶 → "dog"', c: 's3' },
          { id: 'a3', x: 85, y: 160, w: 100, h: 44, t: '🐱 → "cat"', c: 's3' }, { id: 'a4', x: 195, y: 160, w: 100, h: 44, t: '🐶 → "dog"', c: 's3' },
          { id: 'b1', x: 365, y: 95, w: 100, h: 44, t: '🐱 → ?', c: 's7' }, { id: 'b2', x: 475, y: 95, w: 100, h: 44, t: '🐶 → ?', c: 's7' },
          { id: 'b3', x: 365, y: 160, w: 100, h: 44, t: '🐱 → ?', c: 's7' }, { id: 'b4', x: 475, y: 160, w: 100, h: 44, t: '🐶 → ?', c: 's7' }], edges: [] } }
    ],
    examples: [{ title: 'Spot the label (worked)', body: R`Dataset: house rows with \`area, bedrooms, city, sale_price\`. If the task is "predict sale price", then \`sale_price\` is the **label** and the other three are features, so this is a labelled dataset. The **same table without** \`sale_price\` is unlabelled. You could still cluster it into neighbourhood types, but you cannot learn to predict price.` }],
    traps: ['A column becomes a "label" only relative to the task. The same column can be a feature in another task.', 'Unlabelled does not mean useless: clustering, PCA and self-supervised pre-training use it.'],
    questions: [
      { type: 'mcq', diff: 'E', q: '200,000 chest X-rays **without** radiologist annotations form a ___ dataset.', options: ['labelled', 'unlabelled', 'semi-structured', 'time-series'], answer: 1, sol: 'No ground-truth target is attached, so it is unlabelled (PRACTICE P3).', why: ['There is no annotation.', 'Correct.', 'Structure type is a different axis (L1).', 'Not indexed by time.'] },
      { type: 'mcq', diff: 'E', q: 'What makes data "labelled"?', options: ['It is stored in a database table', 'Each input is paired with the correct target outcome', 'It has been scaled', 'It contains no missing values'], answer: 1, sol: 'Labelled = input features + explicit target (ground truth).', why: ['Storage format is unrelated.', 'Correct.', 'Scaling is preprocessing (L1).', 'Missing values are a quality issue, not labelling.'] },
      { type: 'mcq', diff: 'M', q: 'Why is labelled data **expensive**, according to the worksheet?', options: ['Disk space is costly', 'Labels require human domain experts (radiologists, lawyers, linguists)', 'Labelled data cannot be compressed', 'Algorithms run slower on labels'], answer: 1, sol: 'Expert human time is the bottleneck, which is why semi-supervised learning is practical.', why: ['Storage is cheap.', 'Correct.', 'Irrelevant.', 'Irrelevant.'] },
      { type: 'msq', diff: 'M', q: 'Which tasks can be done with **only unlabelled** data? (select all)', options: ['Clustering customers into segments', 'Predicting each customer\'s exact spend next month', 'Reducing 50 features to 2 with PCA', 'Classifying emails as spam/not spam from scratch'], answer: [0, 2], sol: 'Clustering and PCA are unsupervised and need no target. Predicting spend or spam requires labels to learn the mapping.', why: ['Correct.', 'Regression needs past spend values as labels.', 'Correct (L11).', 'Supervised classification needs spam labels.'] },
      { type: 'int', diff: 'E', q: 'A dataset has 10,000 images. A radiologist labels 2% of them. How many images remain **unlabelled**?', answer: 9800, tol: 0, round: 'Exact integer', verify: '10000 - 0.02*10000',
        sol: 'Labelled = 0.02 × 10,000 = 200. Unlabelled = 10,000 − 200 = **9,800**. This "small labelled + huge unlabelled" mix is exactly the setting for semi-supervised learning (next unit).' }
    ],
    source: 'Worksheet L0 pp.5–6; ISLR §2.1.4 (supervised vs unsupervised).'
  },
  /* ---------------------------------------------------------------- L00.4 */
  {
    id: 'L00.4', title: 'Four learning paradigms (+ self-supervised)', badge: ['class', 'res'], pages: '7–8', ws: 'Part 6',
    concept: R`
:::hook Hook
A parent points at a ball and says "Ball" (teacher-guided). The same child, alone on a playground, groups toys by shape (self-discovery). A game AI gets +10 for winning and −5 for crashing (reward feedback). Which learning types are these?
:::
Answer: **supervised**, **unsupervised**, **reinforcement**.

1. **Supervised learning (teacher-guided).** Learns from **labelled** data: questions (inputs) *and* correct answers (labels). The goal is a general mapping $f:\mathbf x\to y$ that predicts labels for unseen inputs. *Example:* house prices (features: square footage, location; label: exact sale price).
2. **Unsupervised learning (self-organised discovery).** Completely **unlabelled** data, no teacher, no scoring key. The algorithm is a "data detective" that uncovers hidden structure and natural groupings from statistical similarity. *Example:* market segmentation into consumer archetypes from anonymous purchase histories.
3. **Semi-supervised learning (practical hybrid).** Labelling is expensive, so combine a **very small pool of labelled data** with a **massive pool of cheap unlabelled data**. The small labelled set anchors understanding, and the model propagates it across the unlabelled set. *Case study, Google Photos:* faces are clustered automatically (unsupervised step). It asks "Is this Alex?" once (one label), then labels thousands of photos of that face (supervised propagation).
4. **Reinforcement learning (trial and error).** No static dataset. An **agent** interacts with an **unknown environment**: it acts, experiences consequences, and receives **rewards** or **penalties**. Over millions of iterations it learns a **policy** that maximises **cumulative reward**. *Why "unknown environment" matters:* there is no map, no prior knowledge and no dataset; the agent generates its own training signal by exploring. *Case study:* a drone flying through windy warehouses is penalised for crashes and rewarded for stability and reaching the destination, and learns the best rotor-adjustment policy.

:::key Key insight
Supervised = labelled data, learns a mapping. Unsupervised = unlabelled, discovers structure. Semi-supervised = the real-world compromise because labels are expensive. Reinforcement = no dataset; the agent explores an unknown environment and generates its own feedback.
:::
:::take Takeaway
One key question: **Do you have labels?** And: does an agent need to **explore an environment** to generate its own feedback?
:::`,
    researched: R`**Self-supervised learning** (you mentioned it in the brief; not in the worksheet). The model creates its **own labels from the raw data**. Examples: hide a word and predict it (BERT), predict the next word (GPT-style LLMs), or rotate an image and predict the rotation. Technically it trains like supervised learning (there is a target), but **no human labels** are needed, so it can use huge unlabelled corpora. It is the standard way to *pre-train* LLMs and vision models, which are then fine-tuned with a few human labels.

| | Labels from | Typical use |
|---|---|---|
| Supervised | humans | prediction |
| Unsupervised | none | structure (clusters, PCA) |
| Semi-supervised | few humans + many unlabelled | cheap labelling |
| Self-supervised | the data itself (masked / next item) | pre-training LLMs and vision models |
| Reinforcement | rewards from the environment | control, games, robotics |

*Source:* Géron, *Hands-On ML* (3rd ed.) ch.1 "Self-supervised learning"; Devlin et al. 2019 (BERT).`,
    formulas: [
      { name: 'Supervised goal', tex: R`\text{learn } f:\ \mathbf x \mapsto y \ \text{ from } \{(\mathbf x_i,y_i)\}`, sym: 'mapping from inputs to labels', when: 'Regression and classification.' },
      { name: 'Reinforcement goal', tex: R`\max_{\pi}\ \mathbb E\Big[\sum_{t} r_t\Big]`, sym: R`$\pi$ = policy (how the agent acts); $r_t$ = reward at step $t$.`, when: 'Agent + environment + rewards; no fixed dataset.' }
    ],
    plots: [
      { id: 'P00-paradigms', title: 'Choosing the paradigm: two questions', notice: 'The first question is always about **labels**. RL is separate because it has no dataset at all.',
        spec: { type: 'flow', w: 680, h: 270, nodes: [
          { id: 'q1', x: 340, y: 40, w: 300, h: 44, t: 'Is there a fixed dataset?', shape: 'round', c: 's1', bold: true },
          { id: 'rl', x: 590, y: 130, w: 160, h: 50, t: 'Reinforcement\n(agent + rewards)', c: 's5' },
          { id: 'q2', x: 250, y: 130, w: 240, h: 44, t: 'How many labels?', shape: 'round', c: 's1', bold: true },
          { id: 'su', x: 90, y: 225, w: 150, h: 50, t: 'Supervised\n(all labelled)', c: 's3' },
          { id: 'se', x: 260, y: 225, w: 170, h: 50, t: 'Semi-supervised\n(few labels + many raw)', c: 's2' },
          { id: 'un', x: 440, y: 225, w: 150, h: 50, t: 'Unsupervised\n(no labels)', c: 's6' }],
          edges: [{ a: 'q1', b: 'rl', t: 'no' }, { a: 'q1', b: 'q2', t: 'yes' }, { a: 'q2', b: 'su', t: 'all' }, { a: 'q2', b: 'se', t: 'few' }, { a: 'q2', b: 'un', t: 'none' }] } }
    ],
    examples: [{ title: 'Map each scenario (worked)', body: R`| Scenario | Paradigm | Reason |
|---|---|---|
| Predict loan default from 1 lakh past loans with outcomes | Supervised | labelled outcome |
| Group news articles into topics, no tags | Unsupervised | find structure |
| 500 tagged + 2 million untagged support tickets | Semi-supervised | few labels, many raw |
| Robot arm learns to grasp by trying, +1 on success | Reinforcement | reward from environment |
| Pre-train a language model by predicting masked words | Self-supervised (researched) | labels come from the text itself |` }],
    traps: ['RL is **not** "supervised with rewards as labels": there is no fixed dataset, and the agent\'s own actions change what it sees next.', 'Semi-supervised ≠ self-supervised. Semi uses a *few human* labels; self-supervised makes labels from the data itself.', 'Clustering faces is the unsupervised **step** of Google Photos; the overall pipeline is semi-supervised.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'A video-game AI receives +10 points for winning and −5 for crashing and improves over millions of games. This is:', options: ['Supervised learning', 'Unsupervised learning', 'Semi-supervised learning', 'Reinforcement learning'], answer: 3, sol: 'Rewards and penalties from interacting with an environment define RL.', why: ['There are no labelled examples.', 'Not discovering structure in a dataset.', 'No labelled/unlabelled pools.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'Google Photos clusters faces, asks you once "Is this Alex?", then tags thousands of photos. The **overall** approach is:', options: ['Supervised', 'Unsupervised', 'Semi-supervised', 'Reinforcement'], answer: 2, sol: 'A tiny labelled set (one label) plus a huge unlabelled set, with labels propagated: semi-supervised (worksheet case study).', why: ['Most photos have no human label.', 'The clustering step alone is unsupervised, but a label is then used.', 'Correct.', 'No reward signal.'] },
      { type: 'msq', diff: 'M', q: 'Which statements about **reinforcement learning** are true? (select all)', options: ['It needs a large labelled dataset before training', 'An agent interacts with an unknown environment', 'It learns a policy that maximises cumulative reward', 'It generates its own training signal by exploration'], answer: [1, 2, 3], sol: 'RL does not rely on static datasets; the agent explores, receives rewards or penalties and optimises its policy.', why: ['The opposite: RL has no static dataset.', 'Correct.', 'Correct.', 'Correct.'] },
      { type: 'mcq', diff: 'E', q: 'Market segmentation from anonymous purchase histories (no predefined groups) is:', options: ['Supervised', 'Unsupervised', 'Reinforcement', 'Semi-supervised'], answer: 1, sol: 'There are no labels; the algorithm discovers consumer archetypes. This is the worksheet\'s unsupervised example.', why: ['No target labels.', 'Correct.', 'No agent or rewards.', 'No labelled subset.'] },
      { type: 'mcq', diff: 'H', tag: 'GATE-style', q: 'A language model is pre-trained by hiding 15% of words and predicting them, using no human annotation. This is best called:', options: ['Supervised learning with human labels', 'Self-supervised learning', 'Reinforcement learning', 'Unsupervised clustering'], answer: 1, sol: 'The targets (hidden words) come from the data itself, so this is **self-supervised** learning (researched extra).', why: ['No human labelling is involved.', 'Correct.', 'No environment or reward.', 'It predicts targets; it does not group points.'] }
    ],
    source: 'Worksheet L0 pp.7–8; Sutton & Barto, *Reinforcement Learning* ch.1; Géron ch.1.'
  },
  /* ---------------------------------------------------------------- L00.5 */
  {
    id: 'L00.5', title: 'Core tasks: regression, classification, clustering', badge: 'class', pages: '8–10', ws: 'Part 7',
    concept: R`
:::hook Hook
Uber sets a surge multiplier (1.4×, 2.1×…). A hospital flags patients "high risk" or "low risk". Netflix groups viewers into micro-genre clusters with no predefined categories. Three problems, three task types. How do you tell them apart instantly?
:::

| Task | Output type | Supervised or unsupervised? |
|---|---|---|
| **Regression** | continuous numerical value (scalar) | supervised |
| **Classification** | discrete predefined category / label | supervised |
| **Clustering** | unlabelled natural group | unsupervised |

**Task A — Regression.** The target is continuous and numerical; the model outputs a precise scalar on an infinite continuum. Use it when the question is *"how much? how many? what value?"* Examples: house price, tomorrow's peak temperature in °C, car mileage (MPG). *Case study:* Uber's real-time regression outputs a continuous fare multiplier per geo-fenced zone. Algorithms: Linear Regression, SVR, Decision Tree Regression, Random Forest Regression.

**Task B — Classification.** The target is a discrete, predefined class label; the model draws **decision boundaries**. Use it for *"is this A, B or C? safe or unsafe? which species?"* Completed table: spam vs not spam (input: email payload → binary choice); disease diagnostics (clinical vitals, blood biomarkers → positive/negative); computer-vision labelling (image pixel matrix → cat/dog/fox). *Case study:* hospitals categorise ER admissions into risk brackets. Algorithms: Logistic Regression, KNN, Decision Tree, SVM, Naive Bayes, Random Forest.

**Task C — Clustering.** Unsupervised. Groups points by distribution, density and geometric proximity, so that points within a cluster are similar and points in different clusters are distinct. Use it when you **don't know the categories in advance**. Examples: customer segmentation, document topic modelling, **image segmentation** (labels *every pixel* by clustering colour and position, unlike classification, which labels the whole image). *Case study:* Netflix micro-genres. Algorithms: K-Means, K-Medoids, DBSCAN, Hierarchical (agglomerative), Gaussian Mixture Models.

**Summary wrap-up:** traditional programming breaks → AI is the umbrella → ML learns rules from data → DL handles unstructured data → data flavours (labelled/unlabelled) → strategies (supervised, unsupervised, semi-supervised, reinforcement) → tasks (regression, classification, clustering).`,
    formulas: [
      { name: 'Regression', tex: R`\hat y \in \mathbb R`, sym: 'a real number', when: '"How much / how many?"' },
      { name: 'Classification', tex: R`\hat y \in \{c_1,\dots,c_K\}`, sym: 'one of K predefined labels', when: '"Which class?"' },
      { name: 'Clustering', tex: R`\mathbf x_i \mapsto \text{cluster } k \in\{1..K\},\ \text{no labels given}`, sym: 'groups discovered from similarity', when: '"What natural groups exist?"' }
    ],
    plots: [
      { id: 'P00-tasks', title: 'The three core tasks on toy data', notice: 'Regression draws a **line through** the points; classification draws a **boundary between** labelled classes; clustering finds groups with **no labels at all**.',
        spec: (function () {
          const r = NUM.rng(3), pts = [], c0 = [], c1 = [], k = [[], [], []];
          for (let i = 0; i < 14; i++) { const x = 1 + i * 0.6; pts.push([x, 2 + 1.5 * x + NUM.gauss(r) * 0.8]); }
          for (let i = 0; i < 12; i++) { c0.push([1 + r() * 3.5, 1 + r() * 3]); c1.push([4.5 + r() * 3.5, 4.5 + r() * 3]); }
          [[2, 2], [7, 3], [4.5, 7]].forEach((c, j) => { for (let i = 0; i < 10; i++) k[j].push([c[0] + NUM.gauss(r) * 0.7, c[1] + NUM.gauss(r) * 0.7]); });
          return { type: 'multi', panels: [
            { type: 'xy', w: 280, h: 230, title: 'Regression', xlim: [0, 10], ylim: [0, 20], xlabel: 'x', ylabel: 'y (number)', series: [{ t: 'scatter', pts, c: 's1' }, { t: 'fn', f: x => 2 + 1.5 * x, c: 's4' }] },
            { type: 'xy', w: 280, h: 230, title: 'Classification', xlim: [0, 9], ylim: [0, 9], xlabel: 'x1', ylabel: 'x2', series: [{ t: 'scatter', pts: c0, c: 's1', label: 'class 0' }, { t: 'scatter', pts: c1, c: 's2', m: 's', label: 'class 1' }, { t: 'fn', f: x => 8.2 - x, c: 'fg', dash: true }], legend: 'tr' },
            { type: 'xy', w: 280, h: 230, title: 'Clustering', xlim: [0, 9.5], ylim: [0, 9.5], xlabel: 'x1', ylabel: 'x2', series: [{ t: 'scatter', pts: k[0], c: 's3' }, { t: 'scatter', pts: k[1], c: 's5' }, { t: 'scatter', pts: k[2], c: 's6' }] }] };
        })() }
    ],
    examples: [{ title: 'Instant classifier for task type (worked)', body: R`Ask: (1) Is there a target column? No → **clustering**. (2) If yes, is the target a number on a continuum? Yes → **regression**; a category → **classification**.

| Problem | Target | Task |
|---|---|---|
| Uber surge multiplier 1.4× | continuous number | regression |
| ER patient high/low risk | category | classification |
| Netflix taste groups | none | clustering |
| Number of items a user will buy (0, 1, 2…) | count, usually modelled as a number | regression |
| Tumour benign/malignant | category | classification |` }],
    code: [{ title: 'All three tasks in a few lines (scikit-learn)', lib: 'L00_tasks_sklearn.py', libLabel: 'scikit-learn' }],
    traps: ['**Logistic regression is a classification algorithm** despite its name (you will meet it in L14).', 'Image **segmentation** labels every pixel (clustering-style); image **classification** labels the whole image.', 'A class label coded 0/1/2 is still classification. Numbers used as category IDs do not make it regression.'],
    questions: [
      { type: 'mcq', diff: 'E', q: 'Predicting **tomorrow\'s peak temperature in °C** is a ___ task.', options: ['classification', 'regression', 'clustering', 'reinforcement'], answer: 1, sol: 'The output is a continuous number → regression (worksheet Task A example).', why: ['Output is not a category.', 'Correct.', 'There is a target.', 'Not an agent/reward setup.'] },
      { type: 'mcq', diff: 'E', q: 'Which algorithm is listed under **classification** despite its name?', options: ['Linear Regression', 'Logistic Regression', 'K-Means', 'DBSCAN'], answer: 1, sol: 'Logistic regression outputs a class probability and is used for classification (L14).', why: ['Regression algorithm.', 'Correct.', 'Clustering.', 'Clustering.'] },
      { type: 'msq', diff: 'M', q: 'Select **all** clustering algorithms from the worksheet list.', options: ['K-Means', 'Naive Bayes', 'DBSCAN', 'Gaussian Mixture Models'], answer: [0, 2, 3], sol: 'Worksheet clustering list: K-Means, K-Medoids, DBSCAN, Hierarchical (agglomerative), GMM. Naive Bayes is a classifier.', why: ['Correct.', 'Classification algorithm.', 'Correct.', 'Correct.'] },
      { type: 'mcq', diff: 'M', q: 'Labelling **every pixel** of an image by grouping similar colours and positions is:', options: ['image classification', 'image segmentation', 'regression', 'reinforcement learning'], answer: 1, sol: 'The worksheet: segmentation labels every pixel to map regions, unlike classification, which labels the whole image.', why: ['Classification gives one label per image.', 'Correct.', 'Output is not one number.', 'No rewards.'] },
      { type: 'out', diff: 'M', q: 'Predict the output. (Points lie exactly on a line.)', code: R`import numpy as np
from sklearn.linear_model import LinearRegression
X = np.array([[1], [2], [3]])
y = np.array([3, 5, 7])
print(LinearRegression().fit(X, y).predict([[10]]))`, answer: '[21.]',
        sol: R`The data satisfy $y = 2x + 1$ exactly, so OLS finds slope 2 and intercept 1. Prediction at 10: $2(10)+1 = 21$. \`predict\` returns a NumPy array, which prints as \`[21.]\` (a float array with one element).` },
      { type: 'mcq', diff: 'E', q: 'Netflix groups viewers into hundreds of taste groups **with no predefined categories**. Task type?', options: ['Regression', 'Classification', 'Clustering', 'Semi-supervised classification'], answer: 2, sol: 'No predefined labels; groups are discovered → clustering (worksheet case study).', why: ['No numeric target.', 'Categories are not predefined.', 'Correct.', 'No labelled subset is mentioned.'] }
    ],
    source: 'Worksheet L0 pp.8–10; ISLR §2.1; scikit-learn user guide (supervised / unsupervised sections).'
  }
  ]
});
