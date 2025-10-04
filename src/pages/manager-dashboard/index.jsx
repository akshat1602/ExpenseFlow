import React, { useState, useEffect } from 'react';
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

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('expenses');
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [filters, setFilters] = useState({
    employee: 'all',
    category: 'all',
    status: 'all',
    priority: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    searchQuery: '',
    urgentOnly: false
  });

  // Mock expense data
  const mockExpenses = [
    {
      id: 'EXP-2024-001',
      employee: 'John Smith',
      department: 'Engineering',
      amount: 1250.00,
      date: '2024-10-01',
      category: 'Travel & Transportation',
      status: 'pending',
      priority: 'high',
      description: 'Client meeting travel expenses - San Francisco',
      hasComments: true,
      commentCount: 2,
      submittedAt: '2024-10-01T09:30:00Z'
    },
    {
      id: 'EXP-2024-002',
      employee: 'Sarah Wilson',
      department: 'Marketing',
      amount: 450.75,
      date: '2024-09-28',
      category: 'Meals & Entertainment',
      status: 'pending',
      priority: 'medium',
      description: 'Team dinner with potential clients',
      hasComments: false,
      commentCount: 0,
      submittedAt: '2024-09-28T14:15:00Z'
    },
    {
      id: 'EXP-2024-003',
      employee: 'Mike Johnson',
      department: 'Sales',
      amount: 89.99,
      date: '2024-09-30',
      category: 'Office Supplies',
      status: 'approved',
      priority: 'low',
      description: 'Presentation materials and stationery',
      hasComments: false,
      commentCount: 0,
      submittedAt: '2024-09-30T11:45:00Z'
    },
    {
      id: 'EXP-2024-004',
      employee: 'Emily Davis',
      department: 'HR',
      amount: 2100.00,
      date: '2024-09-25',
      category: 'Training & Development',
      status: 'escalated',
      priority: 'high',
      description: 'Professional certification course fees',
      hasComments: true,
      commentCount: 5,
      submittedAt: '2024-09-25T16:20:00Z'
    },
    {
      id: 'EXP-2024-005',
      employee: 'David Brown',
      department: 'IT',
      amount: 299.99,
      date: '2024-10-02',
      category: 'Software & Subscriptions',
      status: 'pending',
      priority: 'medium',
      description: 'Annual software license renewal',
      hasComments: false,
      commentCount: 0,
      submittedAt: '2024-10-02T08:00:00Z'
    }
  ];

  const [storedExpenses, setStoredExpenses] = useState([]);

  // Mock analytics data
  const mockAnalyticsData = {
    monthlySpending: [
      { month: 'Jan', amount: 45000 },
      { month: 'Feb', amount: 52000 },
      { month: 'Mar', amount: 48000 },
      { month: 'Apr', amount: 61000 },
      { month: 'May', amount: 55000 },
      { month: 'Jun', amount: 67000 }
    ],
    categoryBreakdown: [
      { name: 'Travel', value: 25000 },
      { name: 'Meals', value: 15000 },
      { name: 'Office', value: 8000 },
      { name: 'Software', value: 12000 },
      { name: 'Training', value: 7000 }
    ],
    approvalTrends: [
      { week: 'W1', approved: 12, rejected: 2, pending: 5 },
      { week: 'W2', approved: 15, rejected: 1, pending: 8 },
      { week: 'W3', approved: 18, rejected: 3, pending: 6 },
      { week: 'W4', approved: 14, rejected: 2, pending: 9 }
    ],
    teamMetrics: {
      pendingApprovals: 23,
      monthlySpending: 67000,
      avgProcessingTime: 2.5,
      teamSize: 15
    },
    budgetUtilization: [
      { department: 'Engineering', used: 45000, total: 60000, percentage: 75 },
      { department: 'Marketing', used: 28000, total: 35000, percentage: 80 },
      { department: 'Sales', used: 52000, total: 55000, percentage: 95 },
      { department: 'HR', used: 15000, total: 25000, percentage: 60 }
    ]
  };

  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-001',
      type: 'expense_submitted',
      title: 'New Expense Submitted',
      message: 'John Smith submitted a travel expense for $1,250.00',
      timestamp: new Date(Date.now() - 300000),
      read: false
    },
    {
      id: 'notif-002',
      type: 'deadline_approaching',
      title: 'Approval Deadline Approaching',
      message: '3 expenses require approval within 24 hours',
      timestamp: new Date(Date.now() - 900000),
      read: false
    },
    {
      id: 'notif-003',
      type: 'budget_alert',
      title: 'Budget Alert',
      message: 'Sales department has exceeded 95% of monthly budget',
      timestamp: new Date(Date.now() - 1800000),
      read: true
    }
  ]);

  // Filter expenses based on current filters
  const filteredExpenses = combinedExpenses?.filter(expense => {
    if (filters?.employee !== 'all' && expense?.employee?.toLowerCase()?.replace(' ', '-') !== filters?.employee) return false;
    if (filters?.category !== 'all' && expense?.category?.toLowerCase()?.includes(filters?.category) === false) return false;
    if (filters?.status !== 'all' && expense?.status !== filters?.status) return false;
    if (filters?.priority !== 'all' && expense?.priority !== filters?.priority) return false;
    if (filters?.dateFrom && new Date(expense.date) < new Date(filters.dateFrom)) return false;
    if (filters?.dateTo && new Date(expense.date) > new Date(filters.dateTo)) return false;
    if (filters?.amountMin && expense?.amount < parseFloat(filters?.amountMin)) return false;
    if (filters?.amountMax && expense?.amount > parseFloat(filters?.amountMax)) return false;
    if (filters?.searchQuery && !expense?.description?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase()) && 
        !expense?.employee?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase())) return false;
    if (filters?.urgentOnly && expense?.priority !== 'high') return false;
    
    return true;
  });

  const handleApproveExpense = (expenseId) => {
    console.log('Approving expense:', expenseId);
    // In real app, this would make an API call
  };

  const handleRejectExpense = (expenseId) => {
    console.log('Rejecting expense:', expenseId);
    // In real app, this would make an API call
  };

  const handleViewDetails = (expenseId) => {
    navigate(`/expense-details?id=${expenseId}`);
  };

  const handleBulkAction = async (action, expenseIds) => {
    console.log('Bulk action:', action, 'for expenses:', expenseIds);
    // In real app, this would make an API call
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notif => 
        notif?.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev?.map(notif => ({ ...notif, read: true }))
    );
  };

  // Toasts for realtime notifications
  const [toasts, setToasts] = useState([]);
  const handleAddToast = (notif) => setToasts(prev => [notif, ...prev].slice(0,5));
  const handleRemoveToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const tabs = [
    { id: 'expenses', label: 'Expense Management', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics & Reports', icon: 'BarChart3' }
  ];

  useEffect(() => {
    document.title = 'Manager Dashboard - ExpenseFlow';

    // start realtime notifications simulation and subscribe
    realtime.startRealtimeSimulation(12000);
    const unsub = realtime.onNotification((notif) => {
      setNotifications(prev => [notif, ...prev]);
      handleAddToast(notif);
    });
    // Load persisted expenses and merge into state
    try {
      const persisted = expensesStore.getExpenses();
      if (Array.isArray(persisted) && persisted.length > 0) {
        setStoredExpenses(persisted);
      }
    } catch (e) {
      console.error('Failed to load persisted expenses', e);
    }

    return () => {
      unsub();
      realtime.stopRealtimeSimulation();
    };
  }, []);

  // Combined list: stored (new submissions) + mock (defaults)
  const combinedExpenses = [...(storedExpenses || []), ...(mockExpenses || [])];

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="manager"
      />
      <main className={`expense-transition-layout ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      } pt-16 md:pt-0`}>
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
              <p className="text-muted-foreground">
                Review and manage team expense submissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationCenter
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              />
              <QuickActionButton userRole="manager" />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md expense-transition ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              {/* Filter Controls */}
              <FilterControls
                filters={filters}
                onFiltersChange={setFilters}
                expenseCount={filteredExpenses?.length}
              />

              {/* Bulk Actions */}
              {selectedExpenses?.length > 0 && (
                <BulkActions
                  selectedExpenses={selectedExpenses?.map(id => 
                    filteredExpenses?.find(exp => exp?.id === id)
                  )?.filter(Boolean)}
                  onBulkAction={handleBulkAction}
                  totalExpenses={filteredExpenses?.length}
                />
              )}

              {/* Expense Table */}
              <ExpenseTable
                expenses={filteredExpenses}
                onApprove={handleApproveExpense}
                onReject={handleRejectExpense}
                onViewDetails={handleViewDetails}
                selectedExpenses={selectedExpenses}
                onSelectionChange={setSelectedExpenses}
              />

              {/* Empty State */}
              {filteredExpenses?.length === 0 && (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No expenses found</h3>
                  <p className="text-muted-foreground mb-4">
                    No expenses match your current filter criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      employee: 'all',
                      category: 'all',
                      status: 'all',
                      priority: 'all',
                      dateFrom: '',
                      dateTo: '',
                      amountMin: '',
                      amountMax: '',
                      searchQuery: '',
                      urgentOnly: false
                    })}
                    iconName="RefreshCw"
                    iconPosition="left"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsPanel analyticsData={mockAnalyticsData} />
          )}
        </div>
        <NotificationToastHost toasts={toasts} onRemove={handleRemoveToast} />
      </main>
    </div>
  );
};

export default ManagerDashboard;