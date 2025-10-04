import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterControls = ({ filters, onFiltersChange, expenseCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const employeeOptions = [
    { value: 'all', label: 'All Employees' },
    { value: 'john-smith', label: 'John Smith' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emily-davis', label: 'Emily Davis' },
    { value: 'david-brown', label: 'David Brown' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'travel', label: 'Travel & Transportation' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'office', label: 'Office Supplies' },
    { value: 'software', label: 'Software & Subscriptions' },
    { value: 'training', label: 'Training & Development' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'escalated', label: 'Escalated' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      employee: 'all',
      category: 'all',
      status: 'all',
      priority: 'all',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      searchQuery: '',
      urgentOnly: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.employee !== 'all') count++;
    if (filters?.category !== 'all') count++;
    if (filters?.status !== 'all') count++;
    if (filters?.priority !== 'all') count++;
    if (filters?.dateFrom) count++;
    if (filters?.dateTo) count++;
    if (filters?.amountMin) count++;
    if (filters?.amountMax) count++;
    if (filters?.searchQuery) count++;
    if (filters?.urgentOnly) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg expense-shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {expenseCount} expense{expenseCount !== 1 ? 's' : ''}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            className="lg:hidden"
          />
        </div>
      </div>
      {/* Quick Filters - Always Visible */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            type="search"
            placeholder="Search expenses..."
            value={filters?.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
            className="w-full"
          />
          <Select
            options={employeeOptions}
            value={filters?.employee}
            onChange={(value) => handleFilterChange('employee', value)}
            placeholder="Select employee"
          />
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Select status"
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              label="Urgent only"
              checked={filters?.urgentOnly}
              onChange={(e) => handleFilterChange('urgentOnly', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Advanced Filters - Expandable */}
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => handleFilterChange('category', value)}
            />
            <Select
              label="Priority"
              options={priorityOptions}
              value={filters?.priority}
              onChange={(value) => handleFilterChange('priority', value)}
            />
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-sm font-medium text-foreground mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="date"
                  value={filters?.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={filters?.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={filters?.amountMin}
                  onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
                />
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={filters?.amountMax}
                  onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
                />
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
              disabled={activeFilterCount === 0}
            >
              Clear Filters
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;