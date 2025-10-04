import React, { useState } from 'react';
import RoleBasedSidebar from '../../components/ui/RoleBasedSidebar';
import QuickActionButton from '../../components/ui/QuickActionButton';
import AdminOverviewCards from './components/AdminOverviewCards';
import ExpenseAnalyticsChart from './components/ExpenseAnalyticsChart';
import RecentActivitiesTable from './components/RecentActivitiesTable';
import SystemNotifications from './components/SystemNotifications';
import AdminControls from './components/AdminControls';

const AdminDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <RoleBasedSidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        userRole="admin"
      />
      <main className={`expense-transition-layout ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      } pt-16 md:pt-0`}>
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Comprehensive organizational oversight and system management
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last updated</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date()?.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Cards */}
          <AdminOverviewCards />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Analytics Chart - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <ExpenseAnalyticsChart />
            </div>
            
            {/* System Notifications - Takes 1 column */}
            <div className="xl:col-span-1">
              <SystemNotifications />
            </div>
          </div>

          {/* Administrative Controls */}
          <div className="mb-8">
            <AdminControls />
          </div>

          {/* Recent Activities Table */}
          <div className="mb-8">
            <RecentActivitiesTable />
          </div>

          {/* Footer Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-muted-foreground">
                  ExpenseFlow Admin Dashboard - Comprehensive expense management oversight
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  © {new Date()?.getFullYear()} ExpenseFlow. All rights reserved.
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span>System Status: Online</span>
                <span>•</span>
                <span>Last Backup: 2 hours ago</span>
                <span>•</span>
                <span>Version 2.1.0</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Quick Action Button */}
      <QuickActionButton userRole="admin" />
    </div>
  );
};

export default AdminDashboard;