import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import NotificationBadge from '../../../components/ui/NotificationBadge';

const ExpenseTable = ({ expenses, onApprove, onReject, onViewDetails, selectedExpenses, onSelectionChange }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedExpenses = React.useMemo(() => {
    if (!sortConfig?.key) return expenses;

    return [...expenses]?.sort((a, b) => {
      if (sortConfig?.key === 'amount') {
        return sortConfig?.direction === 'asc' ? a?.amount - b?.amount : b?.amount - a?.amount;
      }
      if (sortConfig?.key === 'date') {
        return sortConfig?.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }
      const aValue = a?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
      const bValue = b?.[sortConfig?.key]?.toString()?.toLowerCase() || '';
      return sortConfig?.direction === 'asc' 
        ? aValue?.localeCompare(bValue)
        : bValue?.localeCompare(aValue);
    });
  }, [expenses, sortConfig]);

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(expenses?.map(expense => expense?.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectExpense = (expenseId, checked) => {
    if (checked) {
      onSelectionChange([...selectedExpenses, expenseId]);
    } else {
      onSelectionChange(selectedExpenses?.filter(id => id !== expenseId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'warning', label: 'Pending Review' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'error', label: 'Rejected' },
      escalated: { variant: 'accent', label: 'Escalated' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.pending;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        config?.variant === 'warning' ? 'bg-warning/10 text-warning' :
        config?.variant === 'success' ? 'bg-success/10 text-success' :
        config?.variant === 'error'? 'bg-error/10 text-error' : 'bg-accent/10 text-accent'
      }`}>
        {config?.label}
      </span>
    );
  };

  const getPriorityIcon = (priority) => {
    const priorityConfig = {
      high: { icon: 'AlertTriangle', color: 'text-error' },
      medium: { icon: 'Clock', color: 'text-warning' },
      low: { icon: 'Minus', color: 'text-muted-foreground' }
    };
    
    const config = priorityConfig?.[priority] || priorityConfig?.low;
    return <Icon name={config?.icon} size={16} className={config?.color} />;
  };

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedExpenses?.length === expenses?.length && expenses?.length > 0}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('employee')}
                  className="flex items-center space-x-1 hover:text-primary expense-transition"
                >
                  <span>Employee</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('amount')}
                  className="flex items-center space-x-1 hover:text-primary expense-transition"
                >
                  <span>Amount</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">
                <button
                  onClick={() => handleSort('date')}
                  className="flex items-center space-x-1 hover:text-primary expense-transition"
                >
                  <span>Date</span>
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Category</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-foreground">Priority</th>
              <th className="text-right px-4 py-3 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedExpenses?.map((expense) => (
              <tr key={expense?.id} className="hover:bg-muted/30 expense-transition">
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedExpenses?.includes(expense?.id)}
                    onChange={(e) => handleSelectExpense(expense?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {expense?.employee?.split(' ')?.map(n => n?.[0])?.join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense?.employee}</p>
                      <p className="text-sm text-muted-foreground">{expense?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-foreground">${expense?.amount?.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(expense.date)?.toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium">
                    {expense?.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(expense?.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1">
                    {getPriorityIcon(expense?.priority)}
                    <span className="text-sm text-muted-foreground capitalize">{expense?.priority}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(expense?.id)}
                      iconName="Eye"
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove(expense?.id)}
                      iconName="Check"
                      className="h-8 w-8 p-0 text-success hover:bg-success/10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject(expense?.id)}
                      iconName="X"
                      className="h-8 w-8 p-0 text-error hover:bg-error/10"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {sortedExpenses?.map((expense) => (
          <div key={expense?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={selectedExpenses?.includes(expense?.id)}
                  onChange={(e) => handleSelectExpense(expense?.id, e?.target?.checked)}
                />
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {expense?.employee?.split(' ')?.map(n => n?.[0])?.join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{expense?.employee}</p>
                  <p className="text-sm text-muted-foreground">{expense?.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getPriorityIcon(expense?.priority)}
                {expense?.hasComments && <NotificationBadge count={expense?.commentCount} size="sm" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold text-foreground">${expense?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-foreground">{new Date(expense.date)?.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium">
                  {expense?.category}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(expense?.status)}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(expense?.id)}
                iconName="Eye"
                iconPosition="left"
              >
                View Details
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApprove(expense?.id)}
                  iconName="Check"
                  className="text-success hover:bg-success/10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReject(expense?.id)}
                  iconName="X"
                  className="text-error hover:bg-error/10"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseTable;