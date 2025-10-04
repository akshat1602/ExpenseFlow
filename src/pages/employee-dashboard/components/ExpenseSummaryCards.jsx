import React from 'react';
import Icon from '../../../components/AppIcon';

const ExpenseSummaryCards = () => {
  const summaryData = [
    {
      id: 1,
      title: "Monthly Total",
      amount: "$2,847.50",
      change: "+12.5%",
      changeType: "increase",
      icon: "DollarSign",
      color: "bg-primary",
      description: "Total expenses this month"
    },
    {
      id: 2,
      title: "Pending Approval",
      amount: "$1,245.00",
      change: "3 items",
      changeType: "neutral",
      icon: "Clock",
      color: "bg-warning",
      description: "Awaiting manager review"
    },
    {
      id: 3,
      title: "Approved",
      amount: "$1,602.50",
      change: "+8.2%",
      changeType: "increase",
      icon: "CheckCircle",
      color: "bg-success",
      description: "Ready for reimbursement"
    },
    {
      id: 4,
      title: "Reimbursed",
      amount: "$892.75",
      change: "Last 30 days",
      changeType: "neutral",
      icon: "CreditCard",
      color: "bg-accent",
      description: "Processed payments"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryData?.map((item) => (
        <div
          key={item?.id}
          className="bg-card border border-border rounded-lg p-6 expense-shadow-sm hover:expense-shadow-md expense-transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${item?.color} rounded-lg flex items-center justify-center`}>
              <Icon name={item?.icon} size={24} color="white" />
            </div>
            <div className={`text-sm font-medium ${
              item?.changeType === 'increase' ? 'text-success' : 
              item?.changeType === 'decrease'? 'text-error' : 'text-muted-foreground'
            }`}>
              {item?.change}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{item?.amount}</h3>
            <p className="text-sm font-medium text-foreground">{item?.title}</p>
            <p className="text-xs text-muted-foreground">{item?.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseSummaryCards;