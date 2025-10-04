const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await db.getAllExpenses();
    res.json(expenses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to load expenses' });
  }
});

app.get('/expenses/:id', async (req, res) => {
  try {
    const expense = await db.getExpenseById(req.params.id);
    if (!expense) return res.status(404).json({ error: 'not found' });
    res.json(expense);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to load expense' });
  }
});

app.post('/expenses', async (req, res) => {
  try {
    const incoming = req.body || {};
    const id = incoming.id || `EXP-${new Date().getFullYear()}-${Date.now()}`;
    const expense = { ...incoming, id };
    const created = await db.createExpense(expense);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to create expense' });
  }
});

app.put('/expenses/:id', async (req, res) => {
  try {
    const updated = await db.updateExpense(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'not found' });
    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'failed to update expense' });
  }
});

app.listen(PORT, () => {
  console.log(`ExpenseFlow local API listening on http://localhost:${PORT}`);
});
