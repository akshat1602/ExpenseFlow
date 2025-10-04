import React from 'react';
import Icon from '../../../components/AppIcon';

const AdminOverviewCards = () => {
  const overviewData = [
    {
      id: 1,
      title: "Total Monthly Expenses",
      value: "$847,250",
      change: "+12.5%",
      changeType: "increase",
      icon: "DollarSign",
      color: "bg-primary",
      description: "Current month spending"
    },
    {
      id: 2,
      title: "Pending Approvals",
      value: "156",
      change: "-8.2%",
      changeType: "decrease",
      icon: "Clock",
      color: "bg-warning",
      description: "Awaiting review"
    },
    {
      id: 3,
      title: "Policy Violations",
      value: "23",
      change: "+15.3%",
      changeType: "increase",
      icon: "AlertTriangle",
      color: "bg-error",
      description: "Flagged expenses"
    },
    {
      id: 4,
      title: "Budget Utilization",
      value: "78.4%",
      change: "+5.1%",
      changeType: "increase",
      icon: "TrendingUp",
      color: "bg-success",
      description: "Of allocated budget"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {overviewData?.map((item) => (
        <div key={item?.id} className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${item?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={item?.icon} size={24} color="white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              item?.changeType === 'increase' ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={item?.changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
              />
              <span>{item?.change}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-foreground">{item?.value}</h3>
            <p className="text-sm font-medium text-foreground">{item?.title}</p>
            <p className="text-xs text-muted-foreground">{item?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOverviewCards;