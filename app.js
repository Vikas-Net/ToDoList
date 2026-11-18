import { createStore, isConfigured } from "./store.js";
import { SEED } from "./seed.js";

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };

const KNOWN = ["Sales", "Projects", "Support checks", "Sales checks", "Daily report", "Follow-ups"];
const colorOf = s => {
  const i = KNOWN.indexOf(s);
  if (i >= 0) return `var(--c${i})`;
  let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `var(--c${h % 7})`;
};

let store, tasks = [], section = "All", editingId = null;

/* ---------- rendering ---------- */
function dueBadge(t) {
  if (!t.due) return null;
  const today = new Date().toISOString().slice(0, 10);
  const label = new Date(t.due + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const b = el("span", "due", label);
  if (!t.done && t.due < today) { b.classList.add("late"); b.textContent = "Overdue · " + label; }
  else if (!t.done && t.due === today) { b.classList.add("today"); b.textContent = "Today"; }
  return b;
}

function taskRow(t) {
  const li = el("li");
  const row = el("div", "task" + (t.done ? " done" : ""));
  row.style.setProperty("--c", t.priority ? "var(--prio)" : colorOf(t.section));

  const label = el("label");
  const cb = el("input"); cb.type = "checkbox"; cb.checked = !!t.done;
  cb.addEventListener("change", () => run(store.update(t.id, { done: cb.checked })));
  const text = el("span", "t");
  text.append(el("b", "", t.title));
  if (t.note) text.append(el("em", "", t.note));
  const due = dueBadge(t); if (due) text.append(due);
  label.append(cb, text);

  const tools = el("div", "tools");
  const edit = el("button", "icon", "✎"); edit.type = "button"; edit.title = "Edit"; edit.setAttribute("aria-label", "Edit " + t.title);
  edit.addEventListener("click", () => openDialog(t));
  const del = el("button", "icon del", "🗑"); del.type = "button"; del.title = "Delete"; del.setAttribute("aria-label", "Delete " + t.title);
  del.addEventListener("click", () => { if (confirm(`Delete "${t.title}"?`)) run(store.remove(t.id), "Deleted"); });
  tools.append(edit, del);

  row.append(label, tools);
  li.append(row);
  return li;
}

function render() {
  const q = $("search").value.trim().toLowerCase();
  const hide = $("hideDone").checked;
  const sections = [...new Set([...KNOWN, ...tasks.map(t => t.section)])].filter(s => tasks.some(t => t.section === s));

  // progress (all tasks)
  const done = tasks.filter(t => t.done).length;
  const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  $("count").textContent = `${done} of ${tasks.length} done`;
  $("pct").textContent = pct + "%";
  $("fill").style.width = pct + "%";

  // filter chips
  if (section !== "All" && !sections.includes(section)) section = "All";
  const chips = $("chips"); chips.replaceChildren();
  for (const s of ["All", ...sections]) {
    const c = el("button", "chip", s); c.type = "button";
    c.style.setProperty("--c", s === "All" ? "var(--c6)" : colorOf(s));
    c.setAttribute("aria-pressed", String(s === section));
    c.addEventListener("click", () => { section = s; render(); });
    chips.append(c);
  }
  $("sections").replaceChildren(...[...new Set([...KNOWN, ...sections])].map(s => { const o = el("option"); o.value = s; return o; }));

  const visible = tasks.filter(t =>
    (section === "All" || t.section === section) &&
    (!hide || !t.done) &&
    (!q || (t.title + " " + (t.note || "") + " " + t.section).toLowerCase().includes(q)));

  $("empty").hidden = tasks.length > 0;
  $("chips").hidden = tasks.length === 0;

  const pr = visible.filter(t => t.priority);
  $("prioWrap").hidden = pr.length === 0;
  $("prio").replaceChildren(...pr.map(t => { const c = el("div", "pcard"); c.append(taskRow(t).firstChild); return c; }));

  const groups = $("groups"); groups.replaceChildren();
  for (const s of sections) {
    const all = tasks.filter(t => t.section === s && !t.priority);
    const items = visible.filter(t => t.section === s && !t.priority);
    if (!items.length) continue;
    const card = el("section", "card"); card.style.setProperty("--c", colorOf(s));
    const h = el("h2", "", s); h.append(el("small", "", `${all.filter(t => t.done).length}/${all.length}`));
    const ul = el("ul"); ul.append(...items.map(taskRow));
    card.append(h, ul); groups.append(card);
  }
}

/* ---------- dialog (create / edit) ---------- */
function openDialog(t) {
  editingId = t ? t.id : null;
  $("dlgTitle").textContent = t ? "Edit task" : "New task";
  $("fTitle").value = t?.title || "";
  $("fNote").value = t?.note || "";
  $("fSection").value = t?.section || (section !== "All" ? section : "");
  $("fDue").value = t?.due || "";
  $("fPrio").checked = !!t?.priority;
  $("dlg").showModal();
  $("fTitle").focus();
}

$("newBtn").addEventListener("click", () => openDialog(null));
$("cancel").addEventListener("click", () => $("dlg").close());
$("form").addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    title: $("fTitle").value.trim(),
    note: $("fNote").value.trim(),
    section: $("fSection").value.trim() || "Other",
    due: $("fDue").value,
    priority: $("fPrio").checked
  };
  if (!data.title) return;
  $("dlg").close();
  if (editingId) run(store.update(editingId, data), "Saved");
  else run(store.add({ ...data, done: false }), "Task added");
});

/* ---------- helpers ---------- */
let toastTimer;
function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (t.hidden = true), 2200);
}
function showError(err) {
  console.error(err);
  const b = $("banner"); b.hidden = false; b.className = "banner error";
  b.textContent = "Could not reach the database: " + (err?.message || err) + ". Check your Firebase config and Firestore rules (see README).";
}
function run(promise, okMsg) {
  Promise.resolve(promise).then(() => okMsg && toast(okMsg)).catch(showError);
}

/* ---------- start ---------- */
$("search").addEventListener("input", render);
$("hideDone").addEventListener("change", render);
$("seedBtn").addEventListener("click", () => run(store.seed(SEED), "Starter tasks loaded"));
$("date").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

(async function init() {
  if (!isConfigured) {
    const b = $("banner"); b.hidden = false;
    b.innerHTML = "Demo mode: tasks are saved in this browser only. Paste your Firebase config into <code>firebase-config.js</code> to save them online.";
  }
  try {
    store = await createStore();
    store.subscribe(list => { tasks = list; render(); }, showError);
  } catch (err) { showError(err); }
})();
