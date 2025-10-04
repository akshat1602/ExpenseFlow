import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Icon from '../AppIcon';

const QuickActionButton = ({ userRole = 'employee', className = '' }) => {
  const navigate = useNavigate();

  const actionConfig = {
    employee: {
      label: 'Submit Expense',
      icon: 'Plus',
      path: '/expense-submission',
      variant: 'default'
    },
    manager: {
      label: 'Review Pending',
      icon: 'Clock',
      path: '/expense-details',
      variant: 'outline'
    },
    admin: {
      label: 'Admin Panel',
      icon: 'Settings',
      path: '/admin-dashboard',
      variant: 'secondary'
    }
  };

  const config = actionConfig?.[userRole] || actionConfig?.employee;

  const handleAction = () => {
    navigate(config?.path);
  };

  return (
    <>
      {/* Desktop version - integrated button */}
      <div className={`hidden md:block ${className}`}>
        <Button
          variant={config?.variant}
          onClick={handleAction}
          iconName={config?.icon}
          iconPosition="left"
          fullWidth
          className="justify-start"
        >
          {config?.label}
        </Button>
      </div>
      {/* Mobile version - floating action button */}
      <button
        onClick={handleAction}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full expense-shadow-lg flex items-center justify-center z-100 expense-spring hover:scale-110 active:scale-95"
        aria-label={config?.label}
      >
        <Icon name={config?.icon} size={24} />
      </button>
    </>
  );
};

export default QuickActionButton;