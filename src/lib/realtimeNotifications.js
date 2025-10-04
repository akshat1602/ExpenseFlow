// Simple simulated realtime notification emitter. In production this would be a WebSocket.
const notifier = new EventTarget();

let counter = 1000;

function makeNotification() {
  counter += 1;
  const types = ['expense_submitted','expense_approved','comment_added','deadline_approaching','budget_alert'];
  const type = types[Math.floor(Math.random()*types.length)];
  const titleMap = {
    expense_submitted: 'New Expense Submitted',
    expense_approved: 'Expense Approved',
    comment_added: 'New Comment',
    deadline_approaching: 'Approval Deadline',
    budget_alert: 'Budget Alert'
  };
  const msgMap = {
    expense_submitted: 'A new expense was submitted by a teammate.',
    expense_approved: 'An expense you oversee was approved.',
    comment_added: 'Someone left a comment on an expense.',
    deadline_approaching: 'Some approvals are due soon.',
    budget_alert: 'Department spending exceeded threshold.'
  };

  return {
    id: `realtime-${counter}`,
    type,
    title: titleMap[type],
    message: msgMap[type],
    timestamp: new Date(),
    read: false
  };
}

let intervalId = null;

export function startRealtimeSimulation(intervalMs = 15000) {
  if (intervalId) return;
  intervalId = setInterval(() => {
    const notif = makeNotification();
    notifier.dispatchEvent(new CustomEvent('notification', { detail: notif }));
  }, intervalMs);
}

export function stopRealtimeSimulation() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}

export function onNotification(handler) {
  const wrapper = (e) => handler(e.detail);
  notifier.addEventListener('notification', wrapper);
  return () => notifier.removeEventListener('notification', wrapper);
}

export default { startRealtimeSimulation, stopRealtimeSimulation, onNotification };
