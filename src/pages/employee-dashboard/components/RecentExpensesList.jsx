import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentExpensesList = () => {
  const [selectedExpenses, setSelectedExpenses] = useState([]);

  const recentExpenses = [
    {
      id: 1,
      amount: "$245.50",
      description: "Business lunch with client",
      category: "Meals & Entertainment",
      date: "2025-10-03",
      status: "pending",
      receipt: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      approvalStage: "Manager Review",
      submittedDate: "2025-10-03T14:30:00"
    },
    {
      id: 2,
      amount: "$89.25",
      description: "Taxi to airport",
      category: "Transportation",
      date: "2025-10-02",
      status: "approved",
      receipt: "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?w=400&h=300&fit=crop",
      approvalStage: "Finance Approved",
      submittedDate: "2025-10-02T09:15:00"
    },
    {
      id: 3,
      amount: "$1,250.00",
      description: "Conference registration fee",
      category: "Training & Development",
      date: "2025-10-01",
      status: "approved",
      receipt: "https://images.pixabay.com/photo/2016/11/29/06/15/plans-1867745_1280.jpg?w=400&h=300&fit=crop",
      approvalStage: "Director Approved",
      submittedDate: "2025-10-01T11:45:00"
    },
    {
      id: 4,
      amount: "$67.80",
      description: "Office supplies",
      category: "Office Expenses",
      date: "2025-09-30",
      status: "rejected",
      receipt: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      approvalStage: "Manager Rejected",
      submittedDate: "2025-09-30T16:20:00",
      rejectionReason: "Missing itemized receipt"
    },
    {
      id: 5,
      amount: "$156.75",
      description: "Hotel accommodation",
      category: "Travel & Lodging",
      date: "2025-09-29",
      status: "reimbursed",
      receipt: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?w=400&h=300&fit=crop",
      approvalStage: "Reimbursed",
      submittedDate: "2025-09-29T08:30:00"
    },
    {
      id: 6,
      amount: "$45.20",
      description: "Parking fees",
      category: "Transportation",
      date: "2025-09-28",
      status: "pending",
      receipt: "https://images.pixabay.com/photo/2016/11/22/19/15/hand-1850120_1280.jpg?w=400&h=300&fit=crop",
      approvalStage: "Manager Review",
      submittedDate: "2025-09-28T17:10:00"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/10';
      case 'approved': return 'text-success bg-success/10';
      case 'rejected': return 'text-error bg-error/10';
      case 'reimbursed': return 'text-accent bg-accent/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'Clock';
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'reimbursed': return 'CreditCard';
      default: return 'Circle';
    }
  };

  const handleExpenseSelect = (expenseId) => {
    setSelectedExpenses(prev => 
      prev?.includes(expenseId) 
        ? prev?.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for expenses:`, selectedExpenses);
    setSelectedExpenses([]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Expenses</h2>
          {selectedExpenses?.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {selectedExpenses?.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('duplicate')}
                iconName="Copy"
                iconPosition="left"
              >
                Duplicate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="divide-y divide-border">
        {recentExpenses?.map((expense) => (
          <div
            key={expense?.id}
            className="p-6 hover:bg-muted/50 expense-transition"
          >
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                checked={selectedExpenses?.includes(expense?.id)}
                onChange={() => handleExpenseSelect(expense?.id)}
                className="mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                <Image
                  src={expense?.receipt}
                  alt="Receipt"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground truncate">
                      {expense?.description}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {expense?.category} • {formatDate(expense?.date)}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold text-foreground">
                      {expense?.amount}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(expense?.status)}`}>
                      <Icon 
                        name={getStatusIcon(expense?.status)} 
                        size={12} 
                        className="mr-1"
                      />
                      {expense?.status?.charAt(0)?.toUpperCase() + expense?.status?.slice(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {expense?.approvalStage}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('View expense', expense?.id)}
                      iconName="Eye"
                      iconPosition="left"
                    >
                      View
                    </Button>
                    {expense?.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Edit expense', expense?.id)}
                        iconName="Edit"
                        iconPosition="left"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>

                {expense?.rejectionReason && (
                  <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded-md">
                    <p className="text-sm text-error">
                      <Icon name="AlertCircle" size={14} className="inline mr-1" />
                      {expense?.rejectionReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 border-t border-border">
        <Button
          variant="outline"
          fullWidth
          onClick={() => console.log('View all expenses')}
          iconName="ArrowRight"
          iconPosition="right"
        >
          View All Expenses
        </Button>
      </div>
    </div>
  );
};

export default RecentExpensesList;