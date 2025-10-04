const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_FILE = path.join(__dirname, 'expenses.db');

// Ensure directory exists
try { fs.mkdirSync(path.dirname(DB_FILE), { recursive: true }); } catch (e) { /* ignore */ }

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      employee TEXT,
      department TEXT,
      amount REAL,
      date TEXT,
      category TEXT,
      status TEXT,
      priority TEXT,
      description TEXT,
      hasComments INTEGER DEFAULT 0,
      commentCount INTEGER DEFAULT 0,
      submittedAt TEXT,
      submittedBy TEXT,
      files TEXT
    )
  `);
});

function serializeExpense(row) {
  if (!row) return null;
  try {
    return {
      id: row.id,
      employee: row.employee,
      department: row.department,
      amount: row.amount,
      date: row.date,
      category: row.category,
      status: row.status,
      priority: row.priority,
      description: row.description,
      hasComments: !!row.hasComments,
      commentCount: row.commentCount || 0,
      submittedAt: row.submittedAt,
      submittedBy: row.submittedBy,
      files: row.files ? JSON.parse(row.files) : []
    };
  } catch (e) {
    return { ...row, files: [] };
  }
}

exports.getAllExpenses = function () {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM expenses ORDER BY submittedAt DESC', (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(serializeExpense));
    });
  });
};

exports.getExpenseById = function (id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM expenses WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(serializeExpense(row));
    });
  });
};

exports.createExpense = function (expense) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(`INSERT OR REPLACE INTO expenses (
      id, employee, department, amount, date, category, status, priority, description, hasComments, commentCount, submittedAt, submittedBy, files
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

    const filesJson = JSON.stringify(expense.files || []);

    stmt.run([
      expense.id,
      expense.employee || null,
      expense.department || null,
      typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount) || 0,
      expense.date || null,
      expense.category || null,
      expense.status || 'pending',
      expense.priority || 'medium',
      expense.description || null,
      expense.hasComments ? 1 : 0,
      expense.commentCount || 0,
      expense.submittedAt || null,
      expense.submittedBy || null,
      filesJson
    ], function (err) {
      if (err) return reject(err);
      // return the newly created expense
      exports.getExpenseById(expense.id).then(resolve).catch(reject);
    });
  });
};

exports.updateExpense = function (id, patch) {
  return exports.getExpenseById(id).then(existing => {
    if (!existing) return null;
    const merged = { ...existing, ...patch };
    return new Promise((resolve, reject) => {
      const filesJson = JSON.stringify(merged.files || []);
      const stmt = db.prepare(`INSERT OR REPLACE INTO expenses (
        id, employee, department, amount, date, category, status, priority, description, hasComments, commentCount, submittedAt, submittedBy, files
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

      stmt.run([
        merged.id,
        merged.employee || null,
        merged.department || null,
        typeof merged.amount === 'number' ? merged.amount : parseFloat(merged.amount) || 0,
        merged.date || null,
        merged.category || null,
        merged.status || 'pending',
        merged.priority || 'medium',
        merged.description || null,
        merged.hasComments ? 1 : 0,
        merged.commentCount || 0,
        merged.submittedAt || null,
        merged.submittedBy || null,
        filesJson
      ], function (err) {
        if (err) return reject(err);
        exports.getExpenseById(merged.id).then(resolve).catch(reject);
      });
    });
  });
};
