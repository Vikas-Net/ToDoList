// Data layer. Same five operations whether the data lives in Firestore or (demo mode) in this browser.
import { firebaseConfig } from "./firebase-config.js";

const SDK = "https://www.gstatic.com/firebasejs/10.12.2";
export const isConfigured = !String(firebaseConfig.apiKey).startsWith("PASTE");

export async function createStore() {
  return isConfigured ? firebaseStore() : localStore();
}

async function firebaseStore() {
  const { initializeApp } = await import(`${SDK}/firebase-app.js`);
  const fs = await import(`${SDK}/firebase-firestore.js`);
  const db = fs.getFirestore(initializeApp(firebaseConfig));
  const col = fs.collection(db, "tasks");
  return {
    mode: "firebase",
    subscribe: (cb, onError) =>
      fs.onSnapshot(fs.query(col, fs.orderBy("createdAt")),
        snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))), onError),
    add: task => fs.addDoc(col, { ...task, createdAt: Date.now() }),
    update: (id, patch) => fs.updateDoc(fs.doc(db, "tasks", id), patch),
    remove: id => fs.deleteDoc(fs.doc(db, "tasks", id)),
    seed: async list => {
      const batch = fs.writeBatch(db);
      list.forEach((t, i) => batch.set(fs.doc(col), { ...t, createdAt: Date.now() + i }));
      await batch.commit();
    }
  };
}

function localStore() {
  const KEY = "office-task-board-demo";
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) {}
  const listeners = new Set();
  const commit = () => {
    try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) {}
    listeners.forEach(cb => cb(tasks.slice()));
  };
  const uid = () => Math.random().toString(36).slice(2, 10);
  return {
    mode: "demo",
    subscribe: cb => { listeners.add(cb); cb(tasks.slice()); return () => listeners.delete(cb); },
    add: async task => { tasks.push({ ...task, id: uid(), createdAt: Date.now() }); commit(); },
    update: async (id, patch) => { tasks = tasks.map(t => t.id === id ? { ...t, ...patch } : t); commit(); },
    remove: async id => { tasks = tasks.filter(t => t.id !== id); commit(); },
    seed: async list => { list.forEach((t, i) => tasks.push({ ...t, id: uid(), createdAt: Date.now() + i })); commit(); }
  };
}
