import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ExpenseInformation = ({ expense }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="FileText" size={20} className="text-primary" />
        <span>Expense Information</span>
      </h2>
      <div className="space-y-6">
        {/* Description */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <p className="mt-1 text-foreground bg-muted/30 p-3 rounded-md">
            {expense?.description}
          </p>
        </div>

        {/* Business Purpose */}
        <div>
          <label className="text-sm font-medium text-muted-foreground">Business Purpose</label>
          <p className="mt-1 text-foreground bg-muted/30 p-3 rounded-md">
            {expense?.businessPurpose}
          </p>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Employee</label>
            <div className="mt-2 flex items-center space-x-3 bg-muted/30 p-3 rounded-md">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
                <Image
                  src={expense?.employeeAvatar}
                  alt={expense?.employeeName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{expense?.employeeName}</p>
                <p className="text-sm text-muted-foreground">{expense?.employeeEmail}</p>
                <p className="text-xs text-accent">{expense?.employeeId}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Manager</label>
            <div className="mt-2 flex items-center space-x-3 bg-muted/30 p-3 rounded-md">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
                <Image
                  src={expense?.managerAvatar}
                  alt={expense?.managerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-foreground">{expense?.managerName}</p>
                <p className="text-sm text-muted-foreground">{expense?.managerEmail}</p>
                <p className="text-xs text-accent">Direct Manager</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="MapPin" size={16} className="text-accent" />
              <span className="text-sm font-medium text-muted-foreground">Location</span>
            </div>
            <p className="text-foreground">{expense?.location}</p>
          </div>

          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="CreditCard" size={16} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Payment Method</span>
            </div>
            <p className="text-foreground">{expense?.paymentMethod}</p>
          </div>

          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Building" size={16} className="text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">Vendor</span>
            </div>
            <p className="text-foreground">{expense?.vendor}</p>
          </div>
        </div>

        {/* Project Information */}
        {expense?.projectCode && (
          <div className="bg-accent/10 border border-accent/20 p-4 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Briefcase" size={16} className="text-accent" />
              <span className="text-sm font-medium text-accent">Project Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-muted-foreground">Project Code:</span>
                <p className="font-medium text-foreground">{expense?.projectCode}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Project Name:</span>
                <p className="font-medium text-foreground">{expense?.projectName}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseInformation;