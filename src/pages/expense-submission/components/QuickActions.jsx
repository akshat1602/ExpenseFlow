import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = ({ onLoadDraft, draftCount = 0 }) => {
  const navigate = useNavigate();

  const quickActionItems = [
    {
      label: 'Load Draft',
      description: `${draftCount} saved drafts`,
      icon: 'FileText',
      action: onLoadDraft,
      variant: 'outline',
      disabled: draftCount === 0
    },
    {
      label: 'View Expenses',
      description: 'Track submitted expenses',
      icon: 'Eye',
      action: () => navigate('/expense-details'),
      variant: 'ghost'
    },
    {
      label: 'Dashboard',
      description: 'Return to dashboard',
      icon: 'LayoutDashboard',
      action: () => navigate('/employee-dashboard'),
      variant: 'ghost'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Zap" size={20} className="mr-2 text-accent" />
          Quick Actions
        </h2>
      </div>
      <div className="p-6 space-y-3">
        {quickActionItems?.map((item, index) => (
          <Button
            key={index}
            variant={item?.variant}
            onClick={item?.action}
            disabled={item?.disabled}
            iconName={item?.icon}
            iconPosition="left"
            fullWidth
            className="justify-start h-auto p-4"
          >
            <div className="text-left">
              <div className="font-medium">{item?.label}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {item?.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;