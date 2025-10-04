// Simple localStorage-backed expenses store with optional local API sync
const STORAGE_KEY = 'expenseflow-expenses';
const API_BASE = 'http://localhost:4000';

const hasLocalStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readStore = () => {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error('Failed to read expenses from localStorage', e);
    return [];
  }
};

const writeStore = (arr) => {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('Failed to write expenses to localStorage', e);
  }
};

const generateId = () => {
  const now = new Date();
  return `EXP-${now.getFullYear()}-${now.getTime()}`;
};

// Existing synchronous APIs (keep for compatibility with UI)
export function getExpenses() {
  return readStore();
}

export function saveExpenses(expenses) {
  writeStore(expenses);
}

export function clearExpenses() {
  try {
    if (hasLocalStorage()) window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear expenses', e);
  }
}

// Async remote-capable APIs
async function fetchExpensesRemote() {
  try {
    const res = await fetch(`${API_BASE}/expenses`);
    if (!res.ok) throw new Error('failed to fetch');
    return await res.json();
  } catch (e) {
    return null; // caller will use fallback
  }
}

async function createExpenseRemote(expense) {
  try {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense)
    });
    if (!res.ok) throw new Error('failed to create remote');
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function updateExpenseRemote(id, patch) {
  try {
    const res = await fetch(`${API_BASE}/expenses/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });
    if (!res.ok) throw new Error('failed to update remote');
    return await res.json();
  } catch (e) {
    return null;
  }
}

export function addExpense(expense) {
  const current = readStore();
  const toAdd = {
    id: expense.id || generateId(),
    employee: expense.employee || 'Unknown',
    department: expense.department || '',
    amount: typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0,
    date: expense.date || new Date().toISOString().split('T')[0],
    category: expense.category || '',
    status: expense.status || 'pending',
    priority: expense.priority || 'medium',
    description: expense.description || '',
    hasComments: !!expense.hasComments,
    commentCount: expense.commentCount || 0,
    submittedAt: expense.submittedAt || new Date().toISOString(),
    submittedBy: expense.submittedBy || '' ,
    files: expense.files || []
  };

  const next = [toAdd, ...current];
  writeStore(next);

  // Try to push to local API in background; if it fails, keep local only
  (async () => {
    const created = await createExpenseRemote(toAdd);
    if (created) {
      // merge created remote into local store (replace by id)
      const fresh = readStore().map(e => e.id === created.id ? created : e);
      writeStore(fresh);
    }
  })();

  return toAdd;
}

export function updateExpense(id, patch) {
  const current = readStore();
  const next = current.map(e => e.id === id ? { ...e, ...patch } : e);
  writeStore(next);

  // Fire-and-forget remote update
  (async () => {
    const updated = await updateExpenseRemote(id, patch);
    if (updated) {
      const fresh = readStore().map(e => e.id === updated.id ? updated : e);
      writeStore(fresh);
    }
  })();

  return next.find(e => e.id === id) || null;
}

// Helper to attempt remote sync and replace local store with remote if available
export async function syncFromRemote() {
  const remote = await fetchExpensesRemote();
  if (Array.isArray(remote)) {
    try {
      writeStore(remote);
      return remote;
    } catch (e) {
      console.error('Failed writing remote sync to localStorage', e);
    }
  }
  return null;
}

export default {
  getExpenses,
  addExpense,
  updateExpense,
  saveExpenses,
  clearExpenses,
  // remote helpers
  syncFromRemote,
  fetchExpensesRemote,
  createExpenseRemote,
  updateExpenseRemote
};

