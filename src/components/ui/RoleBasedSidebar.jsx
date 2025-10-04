import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import NotificationBadge from './NotificationBadge';
import UserProfileDropdown from './UserProfileDropdown';

const RoleBasedSidebar = ({ isCollapsed = false, onToggle, userRole = 'employee' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Mock notification counts - in real app, this would come from context/API
  const [notifications, setNotifications] = useState({
    employee: { dashboard: 2, submission: 0 },
    manager: { dashboard: 5, pending: 8 },
    admin: { dashboard: 12, reports: 3 }
  });

  const navigationItems = {
    employee: [
      {
        label: 'Dashboard',
        path: '/employee-dashboard',
        icon: 'LayoutDashboard',
        badge: notifications?.employee?.dashboard
      },
      {
        label: 'Submit Expense',
        path: '/expense-submission',
        icon: 'Plus',
        badge: notifications?.employee?.submission
      },
      {
        label: 'Expense Details',
        path: '/expense-details',
        icon: 'FileText',
        badge: 0
      }
    ],
    manager: [
      {
        label: 'Dashboard',
        path: '/manager-dashboard',
        icon: 'LayoutDashboard',
        badge: notifications?.manager?.dashboard
      },
      {
        label: 'Pending Reviews',
        path: '/expense-details',
        icon: 'Clock',
        badge: notifications?.manager?.pending
      },
      {
        label: 'Submit Expense',
        path: '/expense-submission',
        icon: 'Plus',
        badge: 0
      }
    ],
    admin: [
      {
        label: 'Admin Dashboard',
        path: '/admin-dashboard',
        icon: 'Settings',
        badge: notifications?.admin?.dashboard
      },
      {
        label: 'All Expenses',
        path: '/expense-details',
        icon: 'FileText',
        badge: notifications?.admin?.reports
      },
      {
        label: 'Manager Dashboard',
        path: '/manager-dashboard',
        icon: 'Users',
        badge: 0
      }
    ]
  };

  const currentNavItems = navigationItems?.[userRole] || navigationItems?.employee;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile overlay
  if (isMobileOpen) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-200 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
        <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-300 md:hidden animate-slide-in-left">
          <SidebarContent 
            currentNavItems={currentNavItems}
            userRole={userRole}
            isActivePath={isActivePath}
            handleNavigation={handleNavigation}
            isCollapsed={false}
            onClose={() => setIsMobileOpen(false)}
            onToggle={undefined}
          />
        </aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-100 p-2 bg-card border border-border rounded-md expense-shadow-sm md:hidden"
      >
        <Icon name="Menu" size={20} />
      </button>

      {/* Desktop sidebar */}
      <aside className={`hidden md:block fixed left-0 top-0 h-full bg-card border-r border-border z-100 expense-transition-layout ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}>
        <SidebarContent 
          currentNavItems={currentNavItems}
          userRole={userRole}
          isActivePath={isActivePath}
          handleNavigation={handleNavigation}
          isCollapsed={isCollapsed}
          onToggle={onToggle}
          onClose={undefined}
        />
      </aside>
    </>
  );
};

const SidebarContent = ({ 
  currentNavItems, 
  userRole, 
  isActivePath, 
  handleNavigation, 
  isCollapsed, 
  onToggle,
  onClose 
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Icon name="Receipt" size={20} color="white" />
            </div>
            <span className="font-semibold text-lg text-foreground">ExpenseFlow</span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mx-auto">
            <Icon name="Receipt" size={20} color="white" />
          </div>
        )}

        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <Icon name="X" size={20} />
          </button>
        )}

        {onToggle && !onClose && (
          <button 
            onClick={onToggle}
            className="p-1 hover:bg-muted rounded expense-transition"
          >
            <Icon name={isCollapsed ? "ChevronRight" : "ChevronLeft"} size={20} />
          </button>
        )}
      </div>
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {currentNavItems?.map((item) => (
          <button
            key={item?.path}
            onClick={() => handleNavigation(item?.path)}
            className={`w-full flex items-center space-x-3 px-3 py-3 rounded-md expense-transition group ${
              isActivePath(item?.path)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            } ${isCollapsed ? 'justify-center' : ''}`}
          >
            <Icon 
              name={item?.icon} 
              size={20} 
              className={isActivePath(item?.path) ? 'text-primary-foreground' : ''}
            />
            {!isCollapsed && (
              <>
                <span className="font-medium flex-1 text-left">{item?.label}</span>
                {item?.badge > 0 && (
                  <NotificationBadge count={item?.badge} />
                )}
              </>
            )}
          </button>
        ))}
      </nav>
      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <UserProfileDropdown 
          userRole={userRole} 
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export default RoleBasedSidebar;