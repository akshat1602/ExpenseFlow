import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

import Button from '../../../components/ui/Button';

const ExpenseAnalyticsChart = () => {
  const [activeChart, setActiveChart] = useState('monthly');

  const monthlyData = [
    { month: 'Jan', amount: 65000, approved: 58000, pending: 7000 },
    { month: 'Feb', amount: 72000, approved: 68000, pending: 4000 },
    { month: 'Mar', amount: 68000, approved: 65000, pending: 3000 },
    { month: 'Apr', amount: 85000, approved: 78000, pending: 7000 },
    { month: 'May', amount: 92000, approved: 85000, pending: 7000 },
    { month: 'Jun', amount: 88000, approved: 82000, pending: 6000 },
    { month: 'Jul', amount: 95000, approved: 89000, pending: 6000 },
    { month: 'Aug', amount: 102000, approved: 96000, pending: 6000 },
    { month: 'Sep', amount: 98000, approved: 92000, pending: 6000 },
    { month: 'Oct', amount: 105000, approved: 98000, pending: 7000 }
  ];

  const departmentData = [
    { department: 'Engineering', amount: 125000, color: '#1E40AF' },
    { department: 'Sales', amount: 98000, color: '#059669' },
    { department: 'Marketing', amount: 87000, color: '#D97706' },
    { department: 'HR', amount: 45000, color: '#DC2626' },
    { department: 'Finance', amount: 32000, color: '#7C3AED' },
    { department: 'Operations', amount: 78000, color: '#0EA5E9' }
  ];

  const trendData = [
    { month: 'Jan', expenses: 65000, budget: 80000 },
    { month: 'Feb', expenses: 72000, budget: 80000 },
    { month: 'Mar', expenses: 68000, budget: 80000 },
    { month: 'Apr', expenses: 85000, budget: 90000 },
    { month: 'May', expenses: 92000, budget: 90000 },
    { month: 'Jun', expenses: 88000, budget: 90000 },
    { month: 'Jul', expenses: 95000, budget: 100000 },
    { month: 'Aug', expenses: 102000, budget: 100000 },
    { month: 'Sep', expenses: 98000, budget: 100000 },
    { month: 'Oct', expenses: 105000, budget: 110000 }
  ];

  const chartTypes = [
    { id: 'monthly', label: 'Monthly Overview', icon: 'BarChart3' },
    { id: 'department', label: 'Department Breakdown', icon: 'PieChart' },
    { id: 'trend', label: 'Budget vs Actual', icon: 'TrendingUp' }
  ];

  const renderChart = () => {
    switch (activeChart) {
      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="approved" fill="#059669" name="Approved" />
              <Bar dataKey="pending" fill="#D97706" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'department':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="amount"
                label={({ department, amount }) => `${department}: $${(amount / 1000)?.toFixed(0)}k`}
              >
                {departmentData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`$${value?.toLocaleString()}`, 'Amount']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'trend':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#DC2626" 
                strokeWidth={3}
                name="Actual Expenses"
              />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke="#059669" 
                strokeWidth={3}
                strokeDasharray="5 5"
                name="Budget"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 expense-shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Expense Analytics</h2>
          <p className="text-sm text-muted-foreground">Organizational spending insights and trends</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
          {chartTypes?.map((type) => (
            <Button
              key={type?.id}
              variant={activeChart === type?.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveChart(type?.id)}
              iconName={type?.icon}
              iconPosition="left"
              className="text-xs"
            >
              {type?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="w-full">
        {renderChart()}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">$1.2M</p>
            <p className="text-xs text-muted-foreground">YTD Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">94.2%</p>
            <p className="text-xs text-muted-foreground">Approval Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-warning">$45K</p>
            <p className="text-xs text-muted-foreground">Avg Monthly</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">2.3 days</p>
            <p className="text-xs text-muted-foreground">Avg Processing</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalyticsChart;