import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 1,
      title: "Submit New Expense",
      description: "Add a new business expense with receipt",
      icon: "Plus",
      color: "bg-primary",
      action: () => navigate('/expense-submission'),
      variant: "default"
    },
    {
      id: 2,
      title: "Scan Receipt",
      description: "Use OCR to extract expense details",
      icon: "Camera",
      color: "bg-accent",
      action: () => navigate('/expense-submission?mode=scan'),
      variant: "outline"
    },
    {
      id: 3,
      title: "View All Expenses",
      description: "Browse and manage all your expenses",
      icon: "FileText",
      color: "bg-secondary",
      action: () => navigate('/expense-details'),
      variant: "outline"
    },
    {
      id: 4,
      title: "Expense Reports",
      description: "Generate and download expense reports",
      icon: "BarChart3",
      color: "bg-success",
      action: () => console.log('Generate reports'),
      variant: "outline"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <Icon name="Zap" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action) => (
          <div
            key={action?.id}
            className="group p-4 border border-border rounded-lg hover:border-primary/50 expense-transition cursor-pointer"
            onClick={action?.action}
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className={`w-10 h-10 ${action?.color} rounded-lg flex items-center justify-center group-hover:scale-110 expense-transition`}>
                <Icon name={action?.icon} size={20} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground group-hover:text-primary expense-transition">
                  {action?.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {action?.description}
                </p>
              </div>
            </div>
            
            <Button
              variant={action?.variant}
              size="sm"
              onClick={(e) => {
                e?.stopPropagation();
                action?.action();
              }}
              iconName="ArrowRight"
              iconPosition="right"
              fullWidth
            >
              {action?.id === 1 ? 'Submit' : 'Open'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;