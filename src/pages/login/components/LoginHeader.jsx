import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center expense-shadow-md">
          <Icon name="Receipt" size={32} color="white" />
        </div>
      </div>

      {/* Welcome Text */}
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Welcome to ExpenseFlow
      </h1>
      <p className="text-muted-foreground text-lg">
        Sign in to manage your business expenses
      </p>
      
      {/* Subtitle */}
      <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Icon name="Building2" size={16} />
        <span>Enterprise Expense Management Platform</span>
      </div>
    </div>
  );
};

export default LoginHeader;