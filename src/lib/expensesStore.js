// Simple localStorage-backed expenses store for demo persistence across pages
const STORAGE_KEY = 'expenseflow-expenses';

const readStore = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('Failed to write expenses to localStorage', e);
  }
};

const generateId = () => {
  const now = new Date();
  return `EXP-${now.getFullYear()}-${now.getTime()}`;
};

export function getExpenses() {
  return readStore();
}

export function saveExpenses(expenses) {
  writeStore(expenses);
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
  return toAdd;
}

export function updateExpense(id, patch) {
  const current = readStore();
  const next = current.map(e => e.id === id ? { ...e, ...patch } : e);
  writeStore(next);
  return next.find(e => e.id === id) || null;
}

export function clearExpenses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear expenses', e);
  }
}

export default {
  getExpenses,
  addExpense,
  updateExpense,
  saveExpenses,
  clearExpenses
};
