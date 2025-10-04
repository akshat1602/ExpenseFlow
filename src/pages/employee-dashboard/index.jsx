import React, { useState, useEffect } from 'react';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import ExpenseSummaryCards from './components/ExpenseSummaryCards';
import RecentExpensesList from './components/RecentExpensesList';
import ExpenseFilters from './components/ExpenseFilters';
import QuickActions from './components/QuickActions';
import NotificationCenter from './components/NotificationCenter';
import Icon from '../../components/AppIcon';

const EmployeeDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filters, setFilters] = useState({});

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters updated:', newFilters);
  };

  const formatGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return currentTime?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        userRole="employee"
      />
      <main className={`expense-transition-layout ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      }`}>
        <div className="p-4 md:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {formatGreeting()}, John! 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  {formatDate()}
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Clock" size={16} />
                  <span>{currentTime?.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
                <QuickActionButton userRole="employee" />
              </div>
            </div>
            
            <div className="w-full h-px bg-gradient-to-r from-primary/20 via-primary/40 to-transparent"></div>
          </div>

          {/* Summary Cards */}
          <ExpenseSummaryCards />

          {/* Quick Actions */}
          <QuickActions />

          {/* Notifications */}
          <NotificationCenter />

          {/* Filters */}
          <ExpenseFilters
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
            onFiltersChange={handleFiltersChange}
          />

          {/* Recent Expenses */}
          <RecentExpensesList />

          {/* Mobile Quick Action Button */}
          <QuickActionButton userRole="employee" />
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;