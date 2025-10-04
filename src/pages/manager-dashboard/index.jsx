import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ExpenseTable from './components/ExpenseTable';
import AnalyticsPanel from './components/AnalyticsPanel';
import FilterControls from './components/FilterControls';
import BulkActions from './components/BulkActions';
import NotificationCenter from './components/NotificationCenter';
import NotificationToastHost from '../../components/NotificationToast';
import realtime from '../../lib/realtimeNotifications';
import expensesStore from '../../lib/expensesStore';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { migrateLocalToRemote } from '../../lib/expensesStore';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [filters, setFilters] = useState({ employee: 'all', category: 'all', status: 'all', priority: 'all', dateFrom: '', dateTo: '', amountMin: '', amountMax: '', searchQuery: '', urgentOnly: false });

  // Small mock data to show when store is empty
  const mockExpenses = [
    { id: 'EXP-2025-001', employee: 'John Smith', department: 'Engineering', amount: 1250.0, date: '2025-10-01', category: 'Travel', status: 'pending', priority: 'high', description: 'Client travel' },
    { id: 'EXP-2025-002', employee: 'Sarah Wilson', department: 'Marketing', amount: 450.75, date: '2025-09-28', category: 'Meals', status: 'pending', priority: 'medium', description: 'Team dinner' }
  ];

  const [storedExpenses, setStoredExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.title = 'Manager Dashboard - ExpenseFlow';
    realtime.startRealtimeSimulation(12000);
    const unsub = realtime.onNotification((n) => { setNotifications(prev => [n, ...prev]); setToasts(prev => [n, ...prev].slice(0, 5)); });

    // Load persisted expenses defensively
    try {
      const persisted = expensesStore.getExpenses();
      if (Array.isArray(persisted) && persisted.length) setStoredExpenses(persisted);
    } catch (e) {
      // keep UI stable
      console.error('Failed to load persisted expenses', e);
    }

    return () => { unsub(); realtime.stopRealtimeSimulation(); };
  }, []);

  // Combine persisted + mock so managers always see data
  const combinedExpenses = [...(Array.isArray(storedExpenses) ? storedExpenses : []), ...mockExpenses];

  // Defensive filtering logic (same shape as FilterControls expects)
  const filteredExpenses = combinedExpenses.filter(expense => {
    try {
      if (!expense) return false;
      if (filters.employee !== 'all' && (expense.employee || '').toLowerCase().replace(/\s+/g, '-') !== filters.employee) return false;
      if (filters.category !== 'all' && filters.category && !(expense.category || '').toLowerCase().includes(filters.category)) return false;
      if (filters.status !== 'all' && expense.status !== filters.status) return false;
      if (filters.priority !== 'all' && expense.priority !== filters.priority) return false;
      if (filters.dateFrom && new Date(expense.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(expense.date) > new Date(filters.dateTo)) return false;
      if (filters.amountMin && expense.amount < parseFloat(filters.amountMin)) return false;
      if (filters.amountMax && expense.amount > parseFloat(filters.amountMax)) return false;
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (!((expense.description || '').toLowerCase().includes(q) || (expense.employee || '').toLowerCase().includes(q))) return false;
      }
      if (filters.urgentOnly && expense.priority !== 'high') return false;
      return true;
    } catch (e) {
      console.error('Error filtering expense', e, expense);
      return false;
    }
  });

  const handleApprove = (id) => { expensesStore.updateExpense(id, { status: 'approved' }); setStoredExpenses(expensesStore.getExpenses()); };
  const handleReject = (id) => { expensesStore.updateExpense(id, { status: 'rejected' }); setStoredExpenses(expensesStore.getExpenses()); };
  const handleViewDetails = (id) => navigate(`/expense-details?id=${id}`);
  const handleBulkAction = async (action, expenseIds) => { console.log('Bulk action', action, expenseIds); return new Promise(r => setTimeout(r, 500)); };

  const handleRemoveToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const tabs = [ { id: 'expenses', label: 'Expense Management', icon: 'FileText' }, { id: 'analytics', label: 'Analytics & Reports', icon: 'BarChart3' } ];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedSidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} userRole="manager" />
      <main className={`expense-transition-layout ${sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'} pt-16 md:pt-0`}>
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
              <p className="text-muted-foreground">Review and manage team expense submissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter notifications={notifications} onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))} onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))} />
              <QuickActionButton userRole="manager" />
              <Button onClick={async () => {
                if (!confirm('Migrate local browser-stored expenses to the local API? Make sure the API (localhost:4000) is running.')) return;
                try {
                  const start = Date.now();
                  let lastProgress = '';
                  const res = await migrateLocalToRemote((done, total) => {
                    const pct = Math.round((done / total) * 100);
                    const msg = `Migrating local data: ${done}/${total} (${pct}%)`;
                    if (msg !== lastProgress) {
                      lastProgress = msg;
                      console.log(msg);
                    }
                  });
                  alert(`Migration complete: ${res.migrated} of ${res.total} items migrated in ${Math.round((Date.now()-start)/1000)}s.`);
                  // refresh displayed store
                  const persisted = expensesStore.getExpenses();
                  if (Array.isArray(persisted)) setStoredExpenses(persisted);
                } catch (e) {
                  console.error('Migration failed', e);
                  alert('Migration failed. Check the console and ensure API is running on http://localhost:4000');
                }
              }}>
                Migrate local data
              </Button>
            </div>
          </div>

          <div className="flex space-x-1 mt-6">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-md expense-transition ${activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                <Icon name={tab.icon} size={16} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="p-6">
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <FilterControls filters={filters} onFiltersChange={setFilters} expenseCount={filteredExpenses.length} />

              {selectedExpenses.length > 0 && (
                <BulkActions selectedExpenses={selectedExpenses.map(id => filteredExpenses.find(e => e.id === id)).filter(Boolean)} onBulkAction={handleBulkAction} totalExpenses={filteredExpenses.length} />
              )}

              <ExpenseTable expenses={filteredExpenses} onApprove={handleApprove} onReject={handleReject} onViewDetails={handleViewDetails} selectedExpenses={selectedExpenses} onSelectionChange={setSelectedExpenses} />
            </div>
          )}

          {activeTab === 'analytics' && <AnalyticsPanel analyticsData={{}} />}
        </div>

        <NotificationToastHost toasts={toasts} onRemove={handleRemoveToast} />
      </main>
      {/* Floating quick action for mobile is provided by QuickActionButton inside header area as well */}
    </div>
  );
};

export default ManagerDashboard;