import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';

const UserProfileDropdown = ({ userRole = 'employee', isCollapsed = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mock user data - in real app, this would come from context/API
  const userData = {
    employee: {
      name: 'John Smith',
      email: 'john.smith@company.com',
      avatar: '/assets/images/avatars/employee.jpg',
      role: 'Employee'
    },
    manager: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: '/assets/images/avatars/manager.jpg',
      role: 'Manager'
    },
    admin: {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      avatar: '/assets/images/avatars/admin.jpg',
      role: 'Administrator'
    }
  };

  const currentUser = userData?.[userRole] || userData?.employee;

  const menuItems = [
    { label: 'Profile Settings', icon: 'User', action: 'profile' },
    { label: 'Notification Preferences', icon: 'Bell', action: 'notifications' },
    { label: 'Help & Support', icon: 'HelpCircle', action: 'help' },
    { label: 'Sign Out', icon: 'LogOut', action: 'logout', variant: 'destructive' }
  ];

  const handleMenuAction = (action) => {
    setIsOpen(false);
    const navigate = navigateRef?.current || null;
    switch (action) {
      case 'profile':
        navigate?.('/profile');
        break;
      case 'notifications':
        navigate?.('/notifications');
        break;
      case 'help':
        navigate?.('/help');
        break;
      case 'logout':
        // Clear authentication state (app-specific). We'll clear localStorage keys commonly used.
        try { localStorage.removeItem('token'); } catch (e) {}
        try { localStorage.removeItem('expenseflow-theme'); } catch (e) {}
        // Navigate to login page
        navigate?.('/login');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // useNavigate needs to be called in component body; store in ref for handlers declared earlier
  const navigateRef = React.useRef(null);
  const navigate = useNavigate();
  useEffect(() => { navigateRef.current = navigate; }, [navigate]);

  if (isCollapsed) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-full overflow-hidden border-2 border-border hover:border-primary expense-transition"
        >
          <Image
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-full h-full object-cover"
          />
        </button>
        {isOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-popover border border-border rounded-lg expense-shadow-lg animate-fade-in">
            <div className="p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-popover-foreground truncate">
                    {currentUser?.name}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentUser?.email}
                  </p>
                  <p className="text-xs text-accent font-medium">
                    {currentUser?.role}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              {menuItems?.map((item) => (
                <button
                  key={item?.action}
                  onClick={() => handleMenuAction(item?.action)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md expense-transition text-left ${
                    item?.variant === 'destructive' ?'text-destructive hover:bg-destructive/10' :'text-popover-foreground hover:bg-muted'
                  }`}
                >
                  <Icon 
                    name={item?.icon} 
                    size={16} 
                    className={item?.variant === 'destructive' ? 'text-destructive' : ''}
                  />
                  <span className="text-sm">{item?.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-muted expense-transition"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border">
          <Image
            src={currentUser?.avatar}
            alt={currentUser?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="font-medium text-foreground truncate text-sm">
            {currentUser?.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentUser?.role}
          </p>
        </div>
        <Icon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="text-muted-foreground"
        />
      </button>
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-popover border border-border rounded-lg expense-shadow-lg animate-fade-in">
          <div className="p-2">
            {menuItems?.map((item) => (
              <button
                key={item?.action}
                onClick={() => handleMenuAction(item?.action)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md expense-transition text-left ${
                  item?.variant === 'destructive' ?'text-destructive hover:bg-destructive/10' :'text-popover-foreground hover:bg-muted'
                }`}
              >
                <Icon 
                  name={item?.icon} 
                  size={16} 
                  className={item?.variant === 'destructive' ? 'text-destructive' : ''}
                />
                <span className="text-sm">{item?.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;